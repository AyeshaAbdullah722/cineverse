# Deploy backend to Railway

Steps to deploy the FastAPI backend on Railway (container deployment):

1. Install Railway CLI and login

```bash
npm i -g railway
railway login
```

2. From the repo root, create a new project and link it

```bash
cd backend
railway init
```

3. Railway will detect the `Dockerfile` and build the container. Deploy with:

```bash
railway up
```

4. After deployment Railway will show the service URL (e.g. `https://your-backend.up.railway.app`).

5. In Netlify, set `BACKEND_URL` to that URL and redeploy the frontend.

Notes:

- Add environment variables in Railway dashboard (SANITY_API_TOKEN, TMDB_API_KEY, GROQ_API_KEY, etc.).
- Alternatively, use `railway variables set KEY value` to set them from CLI.
