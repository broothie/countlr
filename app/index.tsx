import { router, Stack } from "expo-router";
import { useState } from "react";
import { Button, Card, Input, Sheet, Text, XStack, YStack } from "tamagui";
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
    setIsCreateModalOpen(false);
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
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button
              size="$2"
              circular
              onPress={() => setIsCreateModalOpen(true)}
              bg="$green10"
              color="white"
              mr="$3"
            >
              +
            </Button>
          ),
        }}
      />
      <YStack flex={1} gap="$4" p="$4">
        <XStack
          style={{ justifyContent: "flex-end", alignItems: "center" }}
          p="$2"
        >
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

      <Sheet
        modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        snapPointsMode="fit"
        dismissOnSnapToBottom
      >
        <Sheet.Frame p="$4" bg="$background" pb="$6">
          <Sheet.Handle />
          <YStack gap="$4" pb="$4">
            <Text fontSize="$6" fontWeight="bold" style={{ textAlign: 'center' }}>
              Create New Event
            </Text>
            <Input
              placeholder="Event name"
              value={newEventName}
              onChangeText={setNewEventName}
              onSubmitEditing={handleCreateEvent}
              fontSize="$4"
            />
            {createEventMutation.error && (
              <Text color="$red10" fontSize="$3" style={{ textAlign: 'center' }}>
                {createEventMutation.error.message}
              </Text>
            )}
            <XStack gap="$3">
              <Button
                flex={1}
                onPress={() => setIsCreateModalOpen(false)}
                bg="$backgroundPress"
                color="white"
              >
                Cancel
              </Button>
              <Button
                flex={1}
                onPress={handleCreateEvent}
                disabled={createEventMutation.isPending || !newEventName.trim()}
                bg="$green10"
                color="white"
              >
                {createEventMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
      </Sheet>
      </YStack>
    </>
  );
}
