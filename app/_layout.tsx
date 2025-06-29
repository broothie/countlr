import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";
import { useAuth } from "../src/lib/auth-hooks";
import tamaguiConfig from "../tamagui.config";

const queryClient = new QueryClient();

function RootNavigator() {
  const { user, loading } = useAuth();

  return (
    <Stack screenOptions={{ title: "Countlr" }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="index" />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig}>
        <RootNavigator />
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
