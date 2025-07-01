import {Drawer} from "expo-router/drawer";
import {DrawerContentScrollView} from "@react-navigation/drawer";
import {useRouter} from "expo-router";
import {Button, YStack} from "tamagui";
import {useSignOut} from "../../src/lib/auth-hooks";

function CustomDrawerContent(props: any) {
	const router = useRouter();
	const signOutMutation = useSignOut();

	const handleSignOut = () => {
		signOutMutation.mutate({}, {
			onSuccess: () => {
				router.replace("/sign-in");
			}
		});
	};

	return (
		<DrawerContentScrollView
			{...props}
			contentContainerStyle={{flex: 1}}
		>
			<YStack flex={1} p="$4">
				<YStack flex={1}/>
				<Button
					onPress={handleSignOut}
					bg="$red10"
					color="white"
					disabled={signOutMutation.isPending}
					mb="$4"
				>
					{signOutMutation.isPending ? "Signing Out..." : "Sign Out"}
				</Button>
			</YStack>
		</DrawerContentScrollView>
	);
}

export default function DrawerLayout() {
	return (
		<Drawer
			drawerContent={CustomDrawerContent}
			screenOptions={{
				drawerStyle: {
					backgroundColor: "#f0f0f0",
					width: 280,
				},
				headerStyle: {
					backgroundColor: "#fff",
				},
				headerTintColor: "#000",
				headerTitleStyle: {
					fontWeight: "bold",
				},
			}}
		>
			<Drawer.Screen
				name="index"
				options={{
					drawerLabel: "Events",
					title: "Countlr",
				}}
			/>
			<Drawer.Screen
				name="event/[id]"
				options={{
					drawerItemStyle: {display: "none"},
					title: "Event Details",
				}}
			/>
		</Drawer>
	);
}