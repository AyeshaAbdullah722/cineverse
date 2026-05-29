# Development Plan - CineVerse

## Phases

1. Setup (Day 1)
   - Initialize project skeleton for frontend and backend
   - Add Spec-Kit docs
   - Basic navigation and layout

2. Core Pages (Day 2)
   - Homepage, Movies listing, Movie detail, About, Contact
   - Responsive design and Tailwind styling

3. Chatbot / RAG (Day 3)
   - FastAPI backend endpoints
   - RAG pipeline placeholder (Qdrant + OpenAI integration notes)
   - Frontend chat widget integration

4. Polish & Deployment (Day 4)
   - Testing, performance tweaks, SEO meta
   - Deploy frontend to Vercel and backend to a server (or use Vercel serverless)

## Feature Checklist

- Next.js App Router + TypeScript
- Tailwind CSS
- 5 pages: Home, Movies, Movie, About, Contact
- Navbar + Footer
- Movie listing using TMDb (or other public movie API)
- Backend FastAPI with `/movies` proxy and `/chat` RAG endpoint
- `.spec/` documentation and tasks
- README with setup & deployment instructions

## Timeline Estimation

- Total: 3-4 days (intensive)

## File Structure (planned)

```
.
├── .spec/
├── app/
├── components/
├── public/
├── backend/
├── package.json
└── README.md
```
