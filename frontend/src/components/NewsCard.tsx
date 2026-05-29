import type { NewsItem } from '../types'

interface NewsCardProps {
  item: NewsItem
  onExplain: (item: NewsItem) => void
}

export default function NewsCard({ item, onExplain }: NewsCardProps) {
  const timeAgo = getTimeAgo(item.pubDate)

  return (
    <article
      className="group relative rounded-2xl border p-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = `0 10px 25px -5px var(--shadow)` }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Meta */}
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset" style={{
          background: 'var(--bg-hover)',
          color: 'var(--text-secondary)',
          borderColor: 'var(--border)',
        }}>
          {item.source}
        </span>
        {timeAgo && (
          <span className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>{timeAgo}</span>
        )}
      </div>

      {/* Title */}
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="line-clamp-2 block text-base font-semibold leading-snug tracking-tight transition-colors duration-150"
        style={{ color: 'var(--text-primary)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-text)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
      >
        {item.title}
      </a>

      {/* Description */}
      {item.description && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {item.description}
        </p>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={() => onExplain(item)}
        className="mt-3 inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98]"
        style={{ background: 'var(--bg-hover)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-bg)'; e.currentTarget.style.color = 'var(--accent-text)'; e.currentTarget.style.borderColor = 'var(--accent-border)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        </svg>
        Analyze
      </button>
    </article>
  )
}

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const timestamp = date.getTime()
  if (!Number.isFinite(timestamp)) return ''

  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`

  const days = Math.floor(hours / 24)
  return `${days}d`
}
