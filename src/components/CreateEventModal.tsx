import {useEffect, useRef, useState} from "react";
import {Modal, TextInput} from "react-native";
import {Button, Input, Text, XStack, YStack} from "tamagui";
import {useCreateEvent} from "../lib/event-hooks";

interface CreateEventModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateEventModal({isOpen, onOpenChange}: CreateEventModalProps) {
	const createEventMutation = useCreateEvent();
	const [newEventName, setNewEventName] = useState("");
	const inputRef = useRef<TextInput>(null);

	useEffect(() => {
		if (isOpen) {
			const timer = setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	const handleCreateEvent = () => {
		if (!newEventName.trim()) return;
		createEventMutation.mutate(newEventName.trim());
		setNewEventName("");
		onOpenChange(false);
	};

	return (
		<Modal
			visible={isOpen}
			animationType="slide"
			presentationStyle="pageSheet"
			onRequestClose={() => onOpenChange(false)}
		>
			<YStack flex={1} p="$4" bg="$background" justifyContent="center">
				<YStack gap="$4" maxWidth={400} alignSelf="center" width="100%">
					<Text fontSize="$6" fontWeight="bold" textAlign="center">
						Create New Event
					</Text>
					<Input
						ref={inputRef}
						placeholder="Event name"
						value={newEventName}
						onChangeText={setNewEventName}
						onSubmitEditing={handleCreateEvent}
						fontSize="$4"
					/>
					{createEventMutation.error && (
						<Text color="$red10" fontSize="$3" textAlign="center">
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
			</YStack>
		</Modal>
	);
}