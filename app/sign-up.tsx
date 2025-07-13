import {Link, useRouter} from "expo-router";
import React, {useEffect, useState} from "react";
import {Button, Card, Input, Text, XStack, YStack} from "tamagui";
import {useSignUp} from "../src/lib/auth-hooks";

export default function SignUpPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const signUpMutation = useSignUp();

	// Navigate to main app on successful auth
	useEffect(() => {
		if (signUpMutation.isSuccess) {
			router.replace("/");
		}
	}, [signUpMutation.isSuccess]);

	const handleSubmit = () => {
		if (!email || !password) return;
		signUpMutation.mutate({email, password});
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
						Create Account
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

					{signUpMutation.error && (
						<Text color="$red10" style={{textAlign: "center"}}>
							{signUpMutation.error.message}
						</Text>
					)}

					<Button
						onPress={handleSubmit}
						disabled={signUpMutation.isPending || !email || !password}
						bg="$blue10"
						color="white"
						fontWeight="700"
					>
						{signUpMutation.isPending ? "Loading..." : "Sign Up"}
					</Button>

					{/* @ts-ignore */}
					<XStack gap="$3" justifyContent="center" alignItems="center">
						<Text>Already have an account?</Text>

						<Link href="/sign-in" asChild>
							<Button
								size="$2"
								fontWeight="500"
							>
								Sign In
							</Button>
						</Link>
					</XStack>
				</YStack>
			</Card>
		</YStack>
	);
}
