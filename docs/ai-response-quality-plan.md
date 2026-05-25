# Plano de Qualidade das Respostas com IA

## Como avaliar qualidade

- Resposta clara.
- Resposta curta.
- Resposta natural para WhatsApp.
- Respeita tom escolhido.
- Usa contexto do atendimento.
- Nao inventa preco.
- Nao inventa prazo.
- Nao confirma agendamento sem dados.
- Pede informacao quando necessario.

## Feedbacks uteis

- Resposta muito longa.
- Resposta generica.
- Resposta informal demais.
- Resposta formal demais.
- Resposta inventou informacao.
- Resposta nao ajudou.

## Implementado na etapa pos-1.0

- Templates por nicho centralizados em `src/lib/ai/business-templates.ts`.
- Prompt interno atualizado para incluir template do nicho, tipo de atuacao, tom, produtos/servicos, perguntas comuns e informacoes importantes.
- Regras explicitas para nao inventar preco, prazo, disponibilidade, estoque, garantia, endereco, link ou forma de pagamento.
- Regras explicitas para nao confirmar agenda, reserva, entrega ou atendimento sem dados suficientes.
- Exemplos do dashboard e da demo publica mudam conforme o tipo de atuacao.
- Avaliacao simples da resposta com "Sim", "Nao" e comentario opcional.
- Feedback salvo em `ai_response_feedback` com RLS para o proprio usuario.
- Admin exibe visao agregada de qualidade: uteis, nao uteis, taxa util e comentarios recentes.

## Nichos cobertos

- Autonomo.
- Prestador de servico.
- Loja.
- Delivery.
- Estetica.
- Restaurante.
- Assistencia tecnica.
- Outro.

Ver detalhes em [ai-business-templates.md](./ai-business-templates.md).

## Melhorias futuras

- Templates avancados por subnicho.
- Exemplos por tipo de pergunta.
- Ajuste fino de prompt com base em feedback real.
- Respostas favoritas.
- Biblioteca de respostas.
- Avaliacao com estrelas.
- Sugestoes automaticas de melhoria.

## Rotina de revisao

- Revisar feedbacks de qualidade semanalmente.
- Separar problemas de prompt de problemas de onboarding incompleto.
- Nao alterar prompt por um unico caso isolado sem avaliar impacto geral.
- Validar qualquer ajuste com perguntas reais de diferentes nichos antes de publicar.
