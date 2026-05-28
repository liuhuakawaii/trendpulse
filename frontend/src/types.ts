export interface TrendingRepo {
  name: string
  fullName: string
  description: string
  language: string
  stars: number
  forks: number
  todayStars: number
  url: string
}

export interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
  source: string
  category: string
}

export type AIProviderType = 'claude' | 'openai' | 'custom'

export interface AIConfig {
  provider: AIProviderType
  apiKey: string
  model: string
  endpoint: string
}

export const NEWS_CATEGORIES = [
  { key: 'tech', label: '科技', icon: '💻' },
  { key: 'business', label: '商业', icon: '📈' },
  { key: 'science', label: '科学', icon: '🔬' },
  { key: 'world', label: '国际', icon: '🌍' },
  { key: 'health', label: '健康', icon: '🏥' },
] as const

export const AI_MODELS: Record<AIProviderType, string[]> = {
  claude: ['claude-sonnet-4-20250514', 'claude-haiku-4-5-20251001'],
  openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
  custom: ['default'],
}
