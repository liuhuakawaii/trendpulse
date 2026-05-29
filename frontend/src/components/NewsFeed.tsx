import { useState, useEffect, useRef } from 'react'
import type { NewsItem } from '../types'
import { useNews } from '../hooks/useNews'
import CategoryTabs from './CategoryTabs'
import NewsCard from './NewsCard'

interface NewsFeedProps {
  onExplain: (item: NewsItem) => void
  translateEnabled: boolean
  translateNews: (items: NewsItem[]) => Promise<NewsItem[]>
}

export default function NewsFeed({ onExplain, translateEnabled, translateNews }: NewsFeedProps) {
  const [category, setCategory] = useState('tech')
  const { items, loading, error, reload } = useNews(category)
  const [translatedItems, setTranslatedItems] = useState<NewsItem[]>(items)
  const newsRequestId = useRef(0)

  useEffect(() => {
    if (!translateEnabled || items.length === 0) {
      setTranslatedItems(items)
      return
    }
    const id = ++newsRequestId.current
    translateNews(items).then((result) => {
      if (id === newsRequestId.current) {
        setTranslatedItems(result)
      }
    })
  }, [items, translateEnabled, translateNews])

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          News Feed
        </h2>
        <button
          onClick={reload}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <CategoryTabs active={category} onChange={setCategory} />

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading && translatedItems.length === 0 ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {translatedItems.map((item, i) => (
            <NewsCard key={`${item.link}-${i}`} item={item} onExplain={onExplain} />
          ))}
          {translatedItems.length === 0 && !loading && (
            <div className="col-span-2 text-center py-12 text-slate-500">
              No news found for this category
            </div>
          )}
        </div>
      )}
    </section>
  )
}
