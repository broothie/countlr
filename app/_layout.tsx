import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../tamagui.config";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig}>
        <Stack screenOptions={{ title: "Countlr" }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
        </Stack>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
