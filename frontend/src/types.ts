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
  { key: 'github', label: 'GitHub' },
  { key: 'aiml-topic', label: 'ML / AI Repos' },
  { key: 'showhn', label: 'Show HN' },
  { key: 'tech', label: 'Technology' },
  { key: 'programming', label: 'Programming' },
  { key: 'business', label: 'Business' },
  { key: 'science', label: 'Science' },
  { key: 'gaming', label: 'Gaming' },
  { key: 'finance', label: 'Finance' },
  { key: 'world', label: 'World' },
  { key: 'health', label: 'Health' },
] as const

export type FeedItem = (TrendingRepo & { feedType: 'repo' }) | (NewsItem & { feedType: 'news' })

export const AI_MODELS: Record<AIProviderType, string[]> = {
  claude: ['claude-sonnet-4-20250514', 'claude-haiku-3-5-20241022'],
  openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini'],
  custom: [],
}
