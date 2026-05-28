import { useState, useEffect, useCallback } from 'react'
import type { TrendingRepo } from '../types'
import { fetchTrending } from '../services/api'

export function useGithub() {
  const [repos, setRepos] = useState<TrendingRepo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTrending()
      setRepos(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { repos, loading, error, reload: load }
}
