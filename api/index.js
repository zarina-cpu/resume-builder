if (!process.env.VERCEL) {
  await import('dotenv/config')
}

const { default: app } = await import('../server/app.js')

export default app
