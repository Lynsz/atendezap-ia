import type { Conversation, Message, Priority } from "@/types/atendezap";

function getLastCustomerMessage(conversation: Conversation) {
  return [...conversation.messages].reverse().find((message) => message.sender === "customer");
}

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function calculateConversationUrgency(conversation: Conversation): Priority {
  const lastCustomerMessage = getLastCustomerMessage(conversation);
  const content = normalizeText(lastCustomerMessage?.content || "");
  const urgentWords = ["urgente", "preocupada", "preocupado", "problema", "nao liga", "ardendo", "reclamacao", "cancelar"];

  if (conversation.status === "open" && urgentWords.some((word) => content.includes(word))) return "high";
  if (conversation.status === "waiting") return "medium";
  if (conversation.priority === "high") return "high";
  return conversation.priority;
}

export function generateConversationSummary(conversation: Conversation) {
  const lastCustomerMessage = getLastCustomerMessage(conversation);
  const totalMessages = conversation.messages.length;
  const urgency = calculateConversationUrgency(conversation);

  return {
    title: conversation.intent,
    summary: `${conversation.customer.name} entrou em contato sobre ${conversation.intent.toLowerCase()}. A conversa tem ${totalMessages} mensagens e a última mensagem do cliente foi: "${lastCustomerMessage?.content || "sem mensagem do cliente"}"`,
    urgency,
    nextStep:
      urgency === "high"
        ? "Responder com prioridade, acolher a dúvida e pedir as informações necessárias para resolver."
        : "Responder de forma objetiva, confirmar dados e conduzir para o próximo passo."
  };
}

export function generateSuggestedReply(conversation: Conversation) {
  const lastCustomerMessage = getLastCustomerMessage(conversation);
  const content = normalizeText(lastCustomerMessage?.content || "");
  const customerName = conversation.customer.name.split(" ")[0];

  if (content.includes("horario") || content.includes("agenda")) {
    return `Oi, ${customerName}! Tenho como verificar sim. Para te encaixar melhor, me confirme por favor o melhor horário e o serviço desejado. Se preferir, já posso te passar as opções disponíveis hoje.`;
  }

  if (content.includes("valor") || content.includes("quanto") || content.includes("preco")) {
    return `Oi, ${customerName}! Claro. Para te passar o valor correto, preciso confirmar alguns detalhes do pedido/serviço. Você pode me dizer exatamente o que deseja e a quantidade? Aceitamos Pix e posso te orientar com o próximo passo.`;
  }

  if (content.includes("urgente") || content.includes("nao liga") || content.includes("problema")) {
    return `Oi, ${customerName}. Entendi a urgência e vou te ajudar. Para agilizar, me envie o modelo/equipamento, o que aconteceu antes do problema e o melhor horário para atendimento. Assim já direcionamos da forma mais rápida possível.`;
  }

  if (content.includes("preocupada") || content.includes("ardendo") || content.includes("vermelhidao")) {
    return `Oi, ${customerName}. Obrigado por avisar. Vamos avaliar com cuidado. Me envie uma foto, diga há quanto tempo começou e se há dor, coceira ou ardência intensa. Se os sintomas piorarem, procure atendimento profissional de saúde.`;
  }

  if (content.includes("endereco") || content.includes("pagamento")) {
    return `Perfeito, ${customerName}. Vou te enviar o endereço e as formas de pagamento. Também já deixo registrado seu horário para facilitar o atendimento quando você chegar.`;
  }

  return `Oi, ${customerName}! Obrigado pela mensagem. Vou te ajudar com isso. Para seguir, me confirme por favor os detalhes principais do que você precisa e o melhor horário para atendimento.`;
}

export function createAgentMessage(content: string): Message {
  return {
    id: `msg-${Date.now()}`,
    sender: "agent",
    content,
    createdAt: new Date().toISOString()
  };
}
