from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import httpx
from dotenv import load_dotenv

# Load environment variables from repository .env (one level up from backend/)
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
env_path = os.path.join(repo_root, '.env')
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="CineVerse Chat Backend")

TMDB_KEY = os.getenv('TMDB_API_KEY')

# Configure CORS using ALLOWED_ORIGINS environment variable
allowed_origins_raw = os.getenv('ALLOWED_ORIGINS', '')
ALLOWED_ORIGINS = [o.strip() for o in allowed_origins_raw.split(',') if o.strip()]

if ALLOWED_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


class ChatRequest(BaseModel):
    query: str


def build_fallback_recommendation_message(items: list[dict], query: str) -> str:
    if not items:
        return (
            "I couldn't find a strong match, but a safe pick is to start with a popular movie like "
            "The Batman, Batman Begins, or The Lego Batman Movie."
        )

    lines = [f"Based on '{query}', here are a few good picks:"]
    for item in items[:6]:
        title = item.get('title', 'Untitled')
        year = (item.get('release_date') or '')[:4]
        rating = item.get('vote_average')
        suffix = f" ({year})" if year else ''
        rating_text = f" - rating {rating:.1f}" if isinstance(rating, (int, float)) else ''
        lines.append(f"- {title}{suffix}{rating_text}")
    lines.append("Try one of these, or tell me if you want action, comedy, horror, or romance.")
    return "\n".join(lines)


async def fetch_tmdb_recommendations(query: str) -> list[dict]:
    if not TMDB_KEY:
        return []

    normalized = query.lower()
    genre_map = {
        28: ["action", "adventure", "fight", "exciting", "fast"],
        35: ["comedy", "funny", "laugh", "light"],
        27: ["horror", "scary", "creepy", "terror"],
        18: ["drama", "sad", "serious", "emotional"],
        10749: ["romance", "love", "date", "relationship"],
        878: ["sci-fi", "sci fi", "science fiction", "space", "future"],
        53: ["thriller", "suspense", "mystery", "tense"],
        12: ["adventure", "journey", "quest", "explore"],
        16: ["animated", "animation", "cartoon", "anime"],
    }

    chosen_genre = None
    for genre_id, keywords in genre_map.items():
        if any(keyword in normalized for keyword in keywords):
            chosen_genre = genre_id
            break

    async with httpx.AsyncClient() as client:
        if chosen_genre is not None:
            url = (
                f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_KEY}"
                f"&with_genres={chosen_genre}&language=en-US&page=1"
            )
            resp = await client.get(url)
            resp.raise_for_status()
            return resp.json().get('results', [])

        # broad fallback for vague requests like "I don't know what to watch"
        url = f"https://api.themoviedb.org/3/movie/popular?api_key={TMDB_KEY}&language=en-US&page=1"
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.json().get('results', [])


@app.post("/chat")
async def chat(req: ChatRequest):
    # Implement a GROQ-only RAG flow:
    # 1) Query Sanity via GROQ for relevant documents/snippets
    # 2) Compose those documents into a context
    # 3) Call OpenAI Chat Completions with context and user query
    # Note: This approach uses Sanity for retrieval (no vector DB). For larger corpora consider adding a vector index.

    OPENAI_KEY = os.getenv('OPENAI_API_KEY')
    llm_provider = os.getenv('LLM_PROVIDER', 'openai').lower()
    project = os.getenv('SANITY_PROJECT_ID')
    if not project:
        # No CMS available. Return a movie recommendation instead of a dead-end.
        recommendations = await fetch_tmdb_recommendations(req.query)
        return {"answer": build_fallback_recommendation_message(recommendations, req.query), "source_docs": []}

    # Build a simple GROQ query to find documents matching the query in title or body
    user_q = req.query.replace('"', '')
    groq = f"*[_type in ['article','page','post'] && (title match '{user_q}*' || body match '{user_q}*')][0..4]{'{title,body,slug}'}"

    try:
        sanity_resp = await fetch_sanity_groq(groq)
        docs = sanity_resp.get('result', []) if isinstance(sanity_resp, dict) else []
    except HTTPException as e:
        return {"answer": f"Error querying Sanity: {e.detail}"}

    # Compose context
    ctx_parts = []
    for d in docs:
        title = d.get('title', '')
        body = d.get('body', '')
        # If body is structured (array), try to extract text
        if isinstance(body, list):
            try:
                body_text = ' '.join([item.get('children', [{}])[0].get('text','') if isinstance(item, dict) else str(item) for item in body])
            except Exception:
                body_text = str(body)
        else:
            body_text = str(body)
        ctx_parts.append(f"Title: {title}\n{body_text}")

    context = "\n\n---\n\n".join(ctx_parts) if ctx_parts else ""

    if not context:
        recommendations = await fetch_tmdb_recommendations(req.query)
        if recommendations:
            return {"answer": build_fallback_recommendation_message(recommendations, req.query), "source_docs": []}

    # If no model key is configured, return the retrieved docs or TMDb recommendations.
    if llm_provider != 'groq' and not OPENAI_KEY:
        if context:
            return {"answer": f"Retrieved documents:\n\n{context}", "source_docs": docs}
        recommendations = await fetch_tmdb_recommendations(req.query)
        return {"answer": build_fallback_recommendation_message(recommendations, req.query), "source_docs": []}

    system_prompt = (
        "You are CineVerse assistant. Use the provided context from the site's CMS to answer the user's question. "
        "If the answer is not contained in the context, answer concisely and say you don't know."
    )
    user_prompt = f"Context:\n{context}\n\nUser question: {req.query}\n\nProvide a helpful, factual answer citing the context where appropriate."

    payload = {
        "model": os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo'),
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "max_tokens": 512,
        "temperature": 0.2
    }
    async with httpx.AsyncClient() as client:
        if llm_provider == 'groq':
            # Groq is OpenAI-compatible; default to the official chat completions endpoint.
            groq_url = os.getenv('GROQ_API_URL', 'https://api.groq.com/openai/v1/chat/completions')
            groq_key = os.getenv('GROQ_API_KEY')
            groq_model = os.getenv('GROQ_MODEL', 'llama-3.1-70b-versatile')
            if not groq_url or not groq_key:
                recommendations = await fetch_tmdb_recommendations(req.query)
                return {
                    "answer": build_fallback_recommendation_message(recommendations, req.query),
                    "source_docs": docs,
                }

            groq_headers = {"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"}
            groq_payload = {
                "model": groq_model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.2,
                "max_tokens": 512,
            }
            try:
                resp = await client.post(groq_url, headers=groq_headers, json=groq_payload)
                resp.raise_for_status()
                js = resp.json()
                answer = js.get('choices', [])[0].get('message', {}).get('content', '') if isinstance(js, dict) else ''
                if not answer and isinstance(js, dict):
                    # Fallback for any non-standard response shape.
                    for key in ('output','outputs','result','data','response','text'):
                        if key in js:
                            val = js[key]
                            if isinstance(val, list) and val:
                                answer = ' '.join([str(x) for x in val])
                            else:
                                answer = str(val)
                            break
                if not answer:
                    answer = resp.text
                return {"answer": answer, "source_docs": docs}
            except Exception as e:
                return {"answer": f"Groq request failed: {e}", "raw": resp.text}
        else:
            headers = {"Authorization": f"Bearer {OPENAI_KEY}", "Content-Type": "application/json"}
            # Default: OpenAI
            resp = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
            try:
                resp.raise_for_status()
                js = resp.json()
                answer = js.get('choices', [])[0].get('message', {}).get('content', '')
                return {"answer": answer, "source_docs": docs}
            except Exception as e:
                return {"answer": f"OpenAI request failed: {e}", "raw": resp.text}


@app.get("/movies/search")
async def movies_search(query: str):
    if not TMDB_KEY:
        raise HTTPException(status_code=500, detail="TMDB_API_KEY not set in backend environment")
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_KEY}&query={query}"
    async with httpx.AsyncClient() as client:
        r = await client.get(url)
        r.raise_for_status()
        return r.json()


@app.get("/movies/discover")
async def movies_discover(genre_id: int):
    if not TMDB_KEY:
        raise HTTPException(status_code=500, detail="TMDB_API_KEY not set in backend environment")
    url = (
        f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_KEY}"
        f"&with_genres={genre_id}&language=en-US&page=1"
    )
    async with httpx.AsyncClient() as client:
        r = await client.get(url)
        r.raise_for_status()
        return r.json()


async def fetch_sanity_groq(groq: str):
    """Helper to query Sanity GROQ endpoint. Returns parsed JSON results.

    Requires `SANITY_PROJECT_ID` and optionally `SANITY_DATASET` and `SANITY_API_TOKEN`.
    """
    project = os.getenv('SANITY_PROJECT_ID')
    if not project:
        raise HTTPException(status_code=500, detail="SANITY_PROJECT_ID not set in backend environment")
    dataset = os.getenv('SANITY_DATASET', 'production')
    token = os.getenv('SANITY_API_TOKEN')
    import urllib.parse

    url = f"https://{project}.api.sanity.io/v1/data/query/{dataset}?query={urllib.parse.quote(groq)}"
    headers = {}
    if token:
        headers['Authorization'] = f"Bearer {token}"

    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers)
        try:
            resp.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=500, detail=f"Sanity request failed: {e}")
        return resp.json()


@app.get('/sanity/query')
async def sanity_query(groq: str):
    """Expose a simple pass-through GROQ query endpoint for backend usage.

    Note: For production, restrict or validate allowed queries to avoid abuse.
    """
    return await fetch_sanity_groq(groq)
