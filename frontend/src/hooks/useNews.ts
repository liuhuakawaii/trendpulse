import { useEffect, useState } from 'react'
import type { NewsItem } from '../types'
import { fetchNews } from '../services/api'

interface NewsState {
  category: string
  items: NewsItem[]
  loading: boolean
  error: string | null
}

export function useNews(category: string) {
  const [state, setState] = useState<NewsState>({
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
      const data = await fetchNews(category)
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

    void fetchNews(category)
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
