"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { trackSafeAppEvent } from "@/lib/analytics/track-event";

type PublicConfig = { enabled: boolean; appId: string | null; configId: string | null; redirectUri: string | null; graphVersion: string | null; state: string | null };
type SessionInfo = { wabaId?: string; phoneNumberId?: string };

declare global {
  interface Window {
    FB?: {
      init(options: { appId: string; cookie: boolean; xfbml: boolean; version: string }): void;
      login(callback: (response: { authResponse?: { code?: string } }) => void, options: Record<string, unknown>): void;
    };
  }
}

async function authenticatedJson(path: string, init?: RequestInit) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...init?.headers },
    cache: "no-store"
  });
  const body = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Não foi possível conectar o WhatsApp agora.");
  return body;
}

export default function EmbeddedSignupButton({ mode = "connect", onComplete }: { mode?: "connect" | "reauthorize"; onComplete?: () => void }) {
  const [sdkReady, setSdkReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const sessionInfo = useRef<SessionInfo>({});

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (!/^https:\/\/([a-z0-9-]+\.)*(facebook\.com|facebook\.net)$/i.test(event.origin)) return;
      let payload: unknown = event.data;
      if (typeof payload === "string") {
        try { payload = JSON.parse(payload); } catch { return; }
      }
      if (!payload || typeof payload !== "object") return;
      const data = payload as { type?: unknown; data?: { waba_id?: unknown; phone_number_id?: unknown } };
      if (data.type !== "WA_EMBEDDED_SIGNUP") return;
      sessionInfo.current = {
        wabaId: typeof data.data?.waba_id === "string" ? data.data.waba_id : undefined,
        phoneNumberId: typeof data.data?.phone_number_id === "string" ? data.data.phone_number_id : undefined
      };
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  async function connect() {
    setBusy(true);
    setError("");
    sessionInfo.current = {};
    try {
      const configPath = mode === "reauthorize" ? "/api/whatsapp/connection/reauthorize" : "/api/whatsapp/embedded-signup/config";
      const config = await authenticatedJson(configPath, mode === "reauthorize" ? { method: "POST", body: "{}" } : undefined) as PublicConfig;
      if (!config.enabled || !config.appId || !config.configId || !config.state) {
        throw new Error("O Embedded Signup ainda não está configurado neste ambiente.");
      }
      if (!sdkReady || !window.FB) throw new Error("A conexão com a Meta ainda está carregando. Tente novamente em instantes.");
      trackSafeAppEvent({ event_name: "whatsapp_embedded_signup_started", page: "/dashboard/whatsapp/onboarding", source: "dashboard", metadata: { status: "started", connection_source: "embedded_signup" } });
      window.FB.init({ appId: config.appId, cookie: true, xfbml: false, version: config.graphVersion || "v23.0" });
      await new Promise<void>((resolve, reject) => {
        window.FB!.login(async (response) => {
          const code = response.authResponse?.code;
          if (!code) {
            reject(new Error("A autorização foi cancelada ou não retornou um código válido."));
            return;
          }
          try {
            await authenticatedJson("/api/whatsapp/embedded-signup/complete", {
              method: "POST",
              body: JSON.stringify({ code, state: config.state, ...sessionInfo.current })
            });
            resolve();
          } catch (requestError) {
            reject(requestError);
          }
        }, {
          config_id: config.configId,
          response_type: "code",
          override_default_response_type: true,
          extras: { setup: {}, featureType: "", sessionInfoVersion: "3" }
        });
      });
      onComplete?.();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível conectar o WhatsApp agora.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Script src="https://connect.facebook.net/pt_BR/sdk.js" strategy="afterInteractive" onReady={() => setSdkReady(true)} />
      <button type="button" onClick={() => void connect()} disabled={busy || !sdkReady} className="rounded-lg bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
        {busy ? "Conectando com segurança..." : mode === "reauthorize" ? "Reautorizar WhatsApp" : "Conectar WhatsApp"}
      </button>
      {error ? <p role="alert" className="mt-3 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
