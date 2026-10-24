let loaded = false

/** Local dev / preview: load .env. On Vercel use dashboard Environment Variables only. */
export async function loadEnv() {
  if (process.env.VERCEL || loaded) return
  await import('dotenv/config')
  loaded = true
}
