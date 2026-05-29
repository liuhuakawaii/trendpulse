import { useEffect, useState } from 'react'
import type { FeedItem } from '../types'
import { fetchNews, fetchTrending, fetchTopicRepos } from '../services/api'

interface FeedState {
  category: string
  items: FeedItem[]
  loading: boolean
  error: string | null
}

async function fetchFeed(category: string): Promise<FeedItem[]> {
  if (category === 'github') {
    const repos = await fetchTrending()
    return repos.map((r) => ({ ...r, feedType: 'repo' as const }))
  }
  if (category === 'aiml-topic') {
    const repos = await fetchTopicRepos('machine-learning')
    return repos.map((r) => ({ ...r, feedType: 'repo' as const }))
  }
  const news = await fetchNews(category)
  return news.map((n) => ({ ...n, feedType: 'news' as const }))
}

export function useNews(category: string) {
  const [state, setState] = useState<FeedState>({
    category,
    items: [],
    loading: true,
    error: null,
  })

  const isFreshCategory = state.category === category
  const items = isFreshCategory ? state.items : []
  const loading = isFreshCategory ? state.loading : true
  const error = isFreshCategory ? state.error : null

  const load = async () => {
    setState((current) => ({
      category,
      items: current.category === category ? current.items : [],
      loading: true,
      error: null,
    }))

    try {
      const data = await fetchFeed(category)
      setState({ category, items: data, loading: false, error: null })
    } catch (e) {
      setState((current) => ({
        category,
        items: current.category === category ? current.items : [],
        loading: false,
        error: e instanceof Error ? e.message : 'Failed to load',
      }))
    }
  }

  useEffect(() => {
    let cancelled = false

    void fetchFeed(category)
      .then((data) => {
        if (!cancelled) {
          setState({ category, items: data, loading: false, error: null })
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setState({
            category,
            items: [],
            loading: false,
            error: e instanceof Error ? e.message : 'Failed to load',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [category])

  return { items, loading, error, reload: load }
}
