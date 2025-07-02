import {useRouter} from "expo-router";
import {Button, Card, Text, View, XStack} from "tamagui";
import {Plus} from "@tamagui/lucide-icons";
import {EventWithCount} from "../lib/supabase";

interface EventCardProps {
	event: EventWithCount;
	onIncrement: (eventId: string) => void;
	isIncrementPending: boolean;
}

export function EventCard({event, onIncrement, isIncrementPending}: EventCardProps) {
	const router = useRouter();

	const handleEventPress = (eventId: string) => {
		router.push(`/event/${eventId}`);
	};

	return (
		<Card
			key={event.id}
			p="$4"
			bg="white"
			onPress={() => handleEventPress(event.id)}
		>
			<XStack style={{justifyContent: "space-between", alignItems: "center"}}>
				<Text fontSize="$6" fontWeight="bold">
					{event.name}
				</Text>

				<XStack>
					<View
						style={{justifyContent: "center", alignItems: "center"}}
						px="$4"
					>
						<Text fontSize="$8" fontWeight="bold">
							{event.count}
						</Text>
					</View>

					<Button
						onPress={(e) => {
							e.stopPropagation();
							onIncrement(event.id);
						}}
						bg="$blue10"
						disabled={isIncrementPending}
						size="$5"
					>
						<Plus color="white"/>
					</Button>
				</XStack>
			</XStack>
		</Card>
	);
}