import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventOccurrence, EventWithCount, supabase } from "./supabase";

export const useEvents = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<EventWithCount[]> => {
      // Use RPC function to fetch events with counts
      const { data, error } = await supabase.rpc('get_events_with_counts');

      if (error) {
        throw new Error(`Error fetching events: ${error.message}`);
      }

      return data || [];
    },
    enabled,
  });
};

export const useIncrementEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("event_occurrences")
        .insert({ event_id: eventId });

      if (error) {
        throw new Error(`Error creating occurrence: ${error.message}`);
      }

      return eventId;
    },
    onSuccess: (eventId) => {
      // Optimistically update the cache
      queryClient.setQueryData<EventWithCount[]>(["events"], (old) => {
        if (!old) return old;
        return old.map((event) =>
          event.id === eventId ? { ...event, count: event.count + 1 } : event,
        );
      });

      // Invalidate occurrences queries for this event
      queryClient.invalidateQueries({
        queryKey: ["event-occurrences", eventId],
        exact: false,
      });
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("events")
        .insert({ name })
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating event: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useEvent = (
  eventId: string | undefined,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async (): Promise<EventWithCount> => {
      if (!eventId) {
        throw new Error("Event ID is required");
      }

      const { data: event, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (eventError) {
        throw new Error(`Error fetching event: ${eventError.message}`);
      }

      const { count, error: countError } = await supabase
        .from("event_occurrences")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId);

      if (countError) {
        console.error("Error fetching count for event:", eventId, countError);
        return { ...event, count: 0 };
      }

      return { ...event, count: count || 0 };
    },
    enabled: enabled && !!eventId,
  });
};

export const useEventOccurrences = (
  eventId: string | undefined,
  timeframe: "hour" | "day" | "week" | "month" | "year" = "day",
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["event-occurrences", eventId, timeframe],
    queryFn: async (): Promise<EventOccurrence[]> => {
      if (!eventId) {
        throw new Error("Event ID is required");
      }

      const now = new Date();
      let startDate: Date;

      switch (timeframe) {
        case "hour":
          startDate = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case "day":
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      const { data, error } = await supabase
        .from("event_occurrences")
        .select("*")
        .eq("event_id", eventId)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", now.toISOString())
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error fetching occurrences: ${error.message}`);
      }

      return data || [];
    },
    enabled: enabled && !!eventId,
  });
};
