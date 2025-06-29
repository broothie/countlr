import { Button, Card, Text, XStack, YStack } from "tamagui";
import { useEvents, useIncrementEvent } from "../src/lib/hooks";

export default function EventsPage() {
  const { data: events = [], isLoading, error } = useEvents();
  const incrementMutation = useIncrementEvent();

  const handleIncrement = (eventId: string) => {
    incrementMutation.mutate(eventId);
  };

  if (isLoading) {
    return (
      <YStack
        flex={1}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Text>Loading events...</Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack
        flex={1}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Text>Error: {error.message}</Text>
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
            style={{ justifyContent: "space-between", alignItems: "center" }}
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
              onPress={() => handleIncrement(event.id)}
              bg="$blue10"
              color="white"
              disabled={incrementMutation.isPending}
            >
              +
            </Button>
          </XStack>
        </Card>
      ))}
    </YStack>
  );
}
