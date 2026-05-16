"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Copy,
  Edit3,
  FileText,
  Lightbulb,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { cn } from "@/lib/utils";
import type {
  FAQItem,
  KnowledgeCategory,
  KnowledgeItem,
  KnowledgeItemStatus,
  KnowledgePriority,
  ObjectionItem,
  PolicyItem,
  ProductKnowledgeItem
} from "@/types/knowledge";
import { analyzeKnowledgeCoverage, generateKnowledgePrompt, suggestMissingKnowledge } from "@/utils/knowledgeAI";
import {
  createFAQItem,
  createKnowledgeItem,
  createObjection,
  createPolicy,
  createProductKnowledgeItem,
  deleteFAQItem,
  deleteKnowledgeItem,
  deleteObjection,
  deletePolicy,
  deleteProductKnowledgeItem,
  getFAQItems,
  getKnowledgeBaseStats,
  getKnowledgeItems,
  getObjections,
  getPolicies,
  getProductKnowledge,
  resetKnowledgeBase,
  updateFAQItem,
  updateKnowledgeItem,
  updateObjection,
  updatePolicy,
  updateProductKnowledgeItem
} from "@/utils/knowledgeStorage";

type KnowledgeTab = "overview" | "faq" | "products" | "objections" | "policies" | "prompt";

const tabs: Array<{ id: KnowledgeTab; label: string }> = [
  { id: "overview", label: "Visao geral" },
  { id: "faq", label: "FAQ" },
  { id: "products", label: "Produtos/Servicos" },
  { id: "objections", label: "Objecoes" },
  { id: "policies", label: "Politicas" },
  { id: "prompt", label: "Prompt da IA" }
];

const categories: Array<{ value: "all" | KnowledgeCategory; label: string }> = [
  { value: "all", label: "Todas" },
  { value: "faq", label: "FAQ" },
  { value: "product", label: "Produto" },
  { value: "service", label: "Servico" },
  { value: "objection", label: "Objecao" },
  { value: "policy", label: "Politica" },
  { value: "payment", label: "Pagamento" },
  { value: "delivery", label: "Entrega" },
  { value: "schedule", label: "Horario" },
  { value: "support", label: "Suporte" },
  { value: "custom", label: "Personalizado" }
];

const statuses: Array<{ value: "all" | KnowledgeItemStatus; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativo" },
  { value: "draft", label: "Rascunho" },
  { value: "archived", label: "Arquivado" }
];

const emptyKnowledge: Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  content: "",
  category: "custom",
  status: "active",
  tags: [],
  priority: "medium"
};

const emptyFaq: Omit<FAQItem, "id" | "createdAt" | "updatedAt"> = {
  question: "",
  answer: "",
  tags: [],
  status: "active"
};

const emptyProduct: Omit<ProductKnowledgeItem, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  description: "",
  price: "",
  benefits: [],
  commonQuestions: [],
  objections: [],
  status: "active"
};

const emptyObjection: Omit<ObjectionItem, "id" | "createdAt" | "updatedAt"> = {
  objection: "",
  suggestedAnswer: "",
  category: "objection",
  status: "active"
};

const emptyPolicy: Omit<PolicyItem, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  description: "",
  category: "policy",
  status: "active"
};

function splitList(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinList(value: string[]) {
  return value.join("\n");
}

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function statusClass(status: KnowledgeItemStatus) {
  if (status === "active") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (status === "draft") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  return "border-slate-400/30 bg-slate-500/10 text-slate-300";
}

function priorityClass(priority: KnowledgePriority) {
  if (priority === "high") return "border-red-400/30 bg-red-500/10 text-red-200";
  if (priority === "medium") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  return "border-slate-400/30 bg-slate-500/10 text-slate-300";
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-300">
      {label}
      {children}
    </label>
  );
}

function MetricCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: LucideIcon }) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#101821] p-4 shadow-xl shadow-black/20">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-300">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-bold text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </article>
  );
}

function KnowledgeBaseContent() {
  const [activeTab, setActiveTab] = useState<KnowledgeTab>("overview");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | KnowledgeCategory>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | KnowledgeItemStatus>("all");
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(() => getKnowledgeItems());
  const [faqs, setFaqs] = useState<FAQItem[]>(() => getFAQItems());
  const [products, setProducts] = useState<ProductKnowledgeItem[]>(() => getProductKnowledge());
  const [objections, setObjections] = useState<ObjectionItem[]>(() => getObjections());
  const [policies, setPolicies] = useState<PolicyItem[]>(() => getPolicies());
  const [knowledgeDraft, setKnowledgeDraft] = useState({ ...emptyKnowledge, tagsText: "" });
  const [faqDraft, setFaqDraft] = useState({ ...emptyFaq, tagsText: "" });
  const [productDraft, setProductDraft] = useState({
    ...emptyProduct,
    benefitsText: "",
    commonQuestionsText: "",
    objectionsText: ""
  });
  const [objectionDraft, setObjectionDraft] = useState(emptyObjection);
  const [policyDraft, setPolicyDraft] = useState(emptyPolicy);
  const [editing, setEditing] = useState<{ type: KnowledgeTab | "knowledge"; id: string } | null>(null);
  const [feedback, setFeedback] = useState("");

  const stats = getKnowledgeBaseStats();
  const prompt = generateKnowledgePrompt();
  const insights = analyzeKnowledgeCoverage();
  const suggestions = suggestMissingKnowledge();

  const filteredKnowledge = useMemo(() => {
    const search = normalizeText(query);

    return knowledgeItems.filter((item) => {
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const text = normalizeText(`${item.title} ${item.content} ${item.tags.join(" ")}`);
      return matchesCategory && matchesStatus && (!search || text.includes(search));
    });
  }, [knowledgeItems, categoryFilter, query, statusFilter]);

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2500);
  }

  function refreshAll() {
    setKnowledgeItems(getKnowledgeItems());
    setFaqs(getFAQItems());
    setProducts(getProductKnowledge());
    setObjections(getObjections());
    setPolicies(getPolicies());
  }

  function handleReset() {
    resetKnowledgeBase();
    refreshAll();
    setEditing(null);
    showFeedback("Exemplos restaurados localmente.");
  }

  function handleSaveKnowledge() {
    if (!knowledgeDraft.title.trim() || !knowledgeDraft.content.trim()) {
      showFeedback("Informe titulo e conteudo.");
      return;
    }

    const payload = {
      title: knowledgeDraft.title,
      content: knowledgeDraft.content,
      category: knowledgeDraft.category,
      status: knowledgeDraft.status,
      priority: knowledgeDraft.priority,
      tags: splitList(knowledgeDraft.tagsText)
    };

    if (editing?.type === "knowledge") setKnowledgeItems(updateKnowledgeItem(editing.id, payload));
    else setKnowledgeItems(createKnowledgeItem(payload));

    setKnowledgeDraft({ ...emptyKnowledge, tagsText: "" });
    setEditing(null);
    showFeedback("Conteudo salvo na Base da IA.");
  }

  function editKnowledge(item: KnowledgeItem) {
    setEditing({ type: "knowledge", id: item.id });
    setKnowledgeDraft({ ...item, tagsText: item.tags.join(", ") });
  }

  function handleSaveFaq() {
    if (!faqDraft.question.trim() || !faqDraft.answer.trim()) {
      showFeedback("Informe pergunta e resposta.");
      return;
    }

    const payload = {
      question: faqDraft.question,
      answer: faqDraft.answer,
      status: faqDraft.status,
      tags: splitList(faqDraft.tagsText)
    };

    if (editing?.type === "faq") setFaqs(updateFAQItem(editing.id, payload));
    else setFaqs(createFAQItem(payload));

    setFaqDraft({ ...emptyFaq, tagsText: "" });
    setEditing(null);
    showFeedback("FAQ salva localmente.");
  }

  function editFaq(item: FAQItem) {
    setEditing({ type: "faq", id: item.id });
    setFaqDraft({ ...item, tagsText: item.tags.join(", ") });
  }

  function handleSaveProduct() {
    if (!productDraft.name.trim() || !productDraft.description.trim()) {
      showFeedback("Informe nome e descricao.");
      return;
    }

    const payload = {
      name: productDraft.name,
      description: productDraft.description,
      price: productDraft.price,
      status: productDraft.status,
      benefits: splitList(productDraft.benefitsText),
      commonQuestions: splitList(productDraft.commonQuestionsText),
      objections: splitList(productDraft.objectionsText)
    };

    if (editing?.type === "products") setProducts(updateProductKnowledgeItem(editing.id, payload));
    else setProducts(createProductKnowledgeItem(payload));

    setProductDraft({ ...emptyProduct, benefitsText: "", commonQuestionsText: "", objectionsText: "" });
    setEditing(null);
    showFeedback("Produto ou servico salvo.");
  }

  function editProduct(item: ProductKnowledgeItem) {
    setEditing({ type: "products", id: item.id });
    setProductDraft({
      ...item,
      benefitsText: joinList(item.benefits),
      commonQuestionsText: joinList(item.commonQuestions),
      objectionsText: joinList(item.objections)
    });
  }

  function handleSaveObjection() {
    if (!objectionDraft.objection.trim() || !objectionDraft.suggestedAnswer.trim()) {
      showFeedback("Informe objecao e resposta sugerida.");
      return;
    }

    if (editing?.type === "objections") setObjections(updateObjection(editing.id, objectionDraft));
    else setObjections(createObjection(objectionDraft));

    setObjectionDraft(emptyObjection);
    setEditing(null);
    showFeedback("Objecao salva localmente.");
  }

  function editObjection(item: ObjectionItem) {
    setEditing({ type: "objections", id: item.id });
    setObjectionDraft(item);
  }

  function handleSavePolicy() {
    if (!policyDraft.title.trim() || !policyDraft.description.trim()) {
      showFeedback("Informe titulo e descricao.");
      return;
    }

    if (editing?.type === "policies") setPolicies(updatePolicy(editing.id, policyDraft));
    else setPolicies(createPolicy(policyDraft));

    setPolicyDraft(emptyPolicy);
    setEditing(null);
    showFeedback("Politica salva localmente.");
  }

  function editPolicy(item: PolicyItem) {
    setEditing({ type: "policies", id: item.id });
    setPolicyDraft(item);
  }

  function copyPrompt() {
    void navigator.clipboard?.writeText(prompt);
    showFeedback("Prompt copiado.");
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-8 text-slate-100">
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                <Brain className="h-4 w-4" />
                Inteligencia do atendimento
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Base de Conhecimento</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Cadastre informacoes para a IA responder melhor seus clientes.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 transition hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
              Resetar exemplos
            </button>
          </div>
        </header>

        {feedback ? (
          <div className="mb-6 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-200">
            {feedback}
          </div>
        ) : null}

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard title="Total de conteudos" value={stats.total} icon={BookOpen} />
          <MetricCard title="FAQs ativas" value={stats.activeFaqs} icon={Lightbulb} />
          <MetricCard title="Produtos/servicos" value={stats.products} icon={Package} />
          <MetricCard title="Objecoes" value={stats.objections} icon={ShieldCheck} />
          <MetricCard title="Politicas" value={stats.policies} icon={FileText} />
        </section>

        <section className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="field-input pl-10" placeholder="Buscar na base" />
            </div>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as "all" | KnowledgeCategory)} className="field-input">
              {categories.map((category) => (
                <option value={category.value} key={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | KnowledgeItemStatus)} className="field-input">
              {statuses.map((status) => (
                <option value={status.value} key={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-md border px-3 py-2 text-xs font-black transition",
                  activeTab === tab.id ? "border-emerald-400 bg-emerald-400 text-slate-950" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                )}
                key={tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {activeTab === "overview" ? (
          <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
              <h2 className="mb-4 text-xl font-black text-white">Itens principais</h2>
              <div className="grid gap-3">
                {filteredKnowledge.map((item) => (
                  <div className="rounded-md border border-white/10 bg-white/[0.04] p-4" key={item.id}>
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="font-black text-white">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{item.content}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${statusClass(item.status)}`}>{item.status}</span>
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${priorityClass(item.priority)}`}>{item.priority}</span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-black text-slate-300">{item.category}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => editKnowledge(item)} className="rounded-md border border-white/10 bg-white/5 p-2 text-slate-200 hover:bg-white/10">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setKnowledgeItems(deleteKnowledgeItem(item.id))}
                          className="rounded-md border border-red-400/30 bg-red-500/10 p-2 text-red-200 hover:bg-red-500/15"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <aside className="grid gap-5">
              <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
                <h2 className="mb-4 text-xl font-black text-white">Novo conteudo geral</h2>
                <div className="grid gap-3">
                  <Field label="Titulo">
                    <input value={knowledgeDraft.title} onChange={(event) => setKnowledgeDraft((current) => ({ ...current, title: event.target.value }))} className="field-input" />
                  </Field>
                  <Field label="Categoria">
                    <select
                      value={knowledgeDraft.category}
                      onChange={(event) => setKnowledgeDraft((current) => ({ ...current, category: event.target.value as KnowledgeCategory }))}
                      className="field-input"
                    >
                      {categories.filter((category) => category.value !== "all").map((category) => (
                        <option value={category.value} key={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Conteudo">
                    <textarea
                      value={knowledgeDraft.content}
                      onChange={(event) => setKnowledgeDraft((current) => ({ ...current, content: event.target.value }))}
                      className="field-input min-h-28 resize-none py-3"
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Prioridade">
                      <select
                        value={knowledgeDraft.priority}
                        onChange={(event) => setKnowledgeDraft((current) => ({ ...current, priority: event.target.value as KnowledgePriority }))}
                        className="field-input"
                      >
                        <option value="low">Baixa</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                      </select>
                    </Field>
                    <Field label="Status">
                      <select
                        value={knowledgeDraft.status}
                        onChange={(event) => setKnowledgeDraft((current) => ({ ...current, status: event.target.value as KnowledgeItemStatus }))}
                        className="field-input"
                      >
                        <option value="active">Ativo</option>
                        <option value="draft">Rascunho</option>
                        <option value="archived">Arquivado</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Tags">
                    <input
                      value={knowledgeDraft.tagsText}
                      onChange={(event) => setKnowledgeDraft((current) => ({ ...current, tagsText: event.target.value }))}
                      className="field-input"
                      placeholder="preco, prazo, suporte"
                    />
                  </Field>
                  <button type="button" onClick={handleSaveKnowledge} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 hover:bg-emerald-300">
                    <Plus className="h-4 w-4" />
                    {editing?.type === "knowledge" ? "Salvar conteudo" : "Criar conteudo"}
                  </button>
                </div>
              </article>

              <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
                <h2 className="mb-4 text-xl font-black text-white">Insights da cobertura</h2>
                <div className="grid gap-3">
                  {insights.map((insight) => (
                    <div className="rounded-md border border-white/10 bg-white/[0.04] p-4" key={insight.id}>
                      <p className="font-black text-white">{insight.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{insight.description}</p>
                    </div>
                  ))}
                </div>
                <h3 className="mt-5 font-black text-white">Sugestoes do que cadastrar</h3>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-400">
                  {suggestions.map((suggestion) => (
                    <li className="rounded-md border border-white/10 bg-white/[0.04] p-3" key={suggestion}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </article>
            </aside>
          </section>
        ) : null}

        {activeTab === "faq" ? (
          <CrudSection
            title="Perguntas frequentes"
            form={
              <div className="grid gap-3">
                <Field label="Pergunta">
                  <input value={faqDraft.question} onChange={(event) => setFaqDraft((current) => ({ ...current, question: event.target.value }))} className="field-input" />
                </Field>
                <Field label="Resposta">
                  <textarea value={faqDraft.answer} onChange={(event) => setFaqDraft((current) => ({ ...current, answer: event.target.value }))} className="field-input min-h-28 resize-none py-3" />
                </Field>
                <Field label="Tags">
                  <input value={faqDraft.tagsText} onChange={(event) => setFaqDraft((current) => ({ ...current, tagsText: event.target.value }))} className="field-input" />
                </Field>
                <Field label="Status">
                  <select value={faqDraft.status} onChange={(event) => setFaqDraft((current) => ({ ...current, status: event.target.value as KnowledgeItemStatus }))} className="field-input">
                    <option value="active">Ativo</option>
                    <option value="draft">Rascunho</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </Field>
                <button type="button" onClick={handleSaveFaq} className="primary-action">{editing?.type === "faq" ? "Salvar FAQ" : "Criar FAQ"}</button>
              </div>
            }
          >
            {faqs.map((item) => (
              <ListCard key={item.id} title={item.question} description={item.answer} status={item.status} onEdit={() => editFaq(item)} onDelete={() => setFaqs(deleteFAQItem(item.id))} />
            ))}
          </CrudSection>
        ) : null}

        {activeTab === "products" ? (
          <CrudSection
            title="Produtos e servicos"
            form={
              <div className="grid gap-3">
                <Field label="Nome">
                  <input value={productDraft.name} onChange={(event) => setProductDraft((current) => ({ ...current, name: event.target.value }))} className="field-input" />
                </Field>
                <Field label="Descricao">
                  <textarea value={productDraft.description} onChange={(event) => setProductDraft((current) => ({ ...current, description: event.target.value }))} className="field-input min-h-24 resize-none py-3" />
                </Field>
                <Field label="Preco opcional">
                  <input value={productDraft.price || ""} onChange={(event) => setProductDraft((current) => ({ ...current, price: event.target.value }))} className="field-input" />
                </Field>
                <Field label="Beneficios">
                  <textarea value={productDraft.benefitsText} onChange={(event) => setProductDraft((current) => ({ ...current, benefitsText: event.target.value }))} className="field-input min-h-20 resize-none py-3" />
                </Field>
                <Field label="Perguntas comuns">
                  <textarea value={productDraft.commonQuestionsText} onChange={(event) => setProductDraft((current) => ({ ...current, commonQuestionsText: event.target.value }))} className="field-input min-h-20 resize-none py-3" />
                </Field>
                <Field label="Objecoes">
                  <textarea value={productDraft.objectionsText} onChange={(event) => setProductDraft((current) => ({ ...current, objectionsText: event.target.value }))} className="field-input min-h-20 resize-none py-3" />
                </Field>
                <button type="button" onClick={handleSaveProduct} className="primary-action">
                  {editing?.type === "products" ? "Salvar produto/servico" : "Criar produto/servico"}
                </button>
              </div>
            }
          >
            {products.map((item) => (
              <ListCard
                key={item.id}
                title={item.name}
                description={`${item.description}${item.price ? ` Preco: ${item.price}.` : ""}`}
                status={item.status}
                onEdit={() => editProduct(item)}
                onDelete={() => setProducts(deleteProductKnowledgeItem(item.id))}
              />
            ))}
          </CrudSection>
        ) : null}

        {activeTab === "objections" ? (
          <CrudSection
            title="Objecoes"
            form={
              <div className="grid gap-3">
                <Field label="Objecao">
                  <input value={objectionDraft.objection} onChange={(event) => setObjectionDraft((current) => ({ ...current, objection: event.target.value }))} className="field-input" />
                </Field>
                <Field label="Resposta sugerida">
                  <textarea value={objectionDraft.suggestedAnswer} onChange={(event) => setObjectionDraft((current) => ({ ...current, suggestedAnswer: event.target.value }))} className="field-input min-h-28 resize-none py-3" />
                </Field>
                <button type="button" onClick={handleSaveObjection} className="primary-action">{editing?.type === "objections" ? "Salvar objecao" : "Criar objecao"}</button>
              </div>
            }
          >
            {objections.map((item) => (
              <ListCard key={item.id} title={item.objection} description={item.suggestedAnswer} status={item.status} onEdit={() => editObjection(item)} onDelete={() => setObjections(deleteObjection(item.id))} />
            ))}
          </CrudSection>
        ) : null}

        {activeTab === "policies" ? (
          <CrudSection
            title="Politicas comerciais"
            form={
              <div className="grid gap-3">
                <Field label="Titulo">
                  <input value={policyDraft.title} onChange={(event) => setPolicyDraft((current) => ({ ...current, title: event.target.value }))} className="field-input" />
                </Field>
                <Field label="Categoria">
                  <select value={policyDraft.category} onChange={(event) => setPolicyDraft((current) => ({ ...current, category: event.target.value as KnowledgeCategory }))} className="field-input">
                    {categories.filter((category) => category.value !== "all").map((category) => (
                      <option value={category.value} key={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Descricao">
                  <textarea value={policyDraft.description} onChange={(event) => setPolicyDraft((current) => ({ ...current, description: event.target.value }))} className="field-input min-h-28 resize-none py-3" />
                </Field>
                <button type="button" onClick={handleSavePolicy} className="primary-action">{editing?.type === "policies" ? "Salvar politica" : "Criar politica"}</button>
              </div>
            }
          >
            {policies.map((item) => (
              <ListCard key={item.id} title={item.title} description={item.description} status={item.status} onEdit={() => editPolicy(item)} onDelete={() => setPolicies(deletePolicy(item.id))} />
            ))}
          </CrudSection>
        ) : null}

        {activeTab === "prompt" ? (
          <section className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/25">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Prompt da IA</h2>
                <p className="mt-2 text-sm text-slate-400">Este prompt sera usado futuramente na integracao real com IA.</p>
              </div>
              <button type="button" onClick={copyPrompt} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 text-sm font-black text-slate-950 hover:bg-emerald-300">
                <Copy className="h-4 w-4" />
                Copiar prompt
              </button>
            </div>
            <pre className="max-h-[620px] overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-[#080d13] p-4 text-xs leading-5 text-slate-300">{prompt}</pre>
          </section>
        ) : null}
      </section>
    </main>
  );
}

function CrudSection({ title, form, children }: { title: string; form: ReactNode; children: ReactNode }) {
  return (
    <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20 lg:sticky lg:top-6 lg:self-start">
        <h2 className="mb-4 text-xl font-black text-white">{title}</h2>
        {form}
      </article>
      <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
        <div className="grid gap-3">{children}</div>
      </article>
    </section>
  );
}

function ListCard({
  title,
  description,
  status,
  onEdit,
  onDelete
}: {
  title: string;
  description: string;
  status: KnowledgeItemStatus;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="font-black text-white">{title}</h3>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${statusClass(status)}`}>{status}</span>
          </div>
          <p className="text-sm leading-6 text-slate-400">{description}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onEdit} className="rounded-md border border-white/10 bg-white/5 p-2 text-slate-200 hover:bg-white/10">
            <Edit3 className="h-4 w-4" />
          </button>
          <button type="button" onClick={onDelete} className="rounded-md border border-red-400/30 bg-red-500/10 p-2 text-red-200 hover:bg-red-500/15">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KnowledgeBasePage() {
  return (
    <ProtectedRoute>
      <KnowledgeBaseContent />
    </ProtectedRoute>
  );
}
