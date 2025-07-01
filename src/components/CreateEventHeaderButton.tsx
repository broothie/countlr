import {Pressable} from "react-native";
import {Text} from "tamagui";

interface CreateEventHeaderButtonProps {
	onPress: () => void;
}

export function CreateEventHeaderButton({onPress}: CreateEventHeaderButtonProps) {
	return (
		<Pressable onPress={onPress}>
			<Text
				color="$blue10"
				fontSize="$5"
			>
				Add Event
			</Text>
		</Pressable>
	);
}