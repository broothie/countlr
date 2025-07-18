import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Button, Card, ScrollView, Text, XStack, YStack } from "tamagui";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { EventCard } from "../../src/components/EventCard";
import { useAuth } from "../../src/lib/auth-hooks";
import {
  useEvent,
  useEventOccurrences,
  useIncrementEvent,
} from "../../src/lib/event-hooks";

type Timeframe = "hour" | "day" | "week" | "month" | "year";

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, loading } = useAuth();
  const { data: event, isLoading, error } = useEvent(id, !!user);
  const [timeframe, setTimeframe] = useState<Timeframe>("day");
  const { data: occurrences, isLoading: occurrencesLoading } =
    useEventOccurrences(id, timeframe, !!user);
  const incrementMutation = useIncrementEvent();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (event?.name) {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginLeft: 16 }}
          >
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
        ),
      });
    }
  }, [event?.name, navigation, router]);

  const handleIncrement = () => {
    if (id) {
      incrementMutation.mutate(id);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    switch (timeframe) {
      case "hour":
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "day":
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "week":
        return date.toLocaleDateString([], {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
      case "month":
        return date.toLocaleDateString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      case "year":
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
      default:
        return date.toLocaleString();
    }
  };

  const timeframeOptions: { value: Timeframe; label: string }[] = [
    { value: "hour", label: "Hour" },
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

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

  if (isLoading) {
    return (
      <YStack
        flex={1}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Text>Loading event...</Text>
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

  if (!event) {
    return (
      <YStack
        flex={1}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Text>Event not found</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} gap="$4" p="$4">
      <EventCard event={event} onIncrement={handleIncrement} />

      <Card
        p="$4"
        backgroundColor="$background"
        borderColor="$borderColor"
        borderWidth={1}
      >
        <YStack gap="$4">
          <Text fontSize="$6" fontWeight="bold">
            Timeline
          </Text>

          <XStack space="$2" flexWrap="wrap">
            {timeframeOptions.map((option) => (
              <Button
                key={option.value}
                size="$3"
                variant={timeframe === option.value ? "outlined" : "outlined"}
                onPress={() => setTimeframe(option.value)}
                bg={timeframe === option.value ? "$blue10" : "transparent"}
                color={timeframe === option.value ? "white" : "$blue10"}
                borderColor="$blue10"
              >
                {option.label}
              </Button>
            ))}
          </XStack>

          <ScrollView height={300} showsVerticalScrollIndicator={false}>
            <YStack gap="$2">
              {occurrencesLoading ? (
                <Text>Loading timeline...</Text>
              ) : occurrences && occurrences.length > 0 ? (
                occurrences.map((occurrence) => (
                  <Card
                    key={occurrence.id}
                    p="$3"
                    backgroundColor="gray"
                    borderColor="$borderColor"
                    borderWidth={1}
                  >
                    <XStack gap="$2">
                      <Text fontSize="$4" fontWeight="500" flex={1}>
                        {formatTime(occurrence.created_at)}
                      </Text>
                      <Text fontSize="$3" color="gray">
                        #{occurrence.id.slice(-6)}
                      </Text>
                    </XStack>
                  </Card>
                ))
              ) : (
                <Text color="gray" style={{ textAlign: "center" }} py="$4">
                  No occurrences in the last {timeframe}
                </Text>
              )}
            </YStack>
          </ScrollView>
        </YStack>
      </Card>
    </YStack>
  );
}
