import { router } from "expo-router";
import { useState } from "react";
import { Button, Card, Input, Text, XStack, YStack } from "tamagui";
import { useAuth, useSignOut } from "../src/lib/auth-hooks";
import {
  useCreateEvent,
  useEvents,
  useIncrementEvent,
} from "../src/lib/event-hooks";

export default function EventsPage() {
  const { user, loading } = useAuth();
  const { data: events = [], isLoading, error } = useEvents(!!user);
  const incrementMutation = useIncrementEvent();
  const signOutMutation = useSignOut();
  const createEventMutation = useCreateEvent();
  const [newEventName, setNewEventName] = useState("");

  const handleIncrement = (eventId: string) => {
    incrementMutation.mutate(eventId);
  };

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  const handleCreateEvent = () => {
    if (!newEventName.trim()) return;
    createEventMutation.mutate(newEventName.trim());
    setNewEventName("");
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
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
      <XStack
        style={{ justifyContent: "space-between", alignItems: "center" }}
        p="$2"
      >
        <Text fontSize="$4" fontWeight="bold">
          Welcome, {user.email}
        </Text>
        <Button
          size="$2"
          onPress={handleSignOut}
          bg="$red10"
          color="white"
          disabled={signOutMutation.isPending}
        >
          Sign Out
        </Button>
      </XStack>

      <Card
        p="$4"
        backgroundColor="$background"
        borderColor="$borderColor"
        borderWidth={1}
      >
        <YStack space="$3">
          <Text fontSize="$5" fontWeight="bold">
            Create New Event
          </Text>
          <XStack space="$2">
            <Input
              flex={1}
              placeholder="Event name"
              value={newEventName}
              onChangeText={setNewEventName}
              onSubmitEditing={handleCreateEvent}
            />
            <Button
              onPress={handleCreateEvent}
              disabled={createEventMutation.isPending || !newEventName.trim()}
              bg="$green10"
              color="white"
            >
              {createEventMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </XStack>
          {createEventMutation.error && (
            <Text color="$red10" fontSize="$2">
              {createEventMutation.error.message}
            </Text>
          )}
        </YStack>
      </Card>

      {events.map((event) => (
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
                handleIncrement(event.id);
              }}
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
