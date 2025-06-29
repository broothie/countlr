import { Link } from "expo-router";
import { Button, Text, YStack } from "tamagui";

export default function Home() {
  return (
    <YStack flex={1} space="$4">
      <Text fontSize="$8" fontWeight="bold">
        Countlr
      </Text>
      <Text fontSize="$4">Track your events and activities</Text>
      <Link href="/events" asChild>
        <Button size="$4" theme="blue">
          View Events
        </Button>
      </Link>
    </YStack>
  );
}
