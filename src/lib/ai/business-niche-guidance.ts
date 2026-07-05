export const businessNiches = [
  "delivery",
  "restaurante",
  "estetica",
  "loja",
  "assistencia_tecnica",
  "prestador_servico",
  "autonomo",
  "geral"
] as const;

export type BusinessNiche = (typeof businessNiches)[number];

export type BusinessNicheGuidance = {
  niche: BusinessNiche;
  label: string;
  guidance: string[];
};

const nicheGuidance: Record<BusinessNiche, BusinessNicheGuidance> = {
  delivery: {
    niche: "delivery",
    label: "Delivery",
    guidance: [
      "Confirme bairro ou regiao antes de prometer entrega.",
      "Nao invente tempo, taxa, cardapio, disponibilidade ou forma de pagamento.",
      "Pergunte forma de pagamento quando isso for necessario para concluir o pedido."
    ]
  },
  restaurante: {
    niche: "restaurante",
    label: "Restaurante",
    guidance: [
      "Nao invente itens do cardapio, reserva, horario ou disponibilidade.",
      "Confirme quantidade de pessoas antes de tratar reserva.",
      "Para delivery, confirme bairro antes de falar em taxa ou tempo."
    ]
  },
  estetica: {
    niche: "estetica",
    label: "Estetica",
    guidance: [
      "Nao confirme horario sem agenda.",
      "Nao invente preco de procedimento ou disponibilidade.",
      "Evite afirmacao medica; oriente a tirar duvidas especificas com profissional responsavel."
    ]
  },
  loja: {
    niche: "loja",
    label: "Loja",
    guidance: [
      "Nao confirme estoque sem informacao.",
      "Nao invente cor, tamanho, preco, desconto ou prazo de entrega.",
      "Peca modelo, cor ou tamanho quando a pergunta estiver incompleta."
    ]
  },
  assistencia_tecnica: {
    niche: "assistencia_tecnica",
    label: "Assistencia tecnica",
    guidance: [
      "Nao feche diagnostico sem avaliacao.",
      "Nao invente preco, prazo, garantia ou disponibilidade de peca.",
      "Peca modelo, defeito e, quando fizer sentido, foto ou avaliacao do aparelho."
    ]
  },
  prestador_servico: {
    niche: "prestador_servico",
    label: "Prestador de servico",
    guidance: [
      "Nao prometa prazo, valor ou deslocamento sem detalhes do servico.",
      "Peca local, medidas, fotos ou descricao do problema quando necessario.",
      "Explique que o orcamento depende de avaliacao quando faltar informacao."
    ]
  },
  autonomo: {
    niche: "autonomo",
    label: "Autonomo",
    guidance: [
      "Use tom humano e proximo, sem soar como empresa grande.",
      "Nao confirme agenda, preco ou prazo sem contexto.",
      "Peca o detalhe essencial para orientar o cliente sem inventar."
    ]
  },
  geral: {
    niche: "geral",
    label: "Geral",
    guidance: [
      "Se faltar informacao comercial, diga que vai verificar.",
      "Nao invente preco, estoque, prazo, entrega, agenda, endereco ou disponibilidade.",
      "Mantenha a resposta curta e faca uma pergunta final apenas se necessaria."
    ]
  }
};

const aliases: Record<string, BusinessNiche> = {
  delivery: "delivery",
  restaurante: "restaurante",
  estetica: "estetica",
  "estética": "estetica",
  loja: "loja",
  "assistencia tecnica": "assistencia_tecnica",
  "assistência técnica": "assistencia_tecnica",
  "prestador de servico": "prestador_servico",
  "prestador de serviço": "prestador_servico",
  servicos: "prestador_servico",
  "serviços": "prestador_servico",
  autonomo: "autonomo",
  "autônomo": "autonomo",
  geral: "geral",
  outro: "geral"
};

function normalize(value?: string | null) {
  return value
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");
}

export function getBusinessNiche(value?: string | null): BusinessNiche {
  const normalized = normalize(value);
  return normalized ? aliases[normalized] || "geral" : "geral";
}

export function getBusinessNicheGuidance(value?: string | null) {
  return nicheGuidance[getBusinessNiche(value)];
}

export function formatBusinessNicheGuidanceForPrompt(value?: string | null) {
  const guidance = getBusinessNicheGuidance(value);
  return [`Nicho: ${guidance.label}`, ...guidance.guidance.map((item) => `- ${item}`)].join("\n");
}
