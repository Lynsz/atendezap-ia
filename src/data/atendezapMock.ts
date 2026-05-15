import type { Conversation } from "@/types/atendezap";

export const atendezapMockConversations: Conversation[] = [
  {
    id: "conv-001",
    status: "open",
    priority: "high",
    intent: "Agendamento de manicure",
    updatedAt: "2026-05-15T10:35:00.000Z",
    customer: {
      id: "cust-001",
      name: "Maria Silva",
      phone: "11 99999-1111",
      avatarInitials: "MS",
      city: "São Paulo, SP",
      tags: ["manicure", "recorrente"]
    },
    messages: [
      {
        id: "msg-001",
        sender: "customer",
        content: "Oi, tudo bem? Você tem horário hoje no fim da tarde para fazer mão e pé?",
        createdAt: "2026-05-15T10:20:00.000Z"
      },
      {
        id: "msg-002",
        sender: "agent",
        content: "Oi, Maria! Tudo bem sim. Vou conferir a agenda e já te falo.",
        createdAt: "2026-05-15T10:22:00.000Z"
      },
      {
        id: "msg-003",
        sender: "customer",
        content: "Perfeito. Se tiver depois das 17h eu consigo ir.",
        createdAt: "2026-05-15T10:35:00.000Z"
      }
    ]
  },
  {
    id: "conv-002",
    status: "waiting",
    priority: "medium",
    intent: "Orçamento de marmitas",
    updatedAt: "2026-05-15T09:48:00.000Z",
    customer: {
      id: "cust-002",
      name: "Rafael Costa",
      phone: "21 98888-2222",
      avatarInitials: "RC",
      city: "Rio de Janeiro, RJ",
      tags: ["marmitaria", "orçamento"]
    },
    messages: [
      {
        id: "msg-004",
        sender: "customer",
        content: "Bom dia! Quanto fica um pacote com 20 marmitas fitness para entregar toda segunda?",
        createdAt: "2026-05-15T09:31:00.000Z"
      },
      {
        id: "msg-005",
        sender: "agent",
        content: "Bom dia, Rafael! Temos opções semanais. Você prefere marmitas de frango, carne, vegetariana ou mistas?",
        createdAt: "2026-05-15T09:40:00.000Z"
      },
      {
        id: "msg-006",
        sender: "customer",
        content: "Pode ser misto. Preciso saber valor e se aceita Pix.",
        createdAt: "2026-05-15T09:48:00.000Z"
      }
    ]
  },
  {
    id: "conv-003",
    status: "open",
    priority: "high",
    intent: "Cliente insatisfeita",
    updatedAt: "2026-05-15T08:58:00.000Z",
    customer: {
      id: "cust-003",
      name: "Juliana Rocha",
      phone: "31 97777-3333",
      avatarInitials: "JR",
      city: "Belo Horizonte, MG",
      tags: ["estética", "suporte"]
    },
    messages: [
      {
        id: "msg-007",
        sender: "customer",
        content: "Fiz o procedimento ontem e fiquei com dúvida sobre a vermelhidão. Isso é normal? Estou preocupada.",
        createdAt: "2026-05-15T08:45:00.000Z"
      },
      {
        id: "msg-008",
        sender: "agent",
        content: "Oi, Juliana. Obrigada por avisar. Você consegue me enviar uma foto e dizer se está coçando ou ardendo?",
        createdAt: "2026-05-15T08:50:00.000Z"
      },
      {
        id: "msg-009",
        sender: "customer",
        content: "Está ardendo um pouco. Vou mandar foto agora.",
        createdAt: "2026-05-15T08:58:00.000Z"
      }
    ]
  },
  {
    id: "conv-004",
    status: "resolved",
    priority: "low",
    intent: "Confirmação de retirada",
    updatedAt: "2026-05-14T17:20:00.000Z",
    customer: {
      id: "cust-004",
      name: "Bruno Martins",
      phone: "41 96666-4444",
      avatarInitials: "BM",
      city: "Curitiba, PR",
      tags: ["loja", "retirada"]
    },
    messages: [
      {
        id: "msg-010",
        sender: "customer",
        content: "Boa tarde. Meu pedido já está disponível para retirada?",
        createdAt: "2026-05-14T16:55:00.000Z"
      },
      {
        id: "msg-011",
        sender: "agent",
        content: "Boa tarde, Bruno! Sim, seu pedido está separado. Pode retirar até 18h30.",
        createdAt: "2026-05-14T17:05:00.000Z"
      },
      {
        id: "msg-012",
        sender: "customer",
        content: "Obrigado, vou passar aí.",
        createdAt: "2026-05-14T17:20:00.000Z"
      }
    ]
  },
  {
    id: "conv-005",
    status: "waiting",
    priority: "medium",
    intent: "Assistência técnica",
    updatedAt: "2026-05-15T11:05:00.000Z",
    customer: {
      id: "cust-005",
      name: "Camila Nunes",
      phone: "51 95555-5555",
      avatarInitials: "CN",
      city: "Porto Alegre, RS",
      tags: ["assistência", "notebook"]
    },
    messages: [
      {
        id: "msg-013",
        sender: "customer",
        content: "Meu notebook não liga depois que caiu energia. Vocês fazem diagnóstico? É urgente porque trabalho nele.",
        createdAt: "2026-05-15T10:52:00.000Z"
      },
      {
        id: "msg-014",
        sender: "agent",
        content: "Oi, Camila. Fazemos sim. Você pode trazer hoje? O diagnóstico inicial costuma sair no mesmo dia.",
        createdAt: "2026-05-15T10:59:00.000Z"
      },
      {
        id: "msg-015",
        sender: "customer",
        content: "Posso levar às 14h. Qual o endereço e forma de pagamento?",
        createdAt: "2026-05-15T11:05:00.000Z"
      }
    ]
  }
];
