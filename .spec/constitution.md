## CineVerse - Constitution

### Mission

Provide a fast, accessible, and AI-augmented movie discovery web app (CineVerse) that helps users explore films, view details, and ask a context-aware chatbot about content.

### Core Principles

1. User-first: prioritize clarity, accessibility and mobile-first responsive UI.
2. Reproducible: reproducible builds, clear docs, and small focused components.
3. Extensible: clean APIs and modular backend for future RAG/LLM improvements.
4. Performance: fast loading, lazy data fetching, and optimized images.
5. Privacy & Safety: do not store secrets in the repo; use env variables.

### Technical Standards

- TypeScript in frontend and shared types where applicable.
- Tailwind CSS for utility-first styling.
- Component-driven architecture (React + Next.js App Router).
- FastAPI for the chatbot/backend API.

### Design Guidelines

- Mobile-first responsive designs.
- Consistent spacing scale and accessible color contrast.
- Clear primary CTA and simple navigation.

### Development Rules

- Keep features behind environment toggles when necessary.
- Write acceptance criteria in task files under `.spec/tasks/`.
