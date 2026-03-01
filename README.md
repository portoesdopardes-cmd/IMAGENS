# Portões do PARDeS

Aplicação web full-stack gamificada para estudo judaico/cabalístico com React + Supabase + Gemini.

## Stack

- React 18 + Vite + TypeScript (sem plugin React dedicado)
- Tailwind CSS (tema dark místico com glassmorphism)
- Supabase (Auth + PostgreSQL + RLS)
- Google Gemini API via REST para geração de conteúdo

## Rodar localmente

```bash
npm install
npm run dev
```

Configure `.env` com base em `.env.example`.

## Estrutura principal

- `src/components`: Dashboard, Quiz, Loja, Álbum e Painel Admin
- `src/services/supabaseClient.ts`: cliente Supabase via REST/Auth HTTP
- `src/services/geminiService.ts`: geração de carta/evento via REST com fallback + compressão WebP
- `src/hooks/useDebouncedEffect.ts`: auto-save de progresso com debounce de 2 segundos
- `supabase/migrations/202603010001_init.sql`: schema e políticas RLS

## Fluxos implementados (base)

- Login/cadastro por email/senha via Supabase
- Quiz por portais (acerto = XP/centelhas, erro = perda de coração)
- Loja com compra de itens e baú místico
- Álbum de figurinhas com gacha IA
- Painel admin para gerar evento e carta por IA

## Observações

- Se Gemini falhar (ex.: quota 429), retornos fallback evitam quebra da UX.
- Imagens base64 geradas por IA são comprimidas para WebP via Canvas API.
