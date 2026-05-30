export type NicheSlug =
  | "delivery"
  | "estetica"
  | "assistencia-tecnica"
  | "lojas"
  | "restaurantes"
  | "prestadores-de-servico"
  | "autonomos";

export type NicheFaq = {
  question: string;
  answer: string;
};

export type NicheLanding = {
  slug: NicheSlug;
  route: `/para/${NicheSlug}`;
  name: string;
  label: string;
  headline: string;
  subheadline: string;
  mainPain: string;
  mainPromise: string;
  businessType: string;
  examples: string[];
  safeResponseExample: string;
  benefits: string[];
  recommendedTemplates: string[];
  faq: NicheFaq[];
  seo: {
    title: string;
    description: string;
  };
};

const sharedFaq: NicheFaq[] = [
  {
    question: "O AtendeZap IA envia mensagens sozinho?",
    answer:
      "Nao. O AtendeZap IA nao envia mensagens automaticamente pelo WhatsApp. Ele gera respostas para voce copiar, ajustar e enviar."
  },
  {
    question: "Preciso conectar meu WhatsApp?",
    answer:
      "Nao. Nesta etapa, voce usa o AtendeZap IA para gerar sugestoes de resposta e continua enviando manualmente pelo seu WhatsApp."
  },
  {
    question: "Posso testar antes?",
    answer:
      "Sim. A demo gratuita permite testar uma resposta de exemplo antes de criar conta ou escolher um plano."
  },
  {
    question: "A IA pode errar?",
    answer:
      "Pode. Por isso a resposta deve ser revisada antes do envio. A ferramenta ajuda a escrever melhor, mas voce mantem o controle do atendimento."
  },
  {
    question: "Como funciona o Plano Pro por R$ 29?",
    answer:
      "Novos usuarios do Plano Pro pagam R$ 29 no primeiro mes. Depois, a assinatura continua no valor mensal normal."
  },
  {
    question: "Posso cancelar?",
    answer:
      "Sim. A assinatura e gerenciada pela Stripe, com portal do cliente para acompanhar ou cancelar quando necessario."
  },
  {
    question: "O que acontece se atingir o limite mensal?",
    answer:
      "Novas respostas com IA podem ficar bloqueadas ate a renovacao do ciclo ou troca de plano. O historico ja gerado continua acessivel."
  }
];

export const NICHES: Record<NicheSlug, NicheLanding> = {
  delivery: {
    slug: "delivery",
    route: "/para/delivery",
    name: "Delivery",
    label: "Para delivery",
    headline: "Respostas rapidas para quem atende pedidos por WhatsApp",
    subheadline:
      "Use IA para responder duvidas sobre entrega, taxa, tempo estimado e pagamento sem inventar informacoes.",
    mainPain: "Clientes perguntam o tempo todo sobre bairro atendido, taxa, prazo e formas de pagamento.",
    mainPromise: "Gere respostas claras para revisar, copiar e enviar durante a rotina de pedidos.",
    businessType: "Delivery",
    examples: ["Voces entregam no meu bairro?", "Qual a taxa de entrega?", "Quanto tempo demora?", "Aceita Pix?"],
    safeResponseExample:
      "Oi! Para verificar direitinho, me envie seu bairro ou endereco aproximado. Assim confirmo se atendemos a regiao, a taxa e o tempo estimado antes de fechar o pedido.",
    benefits: [
      "Responder pedidos com mais agilidade",
      "Evitar prometer taxa ou prazo sem confirmar",
      "Manter um tom cordial mesmo nos horarios corridos",
      "Criar respostas reaproveitaveis para perguntas comuns"
    ],
    recommendedTemplates: ["Entrega por bairro", "Taxa de entrega", "Tempo estimado", "Formas de pagamento"],
    faq: [
      {
        question: "Serve para marmitaria, acai, pizzaria ou lanchonete?",
        answer:
          "Sim. A pagina foi pensada para negocios que recebem pedidos e duvidas pelo WhatsApp, desde que a resposta final seja revisada antes do envio."
      },
      ...sharedFaq
    ],
    seo: {
      title: "AtendeZap IA para Delivery - Respostas rapidas para WhatsApp",
      description:
        "Gere respostas com IA para duvidas comuns de clientes no WhatsApp, como entrega, pagamento e tempo estimado. Copie, ajuste e envie."
    }
  },
  estetica: {
    slug: "estetica",
    route: "/para/estetica",
    name: "Estetica",
    label: "Para estetica",
    headline: "Atenda clientes de estetica com respostas mais claras e profissionais",
    subheadline:
      "Crie respostas para perguntas sobre preco, agenda, localizacao e pagamento sem confirmar horarios ou valores que voce ainda nao revisou.",
    mainPain: "Perguntas repetidas sobre valor, horario, agenda e localizacao tomam tempo do atendimento.",
    mainPromise: "Gere respostas acolhedoras para revisar, adaptar ao procedimento e enviar pelo WhatsApp.",
    businessType: "Estetica",
    examples: ["Tem horario hoje?", "Qual o valor?", "Onde fica?", "Como faco para agendar?"],
    safeResponseExample:
      "Oi! Posso te orientar sim. Qual procedimento voce gostaria de fazer? Com isso eu verifico as informacoes corretas de valor, disponibilidade e forma de agendamento.",
    benefits: [
      "Responder com tom acolhedor",
      "Pedir os detalhes certos antes de passar informacoes",
      "Evitar confirmar agenda sem disponibilidade",
      "Padronizar mensagens de primeiro atendimento"
    ],
    recommendedTemplates: ["Valor do procedimento", "Disponibilidade de agenda", "Localizacao", "Pre-agendamento"],
    faq: [
      {
        question: "Serve para manicure, designer de sobrancelhas, estetica facial ou corporal?",
        answer:
          "Sim. Voce configura seu tipo de atendimento e revisa a resposta para adaptar ao procedimento, agenda e regras do seu negocio."
      },
      ...sharedFaq
    ],
    seo: {
      title: "AtendeZap IA para Estetica - Respostas para WhatsApp",
      description:
        "Gere respostas com IA para duvidas sobre preco, agenda, localizacao e pagamento em atendimentos de estetica. Copie, ajuste e envie."
    }
  },
  "assistencia-tecnica": {
    slug: "assistencia-tecnica",
    route: "/para/assistencia-tecnica",
    name: "Assistencia tecnica",
    label: "Para assistencia tecnica",
    headline: "Responda orcamentos e prazos com mais cuidado na assistencia tecnica",
    subheadline:
      "A IA ajuda a pedir modelo, defeito e detalhes antes de falar em prazo, garantia ou valor.",
    mainPain: "Clientes perguntam se conserta, quanto custa, quanto demora e se tem garantia antes de enviar o aparelho.",
    mainPromise: "Crie respostas tecnicas simples para coletar informacoes e evitar promessas incorretas.",
    businessType: "Assistencia tecnica",
    examples: ["Voces consertam esse modelo?", "Quanto custa a avaliacao?", "Tem garantia?", "Quanto tempo demora?"],
    safeResponseExample:
      "Consigo te orientar melhor com o modelo do aparelho e uma descricao do problema. Para falar de valor, prazo ou garantia com seguranca, preciso avaliar essas informacoes primeiro.",
    benefits: [
      "Pedir modelo e defeito de forma objetiva",
      "Evitar prometer conserto sem avaliacao",
      "Explicar prazos e garantias com cautela",
      "Organizar respostas para triagem inicial"
    ],
    recommendedTemplates: ["Triagem por modelo", "Avaliacao tecnica", "Prazo de conserto", "Garantia"],
    faq: [
      {
        question: "Serve para celular, notebook, eletrodomestico ou outro reparo?",
        answer:
          "Sim. A resposta pode ser ajustada para diferentes tipos de assistencia, sempre pedindo dados do aparelho antes de prometer valor ou prazo."
      },
      ...sharedFaq
    ],
    seo: {
      title: "AtendeZap IA para Assistencia Tecnica - Respostas para WhatsApp",
      description:
        "Gere respostas com IA para perguntas sobre orcamento, prazo, garantia e modelos atendidos em assistencia tecnica. Copie, ajuste e envie."
    }
  },
  lojas: {
    slug: "lojas",
    route: "/para/lojas",
    name: "Lojas",
    label: "Para lojas",
    headline: "Respostas melhores para lojas que vendem pelo WhatsApp",
    subheadline:
      "Ajude clientes com duvidas sobre disponibilidade, preco, entrega, troca e pagamento sem confirmar estoque sem checar.",
    mainPain: "Clientes perguntam sobre produto, valor, entrega e troca enquanto voce tambem cuida da venda.",
    mainPromise: "Gere respostas de atendimento e venda para revisar, copiar e enviar com mais rapidez.",
    businessType: "Loja",
    examples: ["Tem esse produto disponivel?", "Qual o valor?", "Voces entregam?", "Aceita cartao?"],
    safeResponseExample:
      "Oi! Posso verificar para voce. Me diga qual modelo, cor ou tamanho procura para eu confirmar disponibilidade, valor e opcoes de entrega antes de finalizar.",
    benefits: [
      "Responder clientes sem inventar estoque",
      "Organizar perguntas sobre entrega e troca",
      "Manter abordagem comercial sem pressao",
      "Reaproveitar mensagens de produtos frequentes"
    ],
    recommendedTemplates: ["Disponibilidade de produto", "Entrega", "Troca", "Pagamento"],
    faq: [
      {
        question: "Serve para loja fisica e venda pelo Instagram?",
        answer:
          "Sim. A pagina foca em atendimento via WhatsApp, mas a resposta gerada pode ajudar depois que o cliente chega de outros canais."
      },
      ...sharedFaq
    ],
    seo: {
      title: "AtendeZap IA para Lojas - Respostas rapidas para WhatsApp",
      description:
        "Gere respostas com IA para duvidas sobre produto, preco, entrega, troca e pagamento em lojas que atendem pelo WhatsApp."
    }
  },
  restaurantes: {
    slug: "restaurantes",
    route: "/para/restaurantes",
    name: "Restaurantes",
    label: "Para restaurantes",
    headline: "Atendimento mais pratico para restaurantes no WhatsApp",
    subheadline:
      "Crie respostas para cardapio, reserva, delivery, horario e pagamento sem inventar itens ou confirmar reservas automaticamente.",
    mainPain: "Clientes perguntam sobre cardapio, horario, reserva e delivery nos momentos de maior movimento.",
    mainPromise: "Gere respostas curtas e cordiais para revisar e usar no atendimento do restaurante.",
    businessType: "Restaurante",
    examples: ["Tem entrega?", "Qual o cardapio de hoje?", "Precisa reservar?", "Quais formas de pagamento?"],
    safeResponseExample:
      "Oi! Posso te ajudar. Voce quer informacoes sobre cardapio, reserva ou delivery? Se for entrega, me envie seu bairro para eu verificar as opcoes corretamente.",
    benefits: [
      "Reduzir repeticao em horarios corridos",
      "Responder sem inventar cardapio ou tempo de entrega",
      "Orientar reserva com dados necessarios",
      "Manter atendimento cordial e objetivo"
    ],
    recommendedTemplates: ["Cardapio do dia", "Reserva", "Delivery", "Horario de funcionamento"],
    faq: [
      {
        question: "Serve para restaurante, bar, hamburgueria ou comida caseira?",
        answer:
          "Sim. Voce ajusta a resposta ao seu cardapio, horario e regra de reserva ou entrega antes de enviar."
      },
      ...sharedFaq
    ],
    seo: {
      title: "AtendeZap IA para Restaurantes - Respostas para WhatsApp",
      description:
        "Gere respostas com IA para perguntas sobre cardapio, reserva, delivery, horario e pagamento. Copie, ajuste e envie pelo WhatsApp."
    }
  },
  "prestadores-de-servico": {
    slug: "prestadores-de-servico",
    route: "/para/prestadores-de-servico",
    name: "Prestadores de servico",
    label: "Para prestadores de servico",
    headline: "Responda pedidos de orcamento com mais clareza",
    subheadline:
      "Use IA para pedir detalhes, explicar proximos passos e responder sobre disponibilidade, regiao e pagamento.",
    mainPain: "Pedidos de orcamento chegam incompletos e fazem voce gastar tempo perguntando as mesmas coisas.",
    mainPromise: "Gere respostas consultivas para entender o servico antes de falar em valor ou prazo.",
    businessType: "Prestador de servico",
    examples: ["Qual o valor do servico?", "Voces fazem orcamento?", "Atende minha regiao?", "Quais formas de pagamento?"],
    safeResponseExample:
      "Para te passar um orcamento correto, preciso entender melhor o servico. Pode me enviar detalhes, local de atendimento e, se ajudar, uma foto ou medida?",
    benefits: [
      "Pedir informacoes sem parecer seco",
      "Evitar preco ou prazo sem avaliar",
      "Responder com mais profissionalismo",
      "Padronizar o primeiro contato de orcamento"
    ],
    recommendedTemplates: ["Pedido de orcamento", "Regiao atendida", "Detalhes do servico", "Pagamento"],
    faq: [
      {
        question: "Serve para eletricista, encanador, diarista, tecnico ou consultor?",
        answer:
          "Sim. O foco e ajudar qualquer prestador que precisa entender o pedido antes de responder com valor, prazo ou disponibilidade."
      },
      ...sharedFaq
    ],
    seo: {
      title: "AtendeZap IA para Prestadores de Servico - Respostas para WhatsApp",
      description:
        "Gere respostas com IA para pedidos de orcamento, disponibilidade, regiao atendida e pagamento. Copie, ajuste e envie."
    }
  },
  autonomos: {
    slug: "autonomos",
    route: "/para/autonomos",
    name: "Autonomos",
    label: "Para autonomos",
    headline: "Atenda melhor no WhatsApp mesmo trabalhando sozinho",
    subheadline:
      "Crie respostas para servico, preco, disponibilidade e detalhes do atendimento sem montar tudo do zero.",
    mainPain: "Quem trabalha sozinho precisa vender, atender e responder perguntas repetidas ao mesmo tempo.",
    mainPromise: "Gere respostas simples e profissionais para revisar, adaptar e enviar com mais seguranca.",
    businessType: "Autonomo",
    examples: ["Qual o valor do servico?", "Voce atende hoje?", "Como faco para agendar?", "Quais formas de pagamento?"],
    safeResponseExample:
      "Oi! Posso te ajudar sim. Me conta qual servico voce precisa e qual melhor dia ou periodo para atendimento? Assim verifico disponibilidade e te passo a orientacao correta.",
    benefits: [
      "Ganhar tempo no atendimento individual",
      "Responder com mais seguranca",
      "Nao depender de textos improvisados",
      "Manter controle total antes de enviar"
    ],
    recommendedTemplates: ["Primeiro atendimento", "Agendamento", "Valor do servico", "Disponibilidade"],
    faq: [
      {
        question: "Serve para quem nao tem equipe?",
        answer:
          "Sim. O AtendeZap IA foi pensado tambem para quem trabalha sozinho e precisa ganhar tempo sem perder o tom humano."
      },
      ...sharedFaq
    ],
    seo: {
      title: "AtendeZap IA para Autonomos - Respostas para WhatsApp",
      description:
        "Gere respostas com IA para duvidas sobre servico, preco, disponibilidade e atendimento. Copie, ajuste e envie pelo WhatsApp."
    }
  }
};

export const NICHE_SLUGS = Object.keys(NICHES) as NicheSlug[];

export function getNiche(slug: string | null | undefined) {
  if (!slug) return null;
  return NICHES[slug as NicheSlug] ?? null;
}
