export type MessageScriptCategory =
  | "boas_vindas"
  | "orcamento"
  | "cliente_indeciso"
  | "promocao"
  | "pos_venda"
  | "recuperacao"
  | "horario"
  | "confirmacao";

export type MessageScript = {
  id: string;
  title: string;
  category: MessageScriptCategory;
  text: string;
};

export const messageScripts: MessageScript[] = [
  {
    id: "welcome-1",
    title: "Boas-vindas profissional",
    category: "boas_vindas",
    text: "Oi! Tudo bem? Obrigado por chamar. Me diga como posso te ajudar hoje que ja te passo as informacoes certinhas."
  },
  {
    id: "quote-1",
    title: "Pedido de detalhes para orcamento",
    category: "orcamento",
    text: "Claro, eu te passo o orcamento. Para calcular certinho, me envie por favor o que voce precisa, quantidade e prazo desejado."
  },
  {
    id: "indecisive-1",
    title: "Cliente indeciso",
    category: "cliente_indeciso",
    text: "Sem problema. Para te ajudar a decidir, posso resumir as opcoes e indicar a alternativa mais adequada para o que voce precisa."
  },
  {
    id: "promo-1",
    title: "Promocao sem pressao",
    category: "promocao",
    text: "Hoje estamos com uma condicao especial para esse atendimento. Se fizer sentido para voce, posso te explicar como funciona e ja deixar reservado."
  },
  {
    id: "post-sale-1",
    title: "Pos-venda",
    category: "pos_venda",
    text: "Oi! Passando para saber se deu tudo certo com seu atendimento/pedido. Se precisar de qualquer ajuste ou tiver alguma duvida, pode me chamar por aqui."
  },
  {
    id: "winback-1",
    title: "Recuperacao de cliente sumido",
    category: "recuperacao",
    text: "Oi! Vi que nossa conversa ficou parada e queria saber se ainda posso te ajudar. Se preferir, eu te mando um resumo rapido das opcoes."
  },
  {
    id: "hours-1",
    title: "Aviso de horario",
    category: "horario",
    text: "Nosso horario de atendimento e de segunda a sexta em horario comercial. Se voce mandar sua duvida, respondemos assim que retornarmos."
  },
  {
    id: "confirm-1",
    title: "Confirmacao de pedido",
    category: "confirmacao",
    text: "Perfeito, pedido confirmado. Vou deixar tudo registrado por aqui e te aviso qualquer atualizacao pelo WhatsApp."
  }
];
