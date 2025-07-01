import { Button } from "tamagui";

interface CreateEventHeaderButtonProps {
  onPress: () => void;
}

export function CreateEventHeaderButton({ onPress }: CreateEventHeaderButtonProps) {
  return (
    <Button
      size="$2"
      circular
      onPress={onPress}
      bg="$green10"
      color="white"
      mr="$3"
    >
      +
    </Button>
  );
}