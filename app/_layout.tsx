import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Stack} from "expo-router";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {TamaguiProvider} from "tamagui";
import {useAuth} from "../src/lib/auth-hooks";
import tamaguiConfig from "../tamagui.config";

const queryClient = new QueryClient();

function RootNavigator() {
	const {user} = useAuth();

	return (
		<Stack screenOptions={{headerShown: false}}>
			<Stack.Protected guard={!!user}>
				<Stack.Screen name="(drawer)"/>
			</Stack.Protected>

			<Stack.Protected guard={!user}>
				<Stack.Screen name="sign-in"/>
				<Stack.Screen name="sign-up"/>
			</Stack.Protected>
		</Stack>
	);
}

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{flex: 1}}>
			<QueryClientProvider client={queryClient}>
				<TamaguiProvider config={tamaguiConfig}>
					<RootNavigator/>
				</TamaguiProvider>
			</QueryClientProvider>
		</GestureHandlerRootView>
	);
}
