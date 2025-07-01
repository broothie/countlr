import { useState } from "react";
import { Button, Input, Sheet, Text, XStack, YStack } from "tamagui";
import { useCreateEvent } from "../lib/event-hooks";

interface CreateEventModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventModal({ isOpen, onOpenChange }: CreateEventModalProps) {
  const createEventMutation = useCreateEvent();
  const [newEventName, setNewEventName] = useState("");

  const handleCreateEvent = () => {
    if (!newEventName.trim()) return;
    createEventMutation.mutate(newEventName.trim());
    setNewEventName("");
    onOpenChange(false);
  };

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={onOpenChange}
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
              onPress={() => onOpenChange(false)}
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
  );
}