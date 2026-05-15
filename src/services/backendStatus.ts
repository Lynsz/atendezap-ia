import type { BackendStatus } from "@/types/database";

const BACKEND_STATUS_STORAGE_KEY = "atendezap_ia_backend_status_v1";

export const DEFAULT_BACKEND_STATUS: BackendStatus = {
  provider: "localStorage",
  mode: "demo",
  isConnected: false,
  lastCheckedAt: new Date().toISOString(),
  message: "Projeto usando localStorage. Backend Supabase ainda não conectado."
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getBackendStatus(): BackendStatus {
  if (!canUseStorage()) return DEFAULT_BACKEND_STATUS;

  const stored = window.localStorage.getItem(BACKEND_STATUS_STORAGE_KEY);
  if (!stored) return { ...DEFAULT_BACKEND_STATUS, lastCheckedAt: new Date().toISOString() };

  try {
    return JSON.parse(stored) as BackendStatus;
  } catch {
    window.localStorage.removeItem(BACKEND_STATUS_STORAGE_KEY);
    return { ...DEFAULT_BACKEND_STATUS, lastCheckedAt: new Date().toISOString() };
  }
}

export function setBackendStatus(status: BackendStatus) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(BACKEND_STATUS_STORAGE_KEY, JSON.stringify(status));
  window.dispatchEvent(new Event("atendezap-backend-status-change"));
}

export function resetBackendStatus() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(BACKEND_STATUS_STORAGE_KEY);
  window.dispatchEvent(new Event("atendezap-backend-status-change"));
}
