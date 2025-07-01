import { router } from "expo-router";
import { Button, Card, Text, XStack, YStack } from "tamagui";
import { EventWithCount } from "../lib/supabase";

interface EventCardProps {
  event: EventWithCount;
  onIncrement: (eventId: string) => void;
  isIncrementPending: boolean;
}

export function EventCard({ event, onIncrement, isIncrementPending }: EventCardProps) {
  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  return (
    <Card
      key={event.id}
      padding="$4"
      backgroundColor="$background"
      borderColor="$borderColor"
      borderWidth={1}
      pressStyle={{ opacity: 0.8 }}
      onPress={() => handleEventPress(event.id)}
    >
      <XStack
        flexDirection="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <YStack flex={1}>
          <Text fontSize="$5" fontWeight="bold">
            {event.name}
          </Text>
          <Text fontSize="$3">Count: {event.count}</Text>
        </YStack>
        <Button
          size="$3"
          circular
          onPress={(e) => {
            e.stopPropagation();
            onIncrement(event.id);
          }}
          bg="$blue10"
          color="white"
          disabled={isIncrementPending}
        >
          +
        </Button>
      </XStack>
    </Card>
  );
}