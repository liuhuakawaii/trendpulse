import { Hono } from 'hono'
import { fetchTrending, fetchTopicRepos } from '../services/github'

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

github.get('/topics/:topic', async (c) => {
  try {
    const topic = c.req.param('topic')
    if (!topic) {
      return c.json({ success: false, error: 'Topic is required' }, 400)
    }
    const repos = await fetchTopicRepos(topic)
    return c.json({ success: true, data: repos })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, error: msg }, 500)
  }
})

export default github
