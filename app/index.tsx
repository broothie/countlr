import {router, Stack} from "expo-router";
import {useState} from "react";
import {Button, Text, XStack, YStack} from "tamagui";
import {useAuth, useSignOut} from "../src/lib/auth-hooks";
import {useEvents, useIncrementEvent,} from "../src/lib/event-hooks";
import {CreateEventHeaderButton} from "../src/components/CreateEventHeaderButton";
import {CreateEventModal} from "../src/components/CreateEventModal";
import {EventCard} from "../src/components/EventCard";

export default function EventsPage() {
  const { user, loading } = useAuth();
  const { data: events = [], isLoading, error } = useEvents(!!user);
  const incrementMutation = useIncrementEvent();
  const signOutMutation = useSignOut();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleIncrement = (eventId: string) => {
    incrementMutation.mutate(eventId);
  };

  const handleSignOut = () => {
    signOutMutation.mutate();
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
            <CreateEventHeaderButton
              onPress={() => setIsCreateModalOpen(true)}
            />
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
          <EventCard
            key={event.id}
            event={event}
            onIncrement={handleIncrement}
            isIncrementPending={incrementMutation.isPending}
          />
        ))}

        <CreateEventModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
        />
      </YStack>
    </>
  );
}
