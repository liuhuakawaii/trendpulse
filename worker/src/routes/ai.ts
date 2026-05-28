import { Hono } from 'hono'
import { stream } from 'hono/streaming'
import { callAI, buildPrompt } from '../services/ai-provider'
import type { AIExplainRequest } from '../types'

const ai = new Hono()

ai.post('/explain', async (c) => {
  let body: AIExplainRequest
  try {
    body = await c.req.json()
  } catch {
    return c.json({ success: false, error: 'Invalid JSON body' }, 400)
  }

  const { category, content, provider } = body
  if (!category || !content || !provider?.type || !provider?.apiKey) {
    return c.json({ success: false, error: 'Missing required fields: category, content, provider.type, provider.apiKey' }, 400)
  }

  try {
    const prompt = buildPrompt(category, content)
    const aiStream = await callAI(provider, prompt)

    return stream(c, async (streamWriter) => {
      c.header('Content-Type', 'text/event-stream')
      c.header('Cache-Control', 'no-cache')
      c.header('Connection', 'keep-alive')

      const reader = aiStream.getReader()
      const decoder = new TextDecoder()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          await streamWriter.write(decoder.decode(value, { stream: true }))
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Stream error'
        await streamWriter.write(`data: ${JSON.stringify({ error: msg })}\n\n`)
      }

      await streamWriter.write('data: [DONE]\n\n')
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'AI service error'
    return c.json({ success: false, error: msg }, 500)
  }
})

export default ai
