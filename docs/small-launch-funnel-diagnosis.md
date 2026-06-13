# Diagnostico do Funil - Lancamento Pequeno AtendeZap IA

## Convite -> Landing

- mensagem de convite: clara e alinhada ao escopo manual
- clareza da proposta: boa, explica que a IA cria sugestoes de resposta
- confianca: precisa de validacao com usuarios reais
- CTA: depende do link final e do destino configurado

## Landing -> Cadastro

- headline: clara para geracao de respostas com IA
- explicacao do produto: reforca copiar, ajustar e enviar manualmente
- aviso de que nao envia WhatsApp automaticamente: presente
- CTA: existem caminhos para cadastro, demo e planos
- mobile: precisa de smoke visual real antes de chamar usuarios

## Cadastro -> Onboarding

- redirecionamento: precisa ser validado com Supabase real
- campos: suficientes para personalizar respostas
- friccao: linguagem de onboarding tinha termo de automacao como objetivo; foi ajustada para nao sugerir automacao
- erro de autenticacao: nao confirmado, mas depende de Supabase/Auth real

## Onboarding -> Dashboard

- clareza do proximo passo: documentada como ponto sensivel
- carregamento do perfil: depende de Supabase/RLS real
- exemplos iniciais: ja existem por nicho e devem ser validados na rodada

## Dashboard -> Primeira resposta

- campo de mensagem: existe no fluxo autenticado
- exemplos rapidos: existem e usam tipo de negocio
- botao de gerar resposta: ja revisado como CTA direto
- loading: precisa de validacao real
- erro da IA: mensagens devem continuar amigaveis e sem stack trace

## Primeira resposta -> Copiar/Salvar

- qualidade da resposta: sem feedback real suficiente
- clareza dos botoes: coberta por testes e fluxo existente
- feedback visual: deve ser observado na rodada
- valor percebido: sem dados suficientes

## Biblioteca/Templates

- facilidade de reutilizacao: biblioteca, filtros, favoritos e templates existem
- filtros: implementados
- favoritos: implementados
- templates por nicho: implementados para nichos principais, sem expandir biblioteca agora

## Uso -> Assinatura

- CTA para planos: existe
- clareza de limite mensal: documentada
- Pro R$ 29: presente
- confianca no checkout: depende de Stripe teste real, portal e webhook

## Suporte/Feedback

- duvidas recorrentes: sem amostra real
- bugs repetidos: nenhum confirmado
- feedbacks negativos: sem amostra real
- sugestoes: sem amostra real

## Gargalo principal

Dados reais ausentes entre convite, cadastro, onboarding, primeira resposta, copia/salvamento e checkout.

## Acao prioritaria

Rodar smoke real e preencher o relatorio diario antes de convidar nova leva de usuarios. Se o smoke passar, chamar poucos usuarios e medir ativacao ate a primeira resposta copiada ou salva.
