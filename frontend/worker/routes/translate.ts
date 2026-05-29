import { Hono } from 'hono'
import { translateBatch } from '../services/translate'

const translate = new Hono()

translate.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { items } = body

    if (!Array.isArray(items) || items.length === 0) {
      return c.json({ success: false, error: 'items array is required' }, 400)
    }

    const ai = (c.env as Record<string, unknown>).AI as {
      run: (model: string, params: Record<string, unknown>) => Promise<{ translated_text: string }>
    }

    if (!ai) {
      return c.json({ success: false, error: 'AI binding not configured' }, 500)
    }

    const data = await translateBatch(ai, items)
    return c.json({ success: true, data })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Translation failed'
    return c.json({ success: false, error: msg }, 500)
  }
})

export default translate
