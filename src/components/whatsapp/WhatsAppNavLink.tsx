"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WhatsAppNavLink() {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(async ({ data }) => {
      const token = data.session?.access_token;
      if (!token) return;
      const response = await fetch("/api/whatsapp/status", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }).catch(() => null);
      if (!response?.ok) return;
      const body = (await response.json()) as { environment?: { enabled?: boolean } };
      if (active) setEnabled(Boolean(body.environment?.enabled));
    });
    return () => {
      active = false;
    };
  }, []);

  if (enabled === null) return null;
  if (!enabled) return <span className="px-4 py-2 text-xs font-bold text-slate-500">Integração WhatsApp ainda não configurada.</span>;
  return (
    <>
      <Link href="/dashboard/whatsapp" className="inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-black text-slate-300 transition hover:bg-white/10">
        WhatsApp
      </Link>
      <Link href="/dashboard/whatsapp/configuracao" className="inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-black text-slate-300 transition hover:bg-white/10">
        Configuração WhatsApp
      </Link>
    </>
  );
}
