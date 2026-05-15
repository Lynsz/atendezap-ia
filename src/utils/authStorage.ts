import type { AccessSession, AccessUser, UserPlan } from "@/types/auth";
import { createDefaultSubscription } from "@/utils/billingStorage";

const AUTH_STORAGE_KEY = "atendezap_ia_access_session_v1";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createExpirationDate() {
  return new Date(Date.now() + SESSION_DURATION_MS).toISOString();
}

export function getCurrentSession(): AccessSession | null {
  if (!canUseStorage()) return null;

  const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored) as AccessSession;
    const expired = new Date(session.expiresAt).getTime() <= Date.now();

    if (!session.isAuthenticated || expired) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
}

export function saveSession(session: AccessSession) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("atendezap-auth-change"));
}

export function clearSession() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event("atendezap-auth-change"));
}

export function isAuthenticated() {
  return Boolean(getCurrentSession());
}

export function createDemoAccess(plan: UserPlan = "starter") {
  const now = new Date().toISOString();
  const user: AccessUser = {
    id: `demo-${Date.now()}`,
    name: "Cliente AtendeZap",
    email: "cliente@atendezapia.com",
    plan,
    createdAt: now,
    lastLoginAt: now
  };
  const session: AccessSession = {
    user,
    isAuthenticated: true,
    expiresAt: createExpirationDate()
  };

  saveSession(session);
  createDefaultSubscription(plan);
  return session;
}

export function updateLastLogin() {
  const session = getCurrentSession();
  if (!session) return null;

  const updatedSession: AccessSession = {
    ...session,
    user: {
      ...session.user,
      lastLoginAt: new Date().toISOString()
    },
    expiresAt: createExpirationDate()
  };

  saveSession(updatedSession);
  return updatedSession;
}
