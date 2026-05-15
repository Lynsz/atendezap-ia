"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/authStorage";
import { hasCompletedOnboarding } from "@/utils/onboardingStorage";

export function OnboardingGuard({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated() && !hasCompletedOnboarding()) {
      router.replace("/onboarding");
    }
  }, [router]);

  return <>{children}</>;
}
