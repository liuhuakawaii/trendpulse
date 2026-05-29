import { useState, useCallback, useRef } from 'react'
import type { TrendingRepo, NewsItem } from '../types'
import { translateItems } from '../services/api'

const STORAGE_KEY = 'trendpulse-translate-enabled'

export function useTranslation() {
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  })
  const [translating, setTranslating] = useState(false)
  const requestIdRef = useRef(0)

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }, [])

  const translateRepos = useCallback(
    async (repos: TrendingRepo[]): Promise<TrendingRepo[]> => {
      if (!enabled || repos.length === 0) return repos

      const untranslated = repos.filter((r) => !r.translatedDescription)
      if (untranslated.length === 0) return repos

      const requestId = ++requestIdRef.current
      setTranslating(true)

      try {
        const items = untranslated.map((r) => ({
          id: r.fullName,
          description: r.description,
        }))
        const translated = await translateItems(items)
        const map = new Map(translated.map((t) => [t.id, t]))

        if (requestId !== requestIdRef.current) return repos

        return repos.map((r) => {
          const t = map.get(r.fullName)
          return t?.description
            ? { ...r, translatedDescription: t.description }
            : r
        })
      } catch {
        return repos
      } finally {
        if (requestId === requestIdRef.current) {
          setTranslating(false)
        }
      }
    },
    [enabled]
  )

  const translateNews = useCallback(
    async (items: NewsItem[]): Promise<NewsItem[]> => {
      if (!enabled || items.length === 0) return items

      const untranslated = items.filter(
        (i) => !i.translatedTitle && !i.translatedDescription
      )
      if (untranslated.length === 0) return items

      const requestId = ++requestIdRef.current
      setTranslating(true)

      try {
        const req = untranslated.map((i) => ({
          id: i.link,
          title: i.title,
          description: i.description,
        }))
        const translated = await translateItems(req)
        const map = new Map(translated.map((t) => [t.id, t]))

        if (requestId !== requestIdRef.current) return items

        return items.map((i) => {
          const t = map.get(i.link)
          return t
            ? {
                ...i,
                translatedTitle: t.title || i.translatedTitle,
                translatedDescription: t.description || i.translatedDescription,
              }
            : i
        })
      } catch {
        return items
      } finally {
        if (requestId === requestIdRef.current) {
          setTranslating(false)
        }
      }
    },
    [enabled]
  )

  return { enabled, translating, toggle, translateRepos, translateNews }
}
