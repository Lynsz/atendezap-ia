# Prontidão da Campanha Pequena Pós-1.1

## Status

* aprovada: não
* aprovada com observações: não
* **bloqueada**

## Motivos

* A preparação documental e o tracking local foram concluídos.
* A estabilidade de Production, o custo OpenAI e o billing real continuam sem evidência preenchida.
* A decisão pós-deploy vigente é repetir validação antes de divulgar.

## Produção

* Smoke autenticado de Production: não disponível.
* Erros 500, disponibilidade e janela real de 72 horas: não medidos.
* CI remoto: não confirmado.

## Segurança

* Auditoria local mantém secrets server-side, RLS, limites mensais, webhook assinado e checkout sem preço do client.
* Eventos `campaign_*` usam allowlist e UTMs categóricas; pergunta, resposta, contato, pagamento, tokens e secrets são removidos.
* RLS real com dois usuários e bundle/deploy final: pendentes.

## Tracking

* Eventos preparados: landing, clique de cadastro, cadastro, onboarding, primeira resposta, cópia, salvamento, pricing, checkout, feedback e suporte.
* Campanha reconhecida apenas com `utm_campaign=post_1_1_small_campaign`.
* Admin mostra visitas agregadas por `utm_source` e `utm_campaign`, além dos agregados existentes do funil.
* Migration necessária: `0032_post_1_1_campaign_events.sql`.
* Falha de persistência do tracking retorna de forma tolerante e não interrompe o fluxo principal.

## Landing

* Copy obrigatória presente: o produto gera respostas para copiar, ajustar e enviar e não envia automaticamente.
* CTA de cadastro, demo, público-alvo e explicação simples presentes.
* Termos, privacidade e suporte têm links visíveis no rodapé.
* Não foi encontrada promessa de resultado financeiro na landing principal.
* Smoke Chromium em viewport móvel de 390 x 844 confirmou conteúdo, CTAs, ausência de overflow, ausência de overlay e navegação para cadastro.

## Ativação

* Fluxos e tracking existem localmente.
* Taxas reais de cadastro, onboarding, primeira resposta, cópia e salvamento: não disponíveis.

## Billing

* Checkout valida plano e resolve Price ID no servidor; webhook valida assinatura e não salva payload completo.
* Checkout, portal, webhook e custo no ambiente final: não comprovados.

## Suporte

* Suporte e feedback possuem rotas, validação e mensagens amigáveis localmente.
* Volume, SLA e recorrência real: não disponíveis.

## Riscos conhecidos

* Variáveis ou migrations divergirem no ambiente real.
* Tracking não persistir se a migration não estiver aplicada.
* Billing ou OpenAI falharem somente em Production.
* Falta de métricas ocultar custo, erros ou demanda de suporte.

## Bloqueadores

* Confirmar GitHub Actions verde.
* Aprovar smoke autenticado de Preview e Production.
* Aplicar migrations e validar RLS com dois usuários.
* Validar OpenAI, checkout, portal e webhook assinado no ambiente final.
* Medir custo OpenAI e concluir 72 horas de observação agregada.

## Smoke test local reduzido

* Playwright: 63 testes E2E aprovados.
* Landing, cadastro, login, demo, suporte, feedback, termos, privacidade e `/api/health`: aprovados localmente.
* Onboarding, dashboard, biblioteca, templates, assinatura e admin: bloqueio sem sessão aprovado.
* APIs de IA, respostas salvas, checkout, portal e admin: bloqueio sem autenticação aprovado.
* Landing da campanha em mobile e tracking UTM: aprovados.
* Fluxo autenticado completo, OpenAI real, salvamento real, checkout/webhook real e usuário comum autenticado contra admin: não validados no navegador por ausência de credenciais/ambiente final; permanecem bloqueadores operacionais.

## Bloqueador corrigido nesta preparação

* Link de suporte ausente no rodapé da landing: corrigido e validado no smoke móvel.
* Eventos `campaign_*` e `utm_content` seguro ausentes: adicionados e cobertos por teste.

## Decisão

* iniciar campanha pequena: não
* corrigir antes de iniciar: concluir validações operacionais; nenhum bug P0/P1 de código confirmado
* **manter operação controlada**

## Status de ativação

* Checklist de ativação criado e revisado.
* Campanha bloqueada e não iniciada.
* Nenhuma mensagem foi enviada, nenhum link foi publicado e nenhum canal foi ativado.

## Canais escolhidos

* Convite manual como primeiro canal, somente após aprovação operacional.
* LinkedIn e Instagram orgânicos em seguida, também condicionados à aprovação.
* Tráfego pago baixo somente após uma primeira revisão sem alerta crítico; não autorizado agora.

## Revisão de execução

* Smoke local reduzido: aprovado pela suíte Playwright; não substitui Preview/Production autenticados.
* Tracking, UTMs, landing, suporte, feedback, admin e limites mensais: revisados localmente.
* OpenAI real, Stripe real, persistência Supabase/RLS e custo: não disponíveis no ambiente final.
* Bloqueadores encontrados: os mesmos bloqueadores operacionais já registrados; nenhum P0/P1 novo confirmado.
* Correções aplicadas nesta etapa: nenhuma, pois nenhum bug P0/P1 foi reproduzido.

## Decisão atual de execução

* **Pausar antes da ativação e manter a campanha bloqueada.**
* Próxima decisão somente depois de resolver os bloqueadores e repetir o smoke autenticado.
