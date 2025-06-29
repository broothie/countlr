import React, { useState } from "react";
import { Button, Card, Input, Text, XStack, YStack } from "tamagui";
import { useSignIn, useSignUp } from "../lib/auth-hooks";

export function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();

  const mutation = isSignUp ? signUpMutation : signInMutation;

  const handleSubmit = () => {
    if (!email || !password) return;

    mutation.mutate({ email, password });
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
            {isSignUp ? "Create Account" : "Sign In"}
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

          {mutation.error && (
            <Text color="$red10" style={{ textAlign: "center" }}>
              {mutation.error.message}
            </Text>
          )}

          <Button
            onPress={handleSubmit}
            disabled={mutation.isPending || !email || !password}
            bg="$blue10"
            color="white"
          >
            {mutation.isPending
              ? "Loading..."
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </Button>

          <XStack style={{ justifyContent: "center" }} space="$2">
            <Text>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </Text>
            <Button
              variant="outlined"
              size="$2"
              onPress={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Button>
          </XStack>
        </YStack>
      </Card>
    </YStack>
  );
}
