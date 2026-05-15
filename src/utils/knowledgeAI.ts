import type { KnowledgeInsight } from "@/types/knowledge";
import { getFAQItems, getKnowledgeBaseStats, getKnowledgeItems, getObjections, getPolicies, getProductKnowledge } from "@/utils/knowledgeStorage";

type KnowledgeSearchResult = {
  id: string;
  title: string;
  content: string;
  source: "faq" | "product" | "objection" | "policy" | "knowledge";
  score: number;
  tags: string[];
};

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function termsFromQuery(query: string) {
  return normalizeText(query)
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 3);
}

function scoreText(text: string, queryTerms: string[]) {
  const normalized = normalizeText(text);
  return queryTerms.reduce((score, term) => score + (normalized.includes(term) ? 1 : 0), 0);
}

export function searchKnowledgeBase(query: string): KnowledgeSearchResult[] {
  const terms = termsFromQuery(query);
  if (!terms.length) return [];

  const results: KnowledgeSearchResult[] = [];

  getFAQItems()
    .filter((item) => item.status === "active")
    .forEach((item) => {
      const text = `${item.question} ${item.answer} ${item.tags.join(" ")}`;
      const score = scoreText(text, terms);
      if (score > 0) {
        results.push({
          id: item.id,
          title: item.question,
          content: item.answer,
          source: "faq",
          score,
          tags: item.tags
        });
      }
    });

  getProductKnowledge()
    .filter((item) => item.status === "active")
    .forEach((item) => {
      const text = `${item.name} ${item.description} ${item.price || ""} ${item.benefits.join(" ")} ${item.commonQuestions.join(" ")} ${item.objections.join(" ")}`;
      const score = scoreText(text, terms);
      if (score > 0) {
        results.push({
          id: item.id,
          title: item.name,
          content: `${item.description}${item.price ? ` Preco: ${item.price}.` : ""} Beneficios: ${item.benefits.join(", ")}.`,
          source: "product",
          score,
          tags: item.benefits
        });
      }
    });

  getObjections()
    .filter((item) => item.status === "active")
    .forEach((item) => {
      const text = `${item.objection} ${item.suggestedAnswer} ${item.category}`;
      const score = scoreText(text, terms);
      if (score > 0) {
        results.push({
          id: item.id,
          title: item.objection,
          content: item.suggestedAnswer,
          source: "objection",
          score,
          tags: [item.category]
        });
      }
    });

  getPolicies()
    .filter((item) => item.status === "active")
    .forEach((item) => {
      const text = `${item.title} ${item.description} ${item.category}`;
      const score = scoreText(text, terms);
      if (score > 0) {
        results.push({
          id: item.id,
          title: item.title,
          content: item.description,
          source: "policy",
          score,
          tags: [item.category]
        });
      }
    });

  getKnowledgeItems()
    .filter((item) => item.status === "active")
    .forEach((item) => {
      const text = `${item.title} ${item.content} ${item.tags.join(" ")} ${item.category}`;
      const score = scoreText(text, terms) + (item.priority === "high" ? 1 : 0);
      if (score > 0) {
        results.push({
          id: item.id,
          title: item.title,
          content: item.content,
          source: "knowledge",
          score,
          tags: item.tags
        });
      }
    });

  return results.sort((a, b) => b.score - a.score).slice(0, 5);
}

export function generateAnswerFromKnowledge(query: string) {
  const results = searchKnowledgeBase(query);

  if (!results.length) {
    return {
      usedKnowledge: false,
      answer:
        "Nao encontrei uma informacao especifica na base. Sugestao: responda com cuidado, confirme os detalhes com o cliente e cadastre essa duvida na Base da IA para melhorar as proximas respostas.",
      references: []
    };
  }

  const top = results[0];
  const supporting = results.slice(1, 3).map((item) => item.title);

  return {
    usedKnowledge: true,
    answer: `Resposta sugerida com base em "${top.title}": ${top.content}${supporting.length ? ` Tambem encontrei apoio em: ${supporting.join(", ")}.` : ""}`,
    references: results
  };
}

export function generateKnowledgePrompt() {
  const faqs = getFAQItems().filter((item) => item.status === "active");
  const products = getProductKnowledge().filter((item) => item.status === "active");
  const objections = getObjections().filter((item) => item.status === "active");
  const policies = getPolicies().filter((item) => item.status === "active");
  const general = getKnowledgeItems().filter((item) => item.status === "active");

  return [
    "Voce e a IA de atendimento do AtendeZap IA.",
    "Use a base de conhecimento abaixo para responder clientes com clareza, sem inventar informacoes e sem prometer resultados garantidos.",
    "",
    "PERGUNTAS FREQUENTES:",
    ...faqs.map((item) => `- Pergunta: ${item.question}\n  Resposta: ${item.answer}`),
    "",
    "PRODUTOS E SERVICOS:",
    ...products.map((item) => `- ${item.name}: ${item.description}${item.price ? ` Preco: ${item.price}.` : ""} Beneficios: ${item.benefits.join(", ")}.`),
    "",
    "OBJECOES E RESPOSTAS:",
    ...objections.map((item) => `- Objecao: ${item.objection}\n  Resposta sugerida: ${item.suggestedAnswer}`),
    "",
    "POLITICAS:",
    ...policies.map((item) => `- ${item.title}: ${item.description}`),
    "",
    "INSTRUCOES GERAIS:",
    ...general.map((item) => `- ${item.title}: ${item.content}`)
  ].join("\n");
}

export function analyzeKnowledgeCoverage(): KnowledgeInsight[] {
  const stats = getKnowledgeBaseStats();
  const now = new Date().toISOString();
  const insights: KnowledgeInsight[] = [];

  insights.push({
    id: "coverage-total",
    title: stats.total >= 15 ? "Base bem alimentada" : "Base ainda pequena",
    description:
      stats.total >= 15
        ? "Voce ja tem uma quantidade boa de conteudos para orientar respostas locais."
        : "Cadastre mais FAQs, politicas e objecoes para melhorar as sugestoes da IA.",
    type: stats.total >= 15 ? "success" : "warning",
    createdAt: now
  });

  insights.push({
    id: "coverage-faq",
    title: `${stats.activeFaqs} FAQs ativas`,
    description: stats.activeFaqs >= 5 ? "As principais duvidas ja tem respostas cadastradas." : "Inclua mais perguntas frequentes dos clientes.",
    type: stats.activeFaqs >= 5 ? "success" : "info",
    createdAt: now
  });

  insights.push({
    id: "coverage-objections",
    title: `${stats.objections} objecoes cadastradas`,
    description: stats.objections >= 4 ? "A IA ja consegue apoiar respostas para barreiras comuns de compra." : "Cadastre objecoes como preco, prazo e duvida.",
    type: stats.objections >= 4 ? "success" : "warning",
    createdAt: now
  });

  return insights;
}

export function suggestMissingKnowledge() {
  const stats = getKnowledgeBaseStats();
  const suggestions: string[] = [];

  if (stats.activeFaqs < 6) suggestions.push("Cadastre as 10 perguntas mais repetidas no WhatsApp.");
  if (stats.products < 4) suggestions.push("Adicione seus principais produtos ou servicos com beneficios e preco quando existir.");
  if (stats.objections < 5) suggestions.push("Inclua respostas para objecoes como preco, prazo, confianca e comparacao.");
  if (stats.policies < 4) suggestions.push("Documente politicas de pagamento, entrega, suporte e cancelamento.");

  if (!suggestions.length) {
    suggestions.push("Revise a base mensalmente e adicione novas duvidas que aparecerem no atendimento.");
  }

  return suggestions;
}
