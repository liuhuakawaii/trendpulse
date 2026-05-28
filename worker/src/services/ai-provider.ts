import type { AIProvider, AICategory } from '../types'

const GITHUB_PROMPT = `You are a tech analyst. Provide a detailed introduction of this GitHub repository in Chinese (markdown format). Cover:
1. What the project does and what problem it solves
2. Key technical highlights and architecture
3. Why it's trending and its potential impact
4. How to get started

Repository info:
`

const NEWS_PROMPT = `You are a news analyst. Provide a detailed analysis of this news in Chinese (markdown format). Cover:
1. Key facts and background
2. Why this matters and its implications
3. Related context and connections
4. What to watch next

News content:
`

export function buildPrompt(category: AICategory, content: string): string {
  const prefix = category === 'github' ? GITHUB_PROMPT : NEWS_PROMPT
  return prefix + content
}

export async function callAI(
  provider: AIProvider,
  prompt: string
): Promise<ReadableStream<Uint8Array>> {
  switch (provider.type) {
    case 'claude':
      return callClaude(provider, prompt)
    case 'openai':
      return callOpenAI(provider, prompt)
    case 'custom':
      return callCustom(provider, prompt)
    default:
      throw new Error(`Unknown provider: ${provider.type}`)
  }
}

async function callClaude(
  provider: AIProvider,
  prompt: string
): Promise<ReadableStream<Uint8Array>> {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': provider.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: provider.model || 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      stream: true,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!resp.ok) {
    const err = await resp.text()
    throw new Error(`Claude API error: ${resp.status} - ${err}`)
  }

  return transformSSE(resp.body!, 'claude')
}

async function callOpenAI(
  provider: AIProvider,
  prompt: string
): Promise<ReadableStream<Uint8Array>> {
  const endpoint = provider.endpoint || 'https://api.openai.com/v1/chat/completions'
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify({
      model: provider.model || 'gpt-4o-mini',
      stream: true,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!resp.ok) {
    const err = await resp.text()
    throw new Error(`OpenAI API error: ${resp.status} - ${err}`)
  }

  return transformSSE(resp.body!, 'openai')
}

async function callCustom(
  provider: AIProvider,
  prompt: string
): Promise<ReadableStream<Uint8Array>> {
  if (!provider.endpoint) throw new Error('Custom provider requires endpoint')

  const resp = await fetch(provider.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify({
      model: provider.model || 'default',
      stream: true,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!resp.ok) {
    const err = await resp.text()
    throw new Error(`Custom API error: ${resp.status} - ${err}`)
  }

  return transformSSE(resp.body!, 'openai')
}

function transformSSE(
  upstream: ReadableStream<Uint8Array>,
  format: 'claude' | 'openai'
): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ''

  return new ReadableStream({
    async start(controller) {
      const reader = upstream.getReader()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const text = extractText(parsed, format)
              if (text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      } catch (e) {
        controller.error(e)
      } finally {
        controller.close()
      }
    },
  })
}

function extractText(data: Record<string, unknown>, format: 'claude' | 'openai'): string {
  if (format === 'claude') {
    if (data.type === 'content_block_delta') {
      const delta = data.delta as Record<string, unknown> | undefined
      if (delta?.type === 'text_delta') return (delta.text as string) || ''
    }
    return ''
  }

  // openai format
  const choices = data.choices as Array<Record<string, unknown>> | undefined
  if (!choices?.length) return ''
  const delta = choices[0].delta as Record<string, unknown> | undefined
  return (delta?.content as string) || ''
}
