# Seguranca de Variaveis de Ambiente

## Arquivos locais

- `.env.local` deve ficar apenas na maquina local
- `.env.example` pode ir para o GitHub sem valores reais

## Vercel

- secrets devem ser configurados no painel da Vercel
- separar Production, Preview e Development

## GitHub

- nao usar secrets reais na action de validacao
- nao commitar arquivos `.env`

## Se uma chave vazar

- revogar imediatamente
- gerar nova chave
- atualizar Vercel
- atualizar `.env.local`
- revisar historico Git
