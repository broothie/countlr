import React from "react";
import { Input, Label, YStack } from "tamagui";

interface EventInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  label?: string;
}

export default function EventInput({
  value,
  onChangeText,
  placeholder = "Enter event name...",
  label = "Event Name",
}: EventInputProps) {
  return (
    <YStack space="$2">
      <Label htmlFor="event-input">{label}</Label>
      <Input
        id="event-input"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        size="$4"
      />
    </YStack>
  );
}
