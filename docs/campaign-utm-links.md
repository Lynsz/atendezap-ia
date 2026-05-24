# Links UTM para Campanha - AtendeZap IA

Use `SEU-DOMINIO` como placeholder. Nao coloque dominio real, chaves ou parametros sensiveis em documentacao versionada.

## Landing

```text
https://SEU-DOMINIO.com/?utm_source=meta&utm_medium=paid&utm_campaign=validacao_inicial&utm_content=criativo_1&utm_term=whatsapp_ia
```

## Ebook

```text
https://SEU-DOMINIO.com/ebook?utm_source=meta&utm_medium=paid&utm_campaign=validacao_inicial&utm_content=criativo_ebook&utm_term=atendimento_whatsapp
```

## Demo

```text
https://SEU-DOMINIO.com/demo?utm_source=meta&utm_medium=paid&utm_campaign=validacao_inicial&utm_content=criativo_demo&utm_term=resposta_ia
```

## Pagina de campanha

```text
https://SEU-DOMINIO.com/atendimento-whatsapp-ia?utm_source=meta&utm_medium=paid&utm_campaign=validacao_inicial&utm_content=criativo_campanha&utm_term=whatsapp_business
```

## Padrao recomendado

- `utm_source`: canal ou plataforma, como `meta`, `instagram`, `facebook`, `organico`.
- `utm_medium`: tipo de trafego, como `paid`, `organic`, `referral`.
- `utm_campaign`: nome da campanha, como `validacao_inicial`.
- `utm_content`: criativo, variacao ou anuncio, como `criativo_1`.
- `utm_term`: termo ou publico, como `whatsapp_ia`.

## Como conferir

1. Abrir o link em aba anonima.
2. Navegar para `/ebook`, `/demo`, `/precos` ou `/cadastro`.
3. Confirmar que o app continua funcionando.
4. Enviar um lead de teste controlado.
5. Conferir no admin se `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term` foram preservadas.
6. Iniciar checkout com usuario autenticado e confirmar se as UTMs chegam na metadata Stripe/Supabase.

## Segunda campanha

Para a segunda rodada, use tambem `docs/second-campaign-utm-links.md`. Nessa etapa, `utm_content` identifica a variacao de rota/criativo e deve ser usado para comparar demo, ebook, landing e Pro R$ 29.
