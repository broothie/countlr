import {Stack, useRouter} from "expo-router";
import {useState} from "react";
import {TouchableOpacity} from "react-native";
import {Button, Text, YStack} from "tamagui";
import {Plus, User} from "@tamagui/lucide-icons";
import {useAuth} from "../src/lib/auth-hooks";
import {useEvents, useIncrementEvent} from "../src/lib/event-hooks";
import {CreateEventModal} from "../src/components/CreateEventModal";
import {EventCard} from "../src/components/EventCard";

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
			<Stack.Screen
				options={{
					headerRight: () => (
						<TouchableOpacity
							onPress={() => router.push("/account")}
							style={{marginRight: 16}}
						>
							<User size={24} color="#000" />
						</TouchableOpacity>
					),
				}}
			/>

			<YStack flex={1} gap="$4" p="$4">
				{events.map((event) => (
					<EventCard
						key={event.id}
						event={event}
						onIncrement={handleIncrement}
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
