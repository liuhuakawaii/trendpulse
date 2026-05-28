import { Hono } from 'hono'
import { fetchNews } from '../services/rss'

const news = new Hono()

news.get('/:category', async (c) => {
  const category = c.req.param('category')
  try {
    const items = await fetchNews(category)
    return c.json({ success: true, data: items })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, error: msg }, 500)
  }
})

export default news
