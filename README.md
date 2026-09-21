# DigitalOcean Agent Harness Runtime Showcase

A small web app that lists all features of **Agent Harness Runtime** — one of the two
products under DigitalOcean's M.A.R.S. (Managed Agents Runtime Services) — and lets you try
DigitalOcean Serverless Inference (text + image) against the same Model Access Key and
`base_url`, right from the page.

> **Note:** Agent Harness Runtime details here are compiled from internal DigitalOcean launch
> announcements (Private Preview Aug 26, 2026 → Public Preview Sept 22, 2026). Treat this as
> internal reference content, not a public marketing asset, until GA messaging is finalized.

## What's inside

- `features.js` — Agent Harness Runtime overview + all 10 features (multi-framework support,
  Firecracker microVM isolation, sub-second sessions, human approval gates, GitHub
  integration, pause/resume/handoff, checkpoint & fork, port forwarding, webhooks & scheduled
  runs, single `agents.yaml` config)
- `server.js` — Express server: proxies `/api/chat` and `/api/image` to DO Serverless
  Inference (`/v1/chat/completions`, `/v1/images/generations`) and serves `/api/features`
- `public/` — static frontend: feature list + two AI demo panels (chat, image)

## Run locally

```bash
cd do-harness-runtime-showcase
npm install
cp .env.example .env
# edit .env and set MODEL_ACCESS_KEY to your DO Serverless Inference key
npm start
```

Open http://localhost:8080.

## Environment variables

| Variable | Description |
|---|---|
| `MODEL_ACCESS_KEY` | Your DO Serverless Inference Model Access Key |
| `TEXT_MODEL` | Chat model slug, e.g. `llama3.3-70b-instruct` |
| `IMAGE_MODEL` | Image model slug, e.g. `openai-gpt-image-1` |
| `PORT` | Port to listen on (default `8080`) |

## Deploy to App Platform

1. Push this folder to a GitHub repo.
2. Update the `github.repo` field in `.do/app.yaml` to point at that repo.
3. Create the app, then set the real `MODEL_ACCESS_KEY` secret (don't commit it):
   ```bash
   doctl apps create --spec .do/app.yaml
   doctl apps update <app-id> --spec .do/app.yaml
   ```

Both AI panels call the same Serverless Inference endpoint (`https://inference.do-ai.run/v1`)
and the same Model Access Key — only the model slug and API path (`/chat/completions` vs.
`/images/generations`) differ.
