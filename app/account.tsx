import {useNavigation} from "@react-navigation/native";
import {Stack, useRouter} from "expo-router";
import {useLayoutEffect} from "react";
import {TouchableOpacity} from "react-native";
import {Button, Card, Text, YStack} from "tamagui";
import {ArrowLeft} from "@tamagui/lucide-icons";
import {useAuth, useSignOut} from "../src/lib/auth-hooks";

export default function AccountDetailsPage() {
	const router = useRouter();
	const navigation = useNavigation();
	const {user, loading} = useAuth();
	const signOutMutation = useSignOut();

	useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<TouchableOpacity
					onPress={() => router.back()}
					style={{marginLeft: 16}}
				>
					<ArrowLeft size={24} color="#000" />
				</TouchableOpacity>
			),
		});
	}, [navigation, router]);

	const handleSignOut = () => {
		signOutMutation.mutate({}, {
			onSuccess: () => {
				router.replace("/sign-in");
			}
		});
	};

	if (loading) {
		return (
			<YStack
				flex={1}
				style={{justifyContent: "center", alignItems: "center"}}
			>
				<Text>Loading...</Text>
			</YStack>
		);
	}

	if (!user) {
		router.replace("/sign-in");
		return null;
	}

	return (
		<YStack flex={1} gap="$4" p="$4">
			<Card
				p="$6"
				backgroundColor="$background"
				borderColor="$borderColor"
				borderWidth={1}
			>
				<YStack gap="$4">
					<Text fontSize="$6" fontWeight="bold" ta="center">
						Account Details
					</Text>
					
					<YStack gap="$3">
						<YStack gap="$2">
							<Text fontSize="$4" fontWeight="500" color="$color11">
								Email
							</Text>
							<Text fontSize="$4">
								{user.email}
							</Text>
						</YStack>

						<YStack gap="$2">
							<Text fontSize="$4" fontWeight="500" color="$color11">
								User ID
							</Text>
							<Text fontSize="$3" fontFamily="$mono" color="$color10">
								{user.id}
							</Text>
						</YStack>

						<YStack gap="$2">
							<Text fontSize="$4" fontWeight="500" color="$color11">
								Account Created
							</Text>
							<Text fontSize="$4">
								{new Date(user.created_at).toLocaleDateString()}
							</Text>
						</YStack>
					</YStack>
				</YStack>
			</Card>

			<Card
				p="$4"
				backgroundColor="$background"
				borderColor="$borderColor"
				borderWidth={1}
			>
				<YStack gap="$4">
					<Text fontSize="$5" fontWeight="bold">
						Actions
					</Text>
					
					<Button
						onPress={handleSignOut}
						bg="$red10"
						color="white"
						disabled={signOutMutation.isPending}
					>
						{signOutMutation.isPending ? "Signing Out..." : "Sign Out"}
					</Button>
				</YStack>
			</Card>
		</YStack>
	);
}