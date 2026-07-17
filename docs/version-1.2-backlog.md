# Backlog — Versão 1.2 AtendeZap IA

## P0

* Nenhum P0 confirmado.
* Corrigir imediatamente qualquer falha crítica reproduzida em autenticação, IA, salvamento, billing, admin, RLS ou secrets.

## P1

* Confirmar GitHub Actions remoto verde.
* Rodar smoke autenticado de Preview/Production.
* Aplicar migrations e validar RLS com dois usuários reais.
* Validar OpenAI, Resend, Stripe Checkout, portal e webhook no ambiente final.
* Medir custo OpenAI e funil essencial em janela definida.
* Confirmar admin bloqueando usuário comum autenticado.

## P2

* Melhorias pequenas de produto somente após a Sprint 1 identificar gargalo real.
* Alinhar documentação de schema/migrations depois de confirmar o banco real.
* Melhorar relatórios essenciais sem criar BI avançado.

## Candidatos por área

### Ativação

* Medir e diagnosticar o funil até primeira resposta, cópia e salvamento.

### Onboarding

* Revisar labels, erros e campos mínimos se abandono for comprovado.

### Dashboard

* Revisar checklist, exemplos e CTA principal se primeira resposta estiver baixa.

### IA

* Analisar utilidade, motivos negativos, tamanho e custo; ajustar somente com evidência.

### Templates

* Medir uso por nicho e melhorar somente os itens usados ou problemáticos.

### Biblioteca

* Medir acesso/reutilização e revisar busca, filtros ou favoritos se necessário.

### Pricing

* Validar clareza de plano, uso, limites e oferta Pro; alterar somente com dúvida medida.

### Métricas

* Documentar fontes, períodos, eventos, disponibilidade e usuários únicos.

### Admin

* Validar agregados, custo/uso e proteção sem conteúdo sensível.

### Suporte

* Medir categorias, recorrência e status; atualizar FAQ apenas com temas reais.

### Segurança

* Validar RLS, secrets, logs, eventos, webhook e autoridade server-side.

## Fora do escopo

* integração com WhatsApp
* envio automático
* CRM completo
* app mobile
* automações complexas
* campanha grande
