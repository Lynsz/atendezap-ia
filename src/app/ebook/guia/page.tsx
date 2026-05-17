import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/button";

export const metadata = {
  title: "50 respostas prontas para WhatsApp - AtendeZap IA"
};

const sections = [
  {
    title: "Primeiro contato",
    replies: [
      "Oi! Obrigado pelo contato. Me conta rapidinho o que você precisa para eu te orientar da melhor forma.",
      "Olá! Posso te ajudar sim. Você já sabe qual serviço/produto procura ou quer ver as opções?",
      "Oi! Para te passar uma resposta certinha, me diga seu nome e o principal ponto que você precisa resolver."
    ]
  },
  {
    title: "Orçamento",
    replies: [
      "Consigo te passar um orçamento. Para calcular melhor, preciso de algumas informações: tipo de serviço, prazo desejado e detalhes do que você precisa.",
      "O valor depende do escopo. Me envie mais detalhes e, se tiver, uma foto ou referência para eu avaliar com mais precisão.",
      "Vou te explicar as opções e valores disponíveis para você escolher com clareza."
    ]
  },
  {
    title: "Cliente indeciso",
    replies: [
      "Sem problema. Posso te mostrar a opção mais simples para começar e você decide com calma.",
      "Entendo. Quer que eu compare as opções e te diga qual faz mais sentido para o seu caso?",
      "Se preferir, posso te mandar um resumo com benefícios, prazo e forma de pagamento."
    ]
  },
  {
    title: "Cobrança",
    replies: [
      "Oi! Passando para lembrar que o pagamento referente ao serviço ficou pendente. Posso te reenviar os dados por aqui?",
      "Olá! Tudo bem? Vi que ainda não identificamos o pagamento. Você consegue confirmar se já foi feito?",
      "Para mantermos o prazo combinado, preciso da confirmação do pagamento. Posso ajudar com alguma dúvida?"
    ]
  },
  {
    title: "Pós-venda",
    replies: [
      "Oi! Passando para saber se ficou tudo certo com seu atendimento. Qualquer ajuste, me avise por aqui.",
      "Obrigado pela confiança. Se precisar novamente, fico à disposição.",
      "Fico feliz em ajudar. Posso te mandar também algumas orientações para aproveitar melhor o serviço/produto."
    ]
  },
  {
    title: "Delivery",
    replies: [
      "Olá! Pode me enviar seu pedido e endereço completo? Já verifico o prazo de entrega.",
      "Temos entrega hoje sim. Me diga seu bairro para eu confirmar taxa e tempo estimado.",
      "Pedido anotado. Vou confirmar os itens, total e previsão antes de seguir."
    ]
  },
  {
    title: "Estética",
    replies: [
      "Oi! Posso te ajudar com horários e valores. Qual procedimento você tem interesse?",
      "Para indicar o melhor atendimento, me conte seu objetivo e se já fez esse procedimento antes.",
      "Temos opções de agenda. Você prefere manhã, tarde ou fim do dia?"
    ]
  },
  {
    title: "Assistência técnica",
    replies: [
      "Olá! Me diga o modelo do aparelho e o problema apresentado para eu orientar os próximos passos.",
      "Consigo avaliar. Se puder, envie uma foto ou vídeo curto mostrando o defeito.",
      "O diagnóstico depende do estado do equipamento. Posso te explicar como funciona a avaliação."
    ]
  }
];

export default function EbookGuidePage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-700">Guia gratuito</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-ink md:text-5xl">
          50 Respostas Prontas para WhatsApp: como atender clientes mais rápido e perder menos oportunidades
        </h1>
        <p className="mt-5 text-base leading-8 text-slate-600">
          Use as respostas abaixo como ponto de partida. Ajuste nomes, valores, prazos e detalhes antes de enviar para o cliente.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/precos">Conhecer o AtendeZap IA</Button>
          <Button href="/ebook" variant="ghost">Voltar ao ebook</Button>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="grid gap-5">
          {sections.map((section) => (
            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" key={section.title}>
              <h2 className="text-2xl font-black text-ink">{section.title}</h2>
              <div className="mt-5 grid gap-3">
                {section.replies.map((reply) => (
                  <div className="flex gap-3 rounded-md bg-slate-50 p-4" key={reply}>
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <p className="text-sm leading-6 text-slate-700">{reply}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
