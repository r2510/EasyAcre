# EasyAcre — Real Estate Intelligence

**EasyAcre** is a real estate intelligence app that lets retail investors explore premier property markets with real-time data, ask an AI assistant (EasyAcre) about buying, investing, financing, and regulations, and stay informed with city-specific news and concise AI-summarized updates. It cuts through market noise to give a simple, clear experience focused on your growth.

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS, Radix UI
- **Data:** Supabase
- **Maps:** React Leaflet
- **Package manager:** pnpm

## Getting started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Install

```bash
pnpm install
```

### Environment

Create a `.env.local` file in the project root with the following variables. Never commit this file (it is in `.gitignore`).

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL (e.g. `https://xxx.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous (public) key for client access. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (for chat) | Supabase service role key; used to log chat queries. Omit to run without persisting chat. |
| `GROQ_API_KEY` | Yes (or OpenRouter) | Groq API key for AI chat and news summaries. |
| `GROQ_MODEL` | No | Primary Groq model (default: `meta-llama/llama-4-scout-17b-16e-instruct`). |
| `GROQ_FALLBACK_MODELS` | No | Comma-separated fallback Groq models. |
| `OPENROUTER_API_KEY` | No | OpenRouter API key as fallback when Groq is unavailable. |
| `OPENROUTER_MODEL` | No | Primary OpenRouter model. |
| `OPENROUTER_FALLBACK_MODELS` | No | Comma-separated fallback OpenRouter models. |
| `TAVILY_API_KEY` | Yes (for news) | Tavily API key for city-specific news search. Omit to disable news. |
| `NEXT_PUBLIC_SITE_URL` | No | Public site URL (e.g. `https://yourdomain.com`). Used for OpenRouter referrer; defaults to `http://localhost:3000` in dev. Set this in production. |

For production (e.g. Vercel), set these in the project’s **Environment variables**; do not upload `.env.local`.

### Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

### Tests

```bash
pnpm test
```

## Production

- Set all required env vars in your host (e.g. Vercel → Settings → Environment variables).
- Set `NEXT_PUBLIC_SITE_URL` to your live URL.
- **Landing video:** The landing page uses `/easyacre-bg.mp4`. Place `easyacre-bg.mp4` in the `public/` folder so it is served at the root. If the file is missing, the landing hero may show a broken video (browsers handle missing `<video src>` differently).

## License

Private.
