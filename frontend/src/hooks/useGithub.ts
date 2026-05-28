import { useEffect, useState } from 'react'
import type { TrendingRepo } from '../types'
import { fetchTrending } from '../services/api'

export function useGithub() {
  const [repos, setRepos] = useState<TrendingRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
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
  }

  useEffect(() => {
    void fetchTrending()
      .then((data) => {
        setRepos(data)
        setError(null)
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Failed to load')
      })
      .finally(() => setLoading(false))
  }, [])

  return { repos, loading, error, reload: load }
}
