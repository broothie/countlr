import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventWithCount, supabase } from "./supabase";

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<EventWithCount[]> => {
      // Fetch events with their occurrence counts
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: true });

      if (eventsError) {
        throw new Error(`Error fetching events: ${eventsError.message}`);
      }

      // Fetch occurrence counts for each event
      const eventsWithCounts = await Promise.all(
        eventsData.map(async (event) => {
          const { count, error: countError } = await supabase
            .from("event_occurrences")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id);

          if (countError) {
            console.error(
              "Error fetching count for event:",
              event.id,
              countError,
            );
            return { ...event, count: 0 };
          }

          return { ...event, count: count || 0 };
        }),
      );

      return eventsWithCounts;
    },
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
    },
  });
};
