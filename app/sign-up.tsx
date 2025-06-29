import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Card, Input, Text, XStack, YStack } from "tamagui";
import { useSignUp } from "../src/lib/auth-hooks";

export default function SignUpPage() {
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
    signUpMutation.mutate({ email, password });
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
            Create Account
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

          {signUpMutation.error && (
            <Text color="$red10" style={{ textAlign: "center" }}>
              {signUpMutation.error.message}
            </Text>
          )}

          <Button
            onPress={handleSubmit}
            disabled={signUpMutation.isPending || !email || !password}
            bg="$blue10"
            color="white"
          >
            {signUpMutation.isPending ? "Loading..." : "Sign Up"}
          </Button>

          <XStack style={{ justifyContent: "center" }} space="$2">
            <Text>Already have an account?</Text>
            <Button
              variant="outlined"
              size="$2"
              onPress={() => router.push("/sign-in")}
            >
              Sign In
            </Button>
          </XStack>
        </YStack>
      </Card>
    </YStack>
  );
}
