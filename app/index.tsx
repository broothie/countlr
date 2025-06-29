import { useEffect, useState } from "react";
import { Button, Card, Text, XStack, YStack } from "tamagui";
import { EventWithCount, supabase } from "../src/lib/supabase";

export default function EventsPage() {
  const [events, setEvents] = useState<EventWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Fetch events with their occurrence counts
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: true });

      if (eventsError) {
        console.error("Error fetching events:", eventsError);
        return;
      }

      console.log({ events });

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

      setEvents(eventsWithCounts);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const incrementCount = async (eventId: string) => {
    try {
      // Insert a new occurrence
      const { error } = await supabase
        .from("event_occurrences")
        .insert({ event_id: eventId });

      if (error) {
        console.error("Error creating occurrence:", error);
        return;
      }

      // Update local state
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, count: event.count + 1 } : event,
        ),
      );
    } catch (error) {
      console.error("Error creating occurrence:", error);
    }
  };

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading events...</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} space="$4" p="$4">
      {events.map((event) => (
        <Card
          key={event.id}
          padding="$4"
          backgroundColor="$background"
          borderColor="$borderColor"
          borderWidth={1}
        >
          <XStack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <YStack>
              <Text fontSize="$5" fontWeight="bold">
                {event.name}
              </Text>
              <Text fontSize="$3">Count: {event.count}</Text>
            </YStack>
            <Button
              size="$3"
              circular
              onPress={() => incrementCount(event.id)}
              bg="$blue10"
              color="white"
            >
              +
            </Button>
          </XStack>
        </Card>
      ))}
    </YStack>
  );
}
