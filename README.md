# Wolfre — Real Estate Intelligence

**Wolfre** is a real estate intelligence app that lets retail investors explore premier property markets with real-time data, ask an AI assistant (Wolfre) about buying, investing, financing, and regulations, and stay informed with city-specific news and concise AI-summarized updates. It cuts through market noise to give a simple, clear experience focused on your growth.

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

Create a `.env.local` file with your Supabase URL and anon key, plus any other API keys required by the app (e.g. for news or AI chat).

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

## License

Private.
