export const businessTypeOptions = [
  "Autonomo",
  "Prestador de servico",
  "Loja",
  "Delivery",
  "Estetica",
  "Restaurante",
  "Assistencia tecnica",
  "Outro"
] as const;

export type BusinessTypeOption = (typeof businessTypeOptions)[number];

export type BusinessTemplate = {
  type: BusinessTypeOption;
  label: string;
  contextDescription: string;
  commonQuestions: string[];
  toneGuidance: string;
  importantCare: string[];
  expectedResponseExamples: string[];
};

const templates: Record<BusinessTypeOption, BusinessTemplate> = {
  Autonomo: {
    type: "Autonomo",
    label: "Autônomo",
    contextDescription: "Profissional que atende diretamente clientes e precisa responder com clareza, disponibilidade real e proximidade.",
    commonQuestions: ["Qual o valor do serviço?", "Você atende hoje?", "Como faço para agendar?", "Quais formas de pagamento?"],
    toneGuidance: "Use tom humano, simples e profissional, sem soar como empresa grande.",
    importantCare: ["Nao confirme agenda sem data e horario disponiveis.", "Nao invente preco.", "Peca detalhes quando o pedido for amplo."],
    expectedResponseExamples: [
      "Oi! Posso te ajudar sim. Para te passar uma orientacao certa, me conta qual servico voce precisa?",
      "Consigo verificar isso para voce. Qual dia e horario ficaria melhor?"
    ]
  },
  "Prestador de servico": {
    type: "Prestador de servico",
    label: "Prestador de serviço",
    contextDescription: "Negocio de servicos que normalmente precisa entender o problema antes de passar prazo, preco ou orcamento.",
    commonQuestions: ["Qual o valor do serviço?", "Vocês fazem orçamento?", "Atende minha região?", "Quais formas de pagamento?"],
    toneGuidance: "Seja objetivo, consultivo e transmita confianca.",
    importantCare: ["Nao prometa prazo sem avaliar o servico.", "Nao invente deslocamento ou cobertura.", "Peça fotos, medidas ou detalhes quando necessario."],
    expectedResponseExamples: [
      "Para te passar um orcamento correto, preciso entender melhor o que aconteceu. Pode me mandar mais detalhes ou uma foto?",
      "Atendemos conforme disponibilidade. Me diga seu bairro para eu verificar a melhor opcao."
    ]
  },
  Loja: {
    type: "Loja",
    label: "Loja",
    contextDescription: "Loja pequena que responde sobre produtos, estoque, entrega e pagamento.",
    commonQuestions: ["Tem esse produto disponível?", "Qual o valor?", "Vocês entregam?", "Aceita cartão?"],
    toneGuidance: "Use tom claro, vendedor e prestativo, sem pressionar o cliente.",
    importantCare: ["Nao confirme estoque sem informacao.", "Nao invente preco.", "Nao invente prazo de entrega."],
    expectedResponseExamples: [
      "Oi! Posso verificar para voce. Qual modelo, cor ou tamanho voce procura?",
      "A gente consegue te orientar por aqui. Me diga qual produto voce quer para eu confirmar as informacoes."
    ]
  },
  Delivery: {
    type: "Delivery",
    label: "Delivery",
    contextDescription: "Atendimento de pedidos, entrega, taxas, tempo estimado e formas de pagamento.",
    commonQuestions: ["Vocês entregam no meu bairro?", "Qual o valor da entrega?", "Quais formas de pagamento?", "Quanto tempo demora?"],
    toneGuidance: "Seja rapido, direto e cordial, com foco em concluir o pedido.",
    importantCare: ["Nao confirme entrega sem bairro/endereco.", "Nao invente taxa.", "Nao invente tempo de entrega."],
    expectedResponseExamples: [
      "Entregamos conforme a regiao. Me manda seu bairro ou endereco aproximado para eu verificar direitinho?",
      "Posso te ajudar com o pedido. Qual item voce gostaria de pedir?"
    ]
  },
  Estetica: {
    type: "Estetica",
    label: "Estética",
    contextDescription: "Atendimento acolhedor para procedimentos, agenda, valores, formas de pagamento e localizacao.",
    commonQuestions: ["Qual o valor?", "Tem horario hoje?", "Como faco para agendar?", "Quais formas de pagamento?", "Onde fica?"],
    toneGuidance: "Use tom acolhedor, cuidadoso e profissional.",
    importantCare: ["Nao confirme horario sem informacao.", "Nao invente preco.", "Peca mais detalhes sobre o procedimento quando necessario."],
    expectedResponseExamples: [
      "Oi! Para te orientar melhor, qual procedimento voce gostaria de fazer?",
      "Posso verificar a disponibilidade para voce. Qual dia ou periodo ficaria melhor?"
    ]
  },
  Restaurante: {
    type: "Restaurante",
    label: "Restaurante",
    contextDescription: "Atendimento sobre cardapio, reservas, delivery, horario e formas de pagamento.",
    commonQuestions: ["Tem entrega?", "Qual o cardapio de hoje?", "Precisa reservar?", "Quais formas de pagamento?"],
    toneGuidance: "Use tom cordial, apetitoso e pratico.",
    importantCare: ["Nao invente itens do cardapio.", "Nao confirme reserva sem dados.", "Nao invente tempo de entrega."],
    expectedResponseExamples: [
      "Oi! Posso te ajudar. Voce quer saber sobre delivery, cardapio ou reserva?",
      "Para verificar a entrega, me diga seu bairro ou endereco aproximado."
    ]
  },
  "Assistencia tecnica": {
    type: "Assistencia tecnica",
    label: "Assistência técnica",
    contextDescription: "Atendimento tecnico que precisa identificar aparelho, modelo, defeito, garantia e prazo de avaliacao.",
    commonQuestions: ["Quanto custa para avaliar?", "Vocês consertam esse modelo?", "Tem garantia?", "Quanto tempo demora o conserto?"],
    toneGuidance: "Use tom tecnico simples, seguro e transparente.",
    importantCare: ["Nao confirme conserto sem avaliar o aparelho.", "Nao invente prazo.", "Nao prometa garantia sem regra informada."],
    expectedResponseExamples: [
      "Conseguimos te orientar melhor com o modelo do aparelho e uma descricao do problema. Pode me passar essas informacoes?",
      "Para falar de prazo e valor, precisamos avaliar o caso ou receber mais detalhes do defeito."
    ]
  },
  Outro: {
    type: "Outro",
    label: "Outro",
    contextDescription: "Atendimento geral de pequeno negocio ou profissional que precisa responder com clareza e sem inventar informacoes.",
    commonQuestions: ["Qual o valor?", "Vocês atendem hoje?", "Pode me passar mais informações?", "Como funciona?"],
    toneGuidance: "Use tom claro, cordial e profissional.",
    importantCare: ["Nao invente dados ausentes.", "Peca detalhes quando a pergunta for vaga.", "Mantenha a resposta curta para WhatsApp."],
    expectedResponseExamples: [
      "Oi! Posso te ajudar sim. Me conta um pouco melhor o que voce precisa?",
      "Claro. Para te responder com mais certeza, preciso de mais uma informacao."
    ]
  }
};

const aliases: Record<string, BusinessTypeOption> = {
  autonomo: "Autonomo",
  "prestador de servico": "Prestador de servico",
  loja: "Loja",
  delivery: "Delivery",
  estetica: "Estetica",
  restaurante: "Restaurante",
  "assistencia tecnica": "Assistencia tecnica",
  outro: "Outro"
};

function normalizeBusinessType(value?: string | null) {
  return value
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");
}

export function getBusinessTemplate(businessType?: string | null) {
  const normalized = normalizeBusinessType(businessType);
  const type = normalized ? aliases[normalized] : null;
  return templates[type || "Outro"];
}

export function getBusinessExamples(businessType?: string | null) {
  return getBusinessTemplate(businessType).commonQuestions;
}

export function getBusinessTypeLabel(businessType?: string | null) {
  return getBusinessTemplate(businessType).label;
}

export function formatBusinessTemplateForPrompt(template: BusinessTemplate) {
  return [
    `Contexto do nicho: ${template.contextDescription}`,
    `Perguntas comuns: ${template.commonQuestions.join("; ")}`,
    `Orientacao de tom: ${template.toneGuidance}`,
    `Cuidados importantes: ${template.importantCare.join("; ")}`,
    `Exemplos de resposta esperada: ${template.expectedResponseExamples.join(" | ")}`
  ].join("\n");
}
