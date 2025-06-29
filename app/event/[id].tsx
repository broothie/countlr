import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useLayoutEffect } from "react";
import { Button, Card, Text, YStack } from "tamagui";
import { useAuth } from "../../src/lib/auth-hooks";
import { useEvent, useIncrementEvent } from "../../src/lib/event-hooks";

export default function EventDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, loading } = useAuth();
  const { data: event, isLoading, error } = useEvent(id, !!user);
  const incrementMutation = useIncrementEvent();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (event?.name) {
      navigation.setOptions({
        title: event.name,
      });
    }
  }, [event?.name, navigation]);

  const handleIncrement = () => {
    if (id) {
      incrementMutation.mutate(id);
    }
  };

  if (loading) {
    return (
      <YStack
        flex={1}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Text>Loading...</Text>
      </YStack>
    );
  }

  if (!user) {
    router.replace("/sign-in");
    return null;
  }

  if (isLoading) {
    return (
      <YStack
        flex={1}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Text>Loading event...</Text>
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

  if (!event) {
    return (
      <YStack
        flex={1}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Text>Event not found</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} space="$4" p="$4">
      <Card
        p="$6"
        backgroundColor="$background"
        borderColor="$borderColor"
        borderWidth={1}
      >
        <YStack space="$4" style={{ alignItems: "center" }}>
          <Text fontSize="$8" fontWeight="bold">
            {event.name}
          </Text>
          <Text fontSize="$10" fontWeight="bold" color="$blue10">
            {event.count}
          </Text>
          <Button
            size="$5"
            circular
            onPress={handleIncrement}
            bg="$blue10"
            color="white"
            disabled={incrementMutation.isPending}
            width={80}
            height={80}
          >
            <Text fontSize="$6">+</Text>
          </Button>
        </YStack>
      </Card>
    </YStack>
  );
}
