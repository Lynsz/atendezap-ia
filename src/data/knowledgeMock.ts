import type { FAQItem, KnowledgeItem, ObjectionItem, PolicyItem, ProductKnowledgeItem } from "@/types/knowledge";

const now = "2026-05-15T12:00:00.000Z";

export const faqMock: FAQItem[] = [
  {
    id: "faq-1",
    question: "Qual o horario de atendimento?",
    answer: "Atendemos de segunda a sexta das 8h as 18h e aos sabados das 8h as 12h.",
    tags: ["horario", "atendimento", "agenda"],
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "faq-2",
    question: "Quais formas de pagamento voces aceitam?",
    answer: "Aceitamos Pix, cartao de credito, cartao de debito e dinheiro. Condicoes podem variar conforme o servico.",
    tags: ["pagamento", "pix", "cartao"],
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "faq-3",
    question: "Como funciona o suporte?",
    answer: "O suporte e feito pelo WhatsApp em horario comercial. Casos urgentes recebem prioridade na fila.",
    tags: ["suporte", "whatsapp", "prioridade"],
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "faq-4",
    question: "Voces fazem entrega?",
    answer: "A entrega depende da regiao e do tipo de pedido. Confirme o endereco para validarmos prazo e taxa.",
    tags: ["entrega", "taxa", "endereco"],
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "faq-5",
    question: "Qual o prazo de resposta?",
    answer: "Respondemos normalmente em ate 30 minutos dentro do horario de atendimento.",
    tags: ["prazo", "resposta", "atendimento"],
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "faq-6",
    question: "Preciso agendar antes?",
    answer: "Recomendamos agendar para garantir disponibilidade. Alguns atendimentos podem ser encaixados no mesmo dia.",
    tags: ["agenda", "disponibilidade", "encaixe"],
    status: "active",
    createdAt: now,
    updatedAt: now
  }
];

export const productKnowledgeMock: ProductKnowledgeItem[] = [
  {
    id: "product-1",
    name: "Atendimento express",
    description: "Servico rapido para clientes que precisam de retorno no mesmo dia.",
    price: "Sob consulta",
    benefits: ["Agilidade", "Prioridade na fila", "Orientacao objetiva"],
    commonQuestions: ["Tem horario hoje?", "Quanto tempo demora?", "Posso pagar no Pix?"],
    objections: ["Esta caro", "Vou pensar", "Consigo desconto?"],
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "product-2",
    name: "Plano mensal de acompanhamento",
    description: "Pacote para clientes que precisam de atendimento recorrente.",
    price: "A partir de R$79,00/mes",
    benefits: ["Organizacao", "Previsibilidade", "Contato facilitado"],
    commonQuestions: ["Posso cancelar?", "Tem contrato?", "Como renova?"],
    objections: ["Nao quero compromisso", "Prefiro pagar avulso"],
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "product-3",
    name: "Servico personalizado",
    description: "Atendimento sob medida de acordo com a necessidade do cliente.",
    price: "Orcamento personalizado",
    benefits: ["Solucao adaptada", "Melhor encaixe", "Acompanhamento consultivo"],
    commonQuestions: ["Como recebo o orcamento?", "O que voces precisam saber?"],
    objections: ["Preciso comparar", "Me manda so o preco"],
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "product-4",
    name: "Suporte pos-venda",
    description: "Orientacao apos a compra ou atendimento para tirar duvidas e evitar retrabalho.",
    benefits: ["Mais seguranca", "Melhor experiencia", "Menos duvidas repetidas"],
    commonQuestions: ["Por quanto tempo tenho suporte?", "Como aciono o suporte?"],
    objections: ["Nao preciso de suporte", "Depois eu vejo"],
    status: "active",
    createdAt: now,
    updatedAt: now
  }
];

export const objectionMock: ObjectionItem[] = [
  {
    id: "objection-1",
    objection: "Esta caro",
    suggestedAnswer: "Entendo. O valor considera qualidade, atendimento e suporte. Posso te mostrar a opcao mais simples para comecar?",
    category: "objection",
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "objection-2",
    objection: "Vou pensar e depois retorno",
    suggestedAnswer: "Claro. Para te ajudar a decidir, posso resumir as opcoes e deixar o proximo passo pronto quando quiser continuar.",
    category: "objection",
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "objection-3",
    objection: "Preciso falar com outra pessoa antes",
    suggestedAnswer: "Sem problema. Posso te enviar um resumo com valores, beneficios e prazo para voce compartilhar?",
    category: "objection",
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "objection-4",
    objection: "Achei outro mais barato",
    suggestedAnswer: "Entendo. Alem do preco, vale comparar prazo, suporte e qualidade. Posso te explicar o que esta incluido aqui?",
    category: "objection",
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "objection-5",
    objection: "Nao tenho certeza se preciso disso agora",
    suggestedAnswer: "Tudo bem. Me conta o que voce quer resolver primeiro e eu te digo se faz sentido comecar agora ou esperar.",
    category: "objection",
    status: "active",
    createdAt: now,
    updatedAt: now
  }
];

export const policyMock: PolicyItem[] = [
  {
    id: "policy-1",
    title: "Politica de agendamento",
    description: "Agendamentos dependem de disponibilidade. Remarcacoes devem ser solicitadas com antecedencia sempre que possivel.",
    category: "schedule",
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "policy-2",
    title: "Politica de pagamento",
    description: "Pagamentos podem ser feitos por Pix, cartao ou dinheiro. Em alguns casos, pode ser necessario sinal.",
    category: "payment",
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "policy-3",
    title: "Politica de entrega",
    description: "Entregas sao confirmadas conforme regiao, disponibilidade e tipo de pedido.",
    category: "delivery",
    status: "active",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "policy-4",
    title: "Politica de suporte",
    description: "O suporte acontece em horario comercial pelo WhatsApp. O usuario deve revisar orientacoes antes de aplicar.",
    category: "support",
    status: "active",
    createdAt: now,
    updatedAt: now
  }
];

export const knowledgeItemsMock: KnowledgeItem[] = [
  {
    id: "knowledge-1",
    title: "Tom de atendimento padrao",
    content: "Responder de forma clara, educada e objetiva. Evitar promessas absolutas e confirmar dados antes de fechar.",
    category: "custom",
    status: "active",
    tags: ["tom", "atendimento", "padrao"],
    priority: "high",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "knowledge-2",
    title: "Como pedir dados do cliente",
    content: "Pedir nome, servico desejado, melhor horario e forma de pagamento quando for necessario para o atendimento.",
    category: "support",
    status: "active",
    tags: ["dados", "cliente", "qualificacao"],
    priority: "medium",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "knowledge-3",
    title: "Instrucao sobre precos",
    content: "Nunca inventar preco exato. Se nao houver preco cadastrado, explicar que o valor depende dos detalhes do pedido.",
    category: "payment",
    status: "active",
    tags: ["preco", "orcamento", "pagamento"],
    priority: "high",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "knowledge-4",
    title: "Follow-up comercial",
    content: "Quando o cliente sumir, retomar com gentileza, resumir o que foi combinado e oferecer ajuda para o proximo passo.",
    category: "custom",
    status: "active",
    tags: ["follow-up", "retorno", "venda"],
    priority: "medium",
    createdAt: now,
    updatedAt: now
  }
];
