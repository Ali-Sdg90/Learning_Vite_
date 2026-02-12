# Learning_Vite_

Simple setup to learn:
- build API in `apps/server`
- call API from frontend in `apps/web`

## Project Structure

- `apps/server`: Express API server
- `apps/web`: React + Vite frontend

## Run Server

```bash
cd apps/server
npm install
npm run dev
```

Default server URL: `http://localhost:3001`  
Sample endpoint: `GET /api/health`

## Run Frontend

```bash
cd apps/web
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

Vite dev server proxies `/api` requests to the backend (`http://localhost:3001` by default), so from frontend code you can call:

```js
fetch("/api/health");
```

## Optional Environment Variables

`apps/server/.env.example`
- `PORT=3001`
- `CORS_ORIGIN=http://localhost:5173`

`apps/web/.env.example`
- `VITE_API_PROXY_TARGET=http://localhost:3001`
