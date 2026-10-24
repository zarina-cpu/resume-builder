import { loadEnv } from './loadEnv.js'
import app from './app.js'

await loadEnv()

const PORT = Number(process.env.PORT) || 3001

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server: http://127.0.0.1:${PORT}`)
  if (!process.env.GEMINI_API_KEY?.trim()) {
    console.warn('Warning: GEMINI_API_KEY is not set in .env')
  }
  if (!process.env.TURSO_DATABASE_URL?.trim() || !process.env.TURSO_AUTH_TOKEN?.trim()) {
    console.warn('Warning: TURSO_DATABASE_URL / TURSO_AUTH_TOKEN not set')
  }
})
