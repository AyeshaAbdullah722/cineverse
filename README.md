# CineVerse

CineVerse is a movie discovery web app scaffold with a Next.js + TypeScript frontend and a FastAPI backend for movie search, genre discovery, and chat-driven recommendations.

## Features

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Movies list and detail pages (TMDb)
- FastAPI backend with `/chat`, `/movies/search`, and `/movies/discover`
- Spec-Kit documentation under `.spec/`

## Quick setup

1. Copy `.env.example` to `.env.local` and fill keys.

Frontend (Next.js) — located in `frontend/`

```bash
# from project root
cd frontend
npm install
npm run dev
```

Backend (Python)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # on Windows
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Notes

- The frontend movie and genre pages now call backend proxy routes. The proxies forward to `BACKEND_URL` and include an IPv4 fallback to avoid localhost `::1` issues on Windows.
- The `/chat` endpoint now has three behaviors: it answers from Sanity docs when available, it uses Groq when `LLM_PROVIDER=groq`, and it falls back to TMDb recommendations when no docs or model keys are available.

## Required environment variables (copy these to Vercel or your `.env`)

Backend (keep secrets server-side):

```
TMDB_API_KEY=your_tmdb_key_here
OPENAI_API_KEY=sk-...
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_read_token  # optional if public
NEON_DATABASE_URL=postgres://user:pass@host:port/db  # optional
QDRANT_URL=https://...  # optional
QDRANT_API_KEY=...
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
# Optional: Choose LLM provider for RAG. Set to 'openai' or 'groq'
LLM_PROVIDER=groq
# Groq is OpenAI-compatible; these are the recommended defaults:
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-70b-versatile
OPENAI_MODEL=gpt-4o-mini
```

Frontend (public keys only, set in the frontend Vercel project):

```
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key_here
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url  # optional if used client-side
```

## Vercel deployment notes

1. Create a Vercel project and connect your GitHub repo.
2. In Project Settings → Environment Variables add the backend secrets to the backend project and `NEXT_PUBLIC_*` keys to the frontend project.
3. If deploying backend as a separate Vercel project, set `BACKEND_URL` in the frontend project to the deployed backend URL.
4. Ensure `ALLOWED_ORIGINS` on the backend includes your frontend production URL (e.g., `https://your-project.vercel.app`).

Example: Production env entries in Vercel

- For frontend project: set `NEXT_PUBLIC_TMDB_API_KEY` (Preview & Production)
- For backend project: set `GROQ_API_KEY`, `GROQ_API_URL`, `GROQ_MODEL`, `SANITY_API_TOKEN`, `TMDB_API_KEY`, `ALLOWED_ORIGINS` (only Production)

## Spec files

See `.spec/constitution.md`, `.spec/plan.md`, and `.spec/tasks/` for project documentation and tasks.
