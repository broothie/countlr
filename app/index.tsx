import { useState } from "react";
import { Button, Card, Text, XStack, YStack } from "tamagui";

const events = [
  { id: 1, name: "Birthday Party", count: 0 },
  { id: 2, name: "Conference", count: 0 },
  { id: 3, name: "Dentist Appointment", count: 0 },
];

export default function EventsPage() {
  const [eventCounts, setEventCounts] = useState(events);

  const incrementCount = (id: number) => {
    setEventCounts((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, count: event.count + 1 } : event,
      ),
    );
  };

  return (
    <YStack flex={1} space="$4" p="$4">
      {eventCounts.map((event) => (
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
