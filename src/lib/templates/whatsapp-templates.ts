import { businessTypeOptions, getBusinessTemplate, type BusinessTypeOption } from "@/lib/ai/business-templates";
import { savedResponseCategories, type SavedResponseCategory } from "@/lib/saved-responses";

export type WhatsAppTemplateCategory = SavedResponseCategory;

export type WhatsAppTemplateNiche =
  | "delivery"
  | "estetica"
  | "restaurante"
  | "loja"
  | "assistencia_tecnica"
  | "prestador_servico"
  | "autonomo"
  | "geral";

export type WhatsAppTemplate = {
  id: string;
  niche: WhatsAppTemplateNiche;
  businessType: BusinessTypeOption;
  category: WhatsAppTemplateCategory;
  title: string;
  content: string;
  description?: string;
};

type TemplateSeed = Omit<WhatsAppTemplate, "id" | "niche" | "businessType">;

const templatesByBusinessType: Record<BusinessTypeOption, TemplateSeed[]> = {
  Delivery: [
    {
      category: "Entrega",
      title: "Informar taxa de entrega",
      description: "Para responder quando o cliente pergunta sobre entrega por bairro.",
      content: "Claro! Para [bairro], a taxa de entrega e [valor]. Se quiser, me envie seu endereco completo que eu confirmo direitinho antes de fechar o pedido."
    },
    {
      category: "Entrega",
      title: "Informar tempo estimado",
      content: "O tempo estimado de entrega costuma ser de [tempo estimado], mas pode variar conforme o movimento e a distancia. Posso confirmar para o seu endereco antes de finalizar."
    },
    {
      category: "Pagamento",
      title: "Formas de pagamento",
      content: "Aceitamos [formas de pagamento]. Se for pagamento na entrega, me avise se precisa de troco e para qual valor."
    },
    {
      category: "Confirmacao",
      title: "Confirmacao de pedido",
      content: "Perfeito, vou confirmar seu pedido: [itens do pedido], para [endereco], pagamento em [forma de pagamento]. Esta tudo certo para eu enviar para preparo?"
    },
    {
      category: "Horario",
      title: "Pedido fora do horario",
      content: "No momento estamos fora do horario de atendimento. Nosso funcionamento e [horario]. Se quiser, ja pode deixar seu pedido aqui que retornamos assim que abrirmos."
    }
  ],
  Estetica: [
    {
      category: "Preco",
      title: "Informar valores sem inventar",
      content: "Tenho algumas opcoes para [servico]. Para te passar o valor correto, preciso entender [detalhe necessario]. Pode me enviar essa informacao?"
    },
    {
      category: "Agendamento",
      title: "Agendamento",
      content: "Posso verificar a agenda para [servico]. Voce prefere qual dia ou periodo: [manha/tarde/noite]? Assim confirmo os horarios disponiveis."
    },
    {
      category: "Pagamento",
      title: "Formas de pagamento",
      content: "Aceitamos [formas de pagamento]. Se o procedimento exigir sinal ou reserva de horario, eu te aviso antes de confirmar o agendamento."
    },
    {
      category: "Informacoes gerais",
      title: "Enviar endereco",
      content: "Nosso atendimento fica em [endereco]. Se precisar, posso te mandar um ponto de referencia ou link de localizacao."
    },
    {
      category: "Confirmacao",
      title: "Confirmacao de horario",
      content: "Posso deixar separado para conferir: [servico] no dia [data], as [horario]. Antes de fechar, vou verificar a agenda e te confirmo."
    }
  ],
  "Assistencia tecnica": [
    {
      category: "Orcamento",
      title: "Avaliacao e orcamento",
      content: "Para fazer um orcamento mais correto, preciso avaliar o problema em [equipamento/modelo]. Pode me informar o modelo e o que aconteceu?"
    },
    {
      category: "Informacoes gerais",
      title: "Prazo de conserto sem prometer",
      content: "O prazo depende da avaliacao e da disponibilidade de pecas. Assim que analisarmos o equipamento, passamos uma previsao mais segura antes de iniciar o conserto."
    },
    {
      category: "Pos-venda",
      title: "Garantia",
      content: "Quando houver garantia, as condicoes sao [condicoes da garantia] pelo periodo de [periodo], conforme o servico realizado. Se notar qualquer problema relacionado, nos chame por aqui para avaliarmos."
    },
    {
      category: "Informacoes gerais",
      title: "Modelos atendidos",
      content: "Atendemos [modelos/marcas]. Para confirmar se conseguimos ajudar no seu caso, me envie o modelo completo e uma foto do problema, se possivel."
    },
    {
      category: "Entrega",
      title: "Endereco ou retirada",
      content: "Voce pode trazer em [endereco] ou combinar retirada em [bairro/regiao], se esse servico estiver disponivel. Me envie sua localizacao para eu confirmar."
    }
  ],
  Loja: [
    {
      category: "Informacoes gerais",
      title: "Disponibilidade de produto",
      content: "Vou verificar a disponibilidade de [produto] para voce. Se puder, me envie cor, tamanho ou modelo desejado para eu confirmar certinho."
    },
    {
      category: "Pagamento",
      title: "Formas de pagamento",
      content: "Trabalhamos com [formas de pagamento]. Se quiser parcelar, me diga o valor ou produto escolhido para eu confirmar as condicoes."
    },
    {
      category: "Entrega",
      title: "Entrega",
      content: "Fazemos entrega para [regiao/bairros]. Para confirmar taxa e prazo estimado, me envie seu bairro ou endereco completo."
    },
    {
      category: "Informacoes gerais",
      title: "Troca e devolucao",
      content: "A politica de troca funciona assim: [politica de troca]. Se o produto estiver sem uso e dentro do prazo, me envie os dados da compra para avaliarmos."
    },
    {
      category: "Horario",
      title: "Atendimento fora do horario",
      content: "Agora estamos fora do horario de atendimento. Funcionamos em [horario]. Assim que retornarmos, verificamos sua mensagem e te respondemos."
    }
  ],
  Restaurante: [
    {
      category: "Informacoes gerais",
      title: "Enviar cardapio",
      content: "Claro! Nosso cardapio esta aqui: [link ou resumo do cardapio]. Se quiser, me diga o que procura que eu te ajudo a escolher."
    },
    {
      category: "Agendamento",
      title: "Reserva",
      content: "Posso verificar reserva para [data] as [horario]. Quantas pessoas seriam? Assim confirmo a disponibilidade antes de reservar."
    },
    {
      category: "Entrega",
      title: "Delivery",
      content: "Fazemos delivery para [regiao]. Me envie seu endereco ou bairro para eu confirmar taxa, tempo estimado e disponibilidade."
    },
    {
      category: "Entrega",
      title: "Tempo estimado",
      content: "O tempo estimado costuma ser [tempo estimado], mas pode variar conforme o movimento. Posso confirmar melhor quando o pedido for fechado."
    },
    {
      category: "Pagamento",
      title: "Formas de pagamento",
      content: "Aceitamos [formas de pagamento]. Se for pagamento na entrega, me avise se precisa de troco."
    }
  ],
  "Prestador de servico": [
    {
      category: "Orcamento",
      title: "Orcamento",
      content: "Consigo te passar um orcamento, sim. Para calcular corretamente, preciso saber [detalhes do servico], local de atendimento e prazo desejado."
    },
    {
      category: "Agendamento",
      title: "Agenda",
      content: "Vou verificar a agenda para [servico]. Voce prefere qual dia ou periodo? Ainda preciso confirmar disponibilidade antes de fechar."
    },
    {
      category: "Informacoes gerais",
      title: "Local de atendimento",
      content: "Atendo em [local/regiao] e tambem posso avaliar atendimento em [bairro/cidade], dependendo do servico. Me envie sua localizacao para confirmar."
    },
    {
      category: "Pagamento",
      title: "Formas de pagamento",
      content: "Aceito [formas de pagamento]. Se houver sinal, material ou taxa de deslocamento, explico tudo antes de confirmar o servico."
    },
    {
      category: "Informacoes gerais",
      title: "Solicitar detalhes",
      content: "Para te orientar melhor, pode me enviar mais detalhes sobre o que precisa? Se tiver fotos, medidas ou endereco aproximado, ja ajuda bastante."
    }
  ],
  Autonomo: [
    {
      category: "Informacoes gerais",
      title: "Apresentacao do servico",
      content: "Oi! Eu trabalho com [servico] e posso te ajudar com [beneficio principal]. Me conta um pouco do que voce precisa para eu te orientar melhor?"
    },
    {
      category: "Orcamento",
      title: "Orcamento",
      content: "Posso fazer um orcamento para [servico]. Para passar um valor correto, preciso de [detalhes necessarios]. Pode me enviar?"
    },
    {
      category: "Agendamento",
      title: "Disponibilidade",
      content: "Tenho alguns horarios para avaliar, mas preciso confirmar a agenda. Voce prefere atendimento em [dia/periodo]?"
    },
    {
      category: "Pagamento",
      title: "Formas de pagamento",
      content: "Trabalho com [formas de pagamento]. Antes de confirmar, explico valor, condicoes e qualquer detalhe importante do servico."
    },
    {
      category: "Informacoes gerais",
      title: "Pedido de detalhes",
      content: "Para eu te responder com mais precisao, me envie [informacao necessaria]. Assim evito te passar valor ou prazo errado."
    }
  ],
  Outro: [
    {
      category: "Informacoes gerais",
      title: "Resposta generica de atendimento",
      content: "Oi! Obrigado pelo contato. Me diga como posso ajudar e, se possivel, envie os detalhes principais para eu te orientar melhor."
    },
    {
      category: "Informacoes gerais",
      title: "Pedir mais informacoes",
      content: "Para te responder corretamente, preciso de mais algumas informacoes: [informacoes necessarias]. Pode me enviar por aqui?"
    },
    {
      category: "Pagamento",
      title: "Formas de pagamento",
      content: "As formas de pagamento disponiveis sao [formas de pagamento]. Se houver alguma condicao especifica, confirmo antes de fechar."
    },
    {
      category: "Horario",
      title: "Horario de atendimento",
      content: "Nosso horario de atendimento e [horario]. Se voce enviar sua duvida agora, retornamos assim que estivermos disponiveis."
    },
    {
      category: "Confirmacao",
      title: "Retorno em breve",
      content: "Recebi sua mensagem e vou verificar as informacoes para te responder com seguranca. Retorno assim que tiver a confirmacao."
    }
  ]
};

const templateNicheByBusinessType: Record<BusinessTypeOption, WhatsAppTemplateNiche> = {
  Delivery: "delivery",
  Estetica: "estetica",
  Restaurante: "restaurante",
  Loja: "loja",
  "Assistencia tecnica": "assistencia_tecnica",
  "Prestador de servico": "prestador_servico",
  Autonomo: "autonomo",
  Outro: "geral"
};

export const whatsappTemplates: WhatsAppTemplate[] = businessTypeOptions.flatMap((businessType) =>
  templatesByBusinessType[businessType].map((template, index) => ({
    id: `${templateNicheByBusinessType[businessType].replace(/_/g, "-")}-${index + 1}`,
    niche: templateNicheByBusinessType[businessType],
    businessType,
    ...template
  }))
);

export const whatsappTemplateCategories = savedResponseCategories.filter((category) =>
  whatsappTemplates.some((template) => template.category === category)
);

export function filterWhatsAppTemplates(options: { businessType?: string; category?: string; search?: string }) {
  const search = options.search?.trim().toLowerCase();
  return whatsappTemplates.filter((template) => {
    if (options.businessType && options.businessType !== "Todos" && template.businessType !== getBusinessTemplate(options.businessType).type) return false;
    if (options.category && options.category !== "Todas" && template.category !== options.category) return false;
    if (!search) return true;
    return [template.title, template.description, template.content, template.category, template.businessType, template.niche]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search));
  });
}

export function getRecommendedWhatsAppTemplates(businessType?: string | null, limit = 4) {
  const normalizedBusinessType = getBusinessTemplate(businessType || "Outro").type;
  const matches = whatsappTemplates.filter((template) => template.businessType === normalizedBusinessType);
  return (matches.length ? matches : whatsappTemplates.filter((template) => template.businessType === "Outro")).slice(0, limit);
}
