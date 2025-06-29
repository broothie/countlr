import { router } from "expo-router";
import React, { useEffect } from "react";
import { useAuth } from "../lib/auth-hooks";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function RequireLoggedIn({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect to auth page
  }

  return <>{children}</>;
}

export function RequireLoggedOut({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null; // Will redirect to main page
  }

  return <>{children}</>;
}
