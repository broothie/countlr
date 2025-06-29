import { Tabs } from "expo-router";
import { Text } from "tamagui";
import { useAuth } from "../../src/lib/auth-hooks";

export default function TabsLayout() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabBarIcon({ name, color }: { name: string; color: string }) {
  return (
    <Text style={{ color }} fontSize={20}>
      {name === "list" ? "📋" : "❓"}
    </Text>
  );
}
