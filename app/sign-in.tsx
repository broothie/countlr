import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Card, Input, Text, XStack, YStack } from "tamagui";
import { useSignIn } from "../src/lib/auth-hooks";

export default function SignInPage() {
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
    signInMutation.mutate({ email, password });
  };

  return (
    <YStack
      flex={1}
      style={{ justifyContent: "center", alignItems: "center" }}
      p="$4"
    >
      <Card p="$6" style={{ width: "100%", maxWidth: 400 }}>
        <YStack space="$4">
          <Text fontSize="$8" fontWeight="bold" style={{ textAlign: "center" }}>
            Sign In
          </Text>

          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          {signInMutation.error && (
            <Text color="$red10" style={{ textAlign: "center" }}>
              {signInMutation.error.message}
            </Text>
          )}

          <Button
            onPress={handleSubmit}
            disabled={signInMutation.isPending || !email || !password}
            bg="$blue10"
            color="white"
          >
            {signInMutation.isPending ? "Loading..." : "Sign In"}
          </Button>

          <XStack style={{ justifyContent: "center" }} space="$2">
            <Text>Don't have an account?</Text>
            <Button
              variant="outlined"
              size="$2"
              onPress={() => router.push("/sign-up")}
            >
              Sign Up
            </Button>
          </XStack>
        </YStack>
      </Card>
    </YStack>
  );
}
