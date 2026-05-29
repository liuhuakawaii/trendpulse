import type { TrendingRepo, NewsItem, AIConfig } from '../types'

const API_BASE = '/api'

export async function fetchTrending(): Promise<TrendingRepo[]> {
  const resp = await fetch(`${API_BASE}/github/trending`)
  const data = await resp.json()
  if (!data.success) throw new Error(data.error || 'Failed to fetch trending')
  return data.data
}

export async function fetchNews(category: string): Promise<NewsItem[]> {
  const resp = await fetch(`${API_BASE}/news/${category}`)
  const data = await resp.json()
  if (!data.success) throw new Error(data.error || 'Failed to fetch news')
  return data.data
}

export async function fetchTopicRepos(topic: string): Promise<TrendingRepo[]> {
  const resp = await fetch(`${API_BASE}/github/topics/${encodeURIComponent(topic)}`)
  const data = await resp.json()
  if (!data.success) throw new Error(data.error || 'Failed to fetch topic repos')
  return data.data
}

export async function streamAIExplain(
  category: 'github' | 'news',
  content: string,
  config: AIConfig,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void
): Promise<void> {
  try {
    const resp = await fetch(`${API_BASE}/ai/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        content,
        provider: {
          type: config.provider,
          apiKey: config.apiKey,
          model: config.model,
          endpoint: config.endpoint || undefined,
        },
      }),
    })

    if (!resp.ok) {
      const err = await resp.json()
      onError(err.error || `HTTP ${resp.status}`)
      return
    }

    const reader = resp.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()
        if (data === '[DONE]') {
          onDone()
          return
        }
        try {
          const parsed = JSON.parse(data)
          if (parsed.error) {
            onError(parsed.error)
            return
          }
          if (parsed.text) onChunk(parsed.text)
        } catch {
          // skip
        }
      }
    }
    onDone()
  } catch (e) {
    onError(e instanceof Error ? e.message : 'Network error')
  }
}
