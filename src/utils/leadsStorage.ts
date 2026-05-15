import { leadsMock } from "@/data/leadsMock";
import type { Lead } from "@/types/atendezap";

const LEADS_STORAGE_KEY = "atendezap_ia_leads_v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function listLeads(): Lead[] {
  if (!canUseStorage()) return leadsMock;

  const stored = window.localStorage.getItem(LEADS_STORAGE_KEY);
  if (!stored) return leadsMock;

  try {
    return JSON.parse(stored) as Lead[];
  } catch {
    return leadsMock;
  }
}

export function saveLeads(leads: Lead[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
}

export function updateLead(updatedLead: Lead) {
  const leads = listLeads().map((lead) => (lead.id === updatedLead.id ? updatedLead : lead));
  saveLeads(leads);
  return leads;
}

export function createLead(lead: Lead) {
  const leads = [lead, ...listLeads()];
  saveLeads(leads);
  return leads;
}

export function removeLead(leadId: string) {
  const leads = listLeads().filter((lead) => lead.id !== leadId);
  saveLeads(leads);
  return leads;
}

export function resetLeads() {
  saveLeads(leadsMock);
  return leadsMock;
}
