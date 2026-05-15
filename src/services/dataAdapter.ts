import { getBackendStatus, setBackendStatus } from "@/services/backendStatus";
import type { DatabaseProvider } from "@/types/database";

export function getDataProvider(): DatabaseProvider {
  return getBackendStatus().provider;
}

export function setDataProvider(provider: DatabaseProvider) {
  const isSupabase = provider === "supabase";

  setBackendStatus({
    provider,
    mode: isSupabase ? "production" : "demo",
    isConnected: false,
    lastCheckedAt: new Date().toISOString(),
    message: isSupabase
      ? "Supabase selecionado para arquitetura futura. Nenhuma conexão real foi feita ainda."
      : "Projeto usando localStorage. Backend Supabase ainda não conectado."
  });
}

export function isUsingLocalStorage() {
  return getDataProvider() === "localStorage";
}

export function isUsingSupabase() {
  return getDataProvider() === "supabase";
}

export function explainCurrentDataMode() {
  const status = getBackendStatus();

  if (status.provider === "supabase") {
    return "Modo Supabase está apenas preparado. O app ainda não faz chamadas reais de rede e continua usando dados locais como fallback.";
  }

  return "O MVP usa localStorage para conversas, leads, automações, assinatura e configurações. Supabase está planejado para produção.";
}
