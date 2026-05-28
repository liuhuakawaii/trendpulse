import { Hono } from 'hono'
import { fetchTrending } from '../services/github'

const github = new Hono()

github.get('/trending', async (c) => {
  try {
    const repos = await fetchTrending()
    return c.json({ success: true, data: repos })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, error: msg }, 500)
  }
})

export default github
