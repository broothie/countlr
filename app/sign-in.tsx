import {Link, useRouter} from "expo-router";
import React, {useEffect, useState} from "react";
import {Button, Card, Input, Text, XStack, YStack} from "tamagui";
import {useSignIn} from "../src/lib/auth-hooks";

export default function SignInPage() {
	const router = useRouter();
	
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const signInMutation = useSignIn();

	// Navigate to main app on successful auth
	useEffect(() => {
		if (signInMutation.isSuccess) {
			router.replace("/");
		}
	}, [signInMutation.isSuccess]);

	const handleSubmit = () => {
		if (!email || !password) return;
		signInMutation.mutate({email, password});
	};

	return (
		<YStack
			flex={1}
			style={{justifyContent: "center", alignItems: "center"}}
			p="$4"
		>
			{/* @ts-ignore */}
			<Card p="$6" width="100%" maxWidth="$30">
				<YStack gap="$4">
					<Text fontSize="$8" fontWeight="bold" style={{textAlign: "center"}}>
						Sign In
					</Text>

					<Input
						placeholder="Email"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
						autoComplete="email"
						bg="white"
						borderColor="#d1d5db"
						borderWidth={1}
					/>

					<Input
						placeholder="Password"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						autoComplete="password"
						onSubmitEditing={handleSubmit}
						returnKeyType="go"
						bg="white"
						borderColor="#d1d5db"
						borderWidth={1}
					/>

					{signInMutation.error && (
						<Text color="$red10" style={{textAlign: "center"}}>
							{signInMutation.error.message}
						</Text>
					)}

					<Button
						onPress={handleSubmit}
						disabled={signInMutation.isPending || !email || !password}
						bg="$blue10"
						color="white"
						fontWeight="700"
					>
						{signInMutation.isPending ? "Loading..." : "Sign In"}
					</Button>

					{/* @ts-ignore */}
					<XStack gap="$3" justifyContent="center" alignItems="center">
						<Text>Don't have an account?</Text>

						<Link href="/sign-up" asChild>
							<Button
								size="$2"
								fontWeight="500"
							>
								Sign Up
							</Button>
						</Link>
					</XStack>
				</YStack>
			</Card>
		</YStack>
	);
}
