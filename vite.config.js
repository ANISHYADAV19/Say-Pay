import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev-only middleware that serves the Vercel-style serverless function at
 * `/api/parse` during `vite dev`. This lets the full rules -> LLM pipeline be
 * exercised locally with a plain `npm run dev` (no `vercel dev` required).
 * In production, Vercel serves `api/parse.js` as a real serverless function.
 */
function apiDevServer() {
  return {
    name: 'say-and-pay-api-dev-server',
    configureServer(server) {
      server.middlewares.use('/api/parse', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/parse.js')
          const handler = mod.default

          // Collect and parse the JSON body (Vercel does this for us in prod).
          let raw = ''
          for await (const chunk of req) raw += chunk
          req.body = raw ? JSON.parse(raw) : {}

          // Minimal shim of the Vercel res helpers the handler relies on.
          res.status = (code) => {
            res.statusCode = code
            return res
          }
          res.json = (obj) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(obj))
          }

          await handler(req, res)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'dev_proxy_error', detail: String(err) }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Load ALL env vars (empty prefix) so the dev API middleware can read the
  // server-side secret from .env.local. These are NOT exposed to the client
  // bundle — only vars prefixed with VITE_ are, and secrets never carry it.
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['LLM_API_KEY', 'LLM_MODEL', 'LLM_PROVIDER']) {
    if (env[key]) process.env[key] = env[key]
  }

  return {
    plugins: [react(), apiDevServer()],
  }
})
