"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type NavigationState = { enabled: boolean; connected: boolean } | null;

export default function WhatsAppNavLink() {
  const [state, setState] = useState<NavigationState>(null);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(async ({ data }) => {
      const token = data.session?.access_token;
      if (!token) return;
      const response = await fetch("/api/whatsapp/connection", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }).catch(() => null);
      if (!response?.ok) return;
      const body = await response.json() as { embeddedSignup?: { enabled?: boolean }; connection?: { status?: string } | null };
      if (active) setState({ enabled: Boolean(body.embeddedSignup?.enabled || body.connection), connected: body.connection?.status === "connected" });
    });
    return () => { active = false; };
  }, []);

  if (!state) return null;
  if (!state.enabled) return <span className="px-4 py-2 text-xs font-bold text-slate-500">Integração WhatsApp ainda não configurada.</span>;
  return (
    <>
      {!state.connected ? <Link href="/dashboard/whatsapp/onboarding" className="inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-black text-emerald-300 transition hover:bg-white/10">Conectar WhatsApp</Link> : null}
      <Link href="/dashboard/whatsapp/configuracao" className="inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-black text-slate-300 transition hover:bg-white/10">Configuração</Link>
      <Link href="/dashboard/whatsapp" className="inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-black text-slate-300 transition hover:bg-white/10">Conversas</Link>
      <Link href="/dashboard/whatsapp/templates" className="inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-black text-slate-300 transition hover:bg-white/10">Templates</Link>
    </>
  );
}
