import { ListItem, Separator, Text, YStack } from "tamagui";

const events = [
  { id: 1, name: "Birthday Party" },
  { id: 2, name: "Conference" },
  { id: 3, name: "Dentist Appointment" },
];

export default function EventsPage() {
  return (
    <YStack flex={1} space="$2">
      <Text fontSize="$7" fontWeight="bold">
        Events
      </Text>
      {events.map((event, idx) => (
        <YStack key={event.id}>
          <ListItem title={event.name} />
          {idx < events.length - 1 && <Separator />}
        </YStack>
      ))}
    </YStack>
  );
}
