# Links UTM da Campanha Otimizada

Use estes modelos com o dominio real. Nao coloque parametros com nomes de clientes, emails, telefones, perguntas ou respostas.

## Parametros padrao

- `utm_source=meta`
- `utm_medium=paid`
- `utm_campaign=campanha_otimizada_01`
- `utm_content`: identifica nicho e criativo
- `utm_term`: opcional, usar apenas termo generico

## Delivery

Pagina por nicho:

```text
https://SEU-DOMINIO/para/delivery?utm_source=meta&utm_medium=paid&utm_campaign=campanha_otimizada_01&utm_content=delivery_criativo_1&utm_term=whatsapp_delivery
```

Demo:

```text
https://SEU-DOMINIO/demo?utm_source=meta&utm_medium=paid&utm_campaign=campanha_otimizada_01&utm_content=delivery_demo_1&utm_term=whatsapp_delivery
```

Planos:

```text
https://SEU-DOMINIO/precos?utm_source=meta&utm_medium=paid&utm_campaign=campanha_otimizada_01&utm_content=delivery_planos_1&utm_term=whatsapp_delivery
```

## Estetica

Pagina por nicho:

```text
https://SEU-DOMINIO/para/estetica?utm_source=meta&utm_medium=paid&utm_campaign=campanha_otimizada_01&utm_content=estetica_criativo_1&utm_term=whatsapp_estetica
```

Demo:

```text
https://SEU-DOMINIO/demo?utm_source=meta&utm_medium=paid&utm_campaign=campanha_otimizada_01&utm_content=estetica_demo_1&utm_term=whatsapp_estetica
```

## Validacao antes de ligar

- [ ] abrir cada link em aba anonima
- [ ] conferir se a pagina carrega em mobile
- [ ] conferir `localStorage.atendezap_ia_utm_attribution_v1`
- [ ] clicar no CTA principal
- [ ] confirmar evento `optimized_campaign_cta_click`
- [ ] confirmar que nenhum payload contem conteudo sensivel
