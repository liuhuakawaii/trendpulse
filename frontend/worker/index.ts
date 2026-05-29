import { Hono } from 'hono'
import { cors } from 'hono/cors'
import github from './routes/github'
import news from './routes/news'
import ai from './routes/ai'

const app = new Hono()

app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.route('/api/github', github)
app.route('/api/news', news)
app.route('/api/ai', ai)

app.get('/', (c) => c.json({ status: 'ok', service: 'TrendPulse API' }))

export default app
