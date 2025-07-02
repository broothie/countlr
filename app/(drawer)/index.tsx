import {useRouter} from "expo-router";
import {useState} from "react";
import {Button, Text, YStack} from "tamagui";
import {useAuth} from "../../src/lib/auth-hooks";
import {useEvents, useIncrementEvent} from "../../src/lib/event-hooks";
import {CreateEventModal} from "../../src/components/CreateEventModal";
import {EventCard} from "../../src/components/EventCard";
import {Plus} from "@tamagui/lucide-icons";

export default function EventsPage() {
	const router = useRouter();
	const {user, loading} = useAuth();
	const {data: events = [], isLoading, error} = useEvents(!!user);
	const incrementMutation = useIncrementEvent();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const handleIncrement = (eventId: string) => {
		incrementMutation.mutate(eventId);
	};


	if (loading) {
		return (
			<YStack
				flex={1}
				style={{justifyContent: "center", alignItems: "center"}}
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
				style={{justifyContent: "center", alignItems: "center"}}
			>
				<Text>Loading events...</Text>
			</YStack>
		);
	}

	if (error) {
		return (
			<YStack
				flex={1}
				style={{justifyContent: "center", alignItems: "center"}}
			>
				<Text>Error: {error.message}</Text>
			</YStack>
		);
	}

	return (
		<>
			<YStack flex={1} gap="$4" p="$4">
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

				<Button
					position="absolute"
					bottom="$8"
					right="$6"
					size="$6"
					bg="$blue10"
					color="white"
					elevation="$1"
					shadowColor="$shadowColor"
					shadowRadius="$4"
					shadowOpacity={0.15}
					onPress={() => setIsCreateModalOpen(true)}
					icon={<Plus/>}
				>
					Add Event
				</Button>
			</YStack>
		</>
	);
}
