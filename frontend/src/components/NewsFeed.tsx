import { useState } from 'react'
import type { FeedItem, TrendingRepo, NewsItem } from '../types'
import { useNews } from '../hooks/useNews'
import CategoryTabs from './CategoryTabs'
import RepoCard from './RepoCard'
import NewsCard from './NewsCard'

interface FeedProps {
  onRepoExplain: (repo: TrendingRepo) => void
  onNewsExplain: (item: NewsItem) => void
}

export default function Feed({ onRepoExplain, onNewsExplain }: FeedProps) {
  const [category, setCategory] = useState('github')
  const { items, loading, error, reload } = useNews(category)

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px flex-1 bg-emerald-500/30 w-8" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/60">Live</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Feed
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            GitHub trending, tech news, AI updates & more
          </p>
        </div>
        <button
          onClick={reload}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
          style={{ background: 'var(--bg-hover)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover-strong)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-hover)' }}
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
          {loading ? 'Refreshing' : 'Refresh'}
        </button>
      </div>

      {/* Category Tabs */}
      <CategoryTabs active={category} onChange={setCategory} />

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border p-4 text-sm" style={{ background: 'var(--error-bg)', borderColor: 'var(--error-border)', color: 'var(--error-text)' }}>
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Content */}
      {loading && items.length === 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border p-5 space-y-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
              <div className="h-5 w-2/3 rounded-md animate-shimmer" style={{ background: `linear-gradient(90deg, var(--skeleton) 0%, var(--skeleton-shine) 50%, var(--skeleton) 100%)`, backgroundSize: '200% 100%', animationDelay: `${i * 100}ms` }} />
              <div className="space-y-2">
                <div className="h-3 w-full rounded animate-shimmer" style={{ background: `linear-gradient(90deg, var(--skeleton) 0%, var(--skeleton-shine) 50%, var(--skeleton) 100%)`, backgroundSize: '200% 100%', animationDelay: `${i * 100 + 50}ms` }} />
                <div className="h-3 w-4/5 rounded animate-shimmer" style={{ background: `linear-gradient(90deg, var(--skeleton) 0%, var(--skeleton-shine) 50%, var(--skeleton) 100%)`, backgroundSize: '200% 100%', animationDelay: `${i * 100 + 100}ms` }} />
              </div>
              <div className="flex gap-4">
                <div className="h-3 w-16 rounded" style={{ background: 'var(--skeleton)' }} />
                <div className="h-3 w-12 rounded" style={{ background: 'var(--skeleton)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {items.map((item, i) => (
            <div key={getItemKey(item, i)} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              {item.feedType === 'repo' ? (
                <RepoCard repo={item} onExplain={onRepoExplain} />
              ) : (
                <NewsCard item={item} onExplain={onNewsExplain} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && items.length === 0 && !error && (
        <div className="mt-4 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-2xl border flex items-center justify-center mb-4" style={{ background: 'var(--bg-hover)', borderColor: 'var(--border)' }}>
            <svg className="w-6 h-6" style={{ color: 'var(--text-faint)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No items found</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>Try a different category or refresh</p>
        </div>
      )}
    </section>
  )
}

function getItemKey(item: FeedItem, index: number): string {
  if (item.feedType === 'repo') return item.fullName
  return `${item.link}-${index}`
}
