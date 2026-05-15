import { faqMock, knowledgeItemsMock, objectionMock, policyMock, productKnowledgeMock } from "@/data/knowledgeMock";
import type { FAQItem, KnowledgeItem, ObjectionItem, PolicyItem, ProductKnowledgeItem } from "@/types/knowledge";

const KNOWLEDGE_ITEMS_KEY = "atendezap_ia_knowledge_items_v1";
const FAQ_ITEMS_KEY = "atendezap_ia_faq_items_v1";
const PRODUCT_KNOWLEDGE_KEY = "atendezap_ia_product_knowledge_v1";
const OBJECTIONS_KEY = "atendezap_ia_objections_v1";
const POLICIES_KEY = "atendezap_ia_policies_v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readStorage<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  const stored = window.localStorage.getItem(key);
  if (!stored) return fallback;

  try {
    return JSON.parse(stored) as T;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("atendezap-knowledge-change"));
}

function touch<T extends { updatedAt: string }>(item: T): T {
  return { ...item, updatedAt: new Date().toISOString() };
}

export function getKnowledgeItems(): KnowledgeItem[] {
  return readStorage(KNOWLEDGE_ITEMS_KEY, knowledgeItemsMock);
}

export function saveKnowledgeItems(items: KnowledgeItem[]) {
  writeStorage(KNOWLEDGE_ITEMS_KEY, items);
}

export function createKnowledgeItem(item: Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const nextItem: KnowledgeItem = { ...item, id: createId("knowledge"), createdAt: now, updatedAt: now };
  const items = [nextItem, ...getKnowledgeItems()];
  saveKnowledgeItems(items);
  return items;
}

export function updateKnowledgeItem(itemId: string, updates: Partial<KnowledgeItem>) {
  const items = getKnowledgeItems().map((item) => (item.id === itemId ? touch({ ...item, ...updates }) : item));
  saveKnowledgeItems(items);
  return items;
}

export function deleteKnowledgeItem(itemId: string) {
  const items = getKnowledgeItems().filter((item) => item.id !== itemId);
  saveKnowledgeItems(items);
  return items;
}

export function archiveKnowledgeItem(itemId: string) {
  return updateKnowledgeItem(itemId, { status: "archived" });
}

export function getFAQItems(): FAQItem[] {
  return readStorage(FAQ_ITEMS_KEY, faqMock);
}

export function saveFAQItems(items: FAQItem[]) {
  writeStorage(FAQ_ITEMS_KEY, items);
}

export function createFAQItem(item: Omit<FAQItem, "id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const nextItem: FAQItem = { ...item, id: createId("faq"), createdAt: now, updatedAt: now };
  const items = [nextItem, ...getFAQItems()];
  saveFAQItems(items);
  return items;
}

export function updateFAQItem(itemId: string, updates: Partial<FAQItem>) {
  const items = getFAQItems().map((item) => (item.id === itemId ? touch({ ...item, ...updates }) : item));
  saveFAQItems(items);
  return items;
}

export function deleteFAQItem(itemId: string) {
  const items = getFAQItems().filter((item) => item.id !== itemId);
  saveFAQItems(items);
  return items;
}

export function getProductKnowledge(): ProductKnowledgeItem[] {
  return readStorage(PRODUCT_KNOWLEDGE_KEY, productKnowledgeMock);
}

export function saveProductKnowledge(items: ProductKnowledgeItem[]) {
  writeStorage(PRODUCT_KNOWLEDGE_KEY, items);
}

export function createProductKnowledgeItem(item: Omit<ProductKnowledgeItem, "id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const nextItem: ProductKnowledgeItem = { ...item, id: createId("product"), createdAt: now, updatedAt: now };
  const items = [nextItem, ...getProductKnowledge()];
  saveProductKnowledge(items);
  return items;
}

export function updateProductKnowledgeItem(itemId: string, updates: Partial<ProductKnowledgeItem>) {
  const items = getProductKnowledge().map((item) => (item.id === itemId ? touch({ ...item, ...updates }) : item));
  saveProductKnowledge(items);
  return items;
}

export function deleteProductKnowledgeItem(itemId: string) {
  const items = getProductKnowledge().filter((item) => item.id !== itemId);
  saveProductKnowledge(items);
  return items;
}

export function getObjections(): ObjectionItem[] {
  return readStorage(OBJECTIONS_KEY, objectionMock);
}

export function saveObjections(items: ObjectionItem[]) {
  writeStorage(OBJECTIONS_KEY, items);
}

export function createObjection(item: Omit<ObjectionItem, "id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const nextItem: ObjectionItem = { ...item, id: createId("objection"), createdAt: now, updatedAt: now };
  const items = [nextItem, ...getObjections()];
  saveObjections(items);
  return items;
}

export function updateObjection(itemId: string, updates: Partial<ObjectionItem>) {
  const items = getObjections().map((item) => (item.id === itemId ? touch({ ...item, ...updates }) : item));
  saveObjections(items);
  return items;
}

export function deleteObjection(itemId: string) {
  const items = getObjections().filter((item) => item.id !== itemId);
  saveObjections(items);
  return items;
}

export function getPolicies(): PolicyItem[] {
  return readStorage(POLICIES_KEY, policyMock);
}

export function savePolicies(items: PolicyItem[]) {
  writeStorage(POLICIES_KEY, items);
}

export function createPolicy(item: Omit<PolicyItem, "id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const nextItem: PolicyItem = { ...item, id: createId("policy"), createdAt: now, updatedAt: now };
  const items = [nextItem, ...getPolicies()];
  savePolicies(items);
  return items;
}

export function updatePolicy(itemId: string, updates: Partial<PolicyItem>) {
  const items = getPolicies().map((item) => (item.id === itemId ? touch({ ...item, ...updates }) : item));
  savePolicies(items);
  return items;
}

export function deletePolicy(itemId: string) {
  const items = getPolicies().filter((item) => item.id !== itemId);
  savePolicies(items);
  return items;
}

export function resetKnowledgeBase() {
  saveKnowledgeItems(knowledgeItemsMock);
  saveFAQItems(faqMock);
  saveProductKnowledge(productKnowledgeMock);
  saveObjections(objectionMock);
  savePolicies(policyMock);
}

export function getKnowledgeBaseStats() {
  const knowledgeItems = getKnowledgeItems();
  const faqs = getFAQItems();
  const products = getProductKnowledge();
  const objections = getObjections();
  const policies = getPolicies();

  return {
    total: knowledgeItems.length + faqs.length + products.length + objections.length + policies.length,
    activeFaqs: faqs.filter((item) => item.status === "active").length,
    products: products.length,
    objections: objections.length,
    policies: policies.length
  };
}
