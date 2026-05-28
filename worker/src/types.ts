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

export type AICategory = 'github' | 'news'

export interface AIExplainRequest {
  category: AICategory
  content: string
  provider: AIProvider
}

export type AIProviderType = 'claude' | 'openai' | 'custom'

export interface AIProvider {
  type: AIProviderType
  apiKey: string
  model?: string
  endpoint?: string
}
