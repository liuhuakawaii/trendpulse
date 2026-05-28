import type { NewsItem } from '../types'

interface NewsCardProps {
  item: NewsItem
  onExplain: (item: NewsItem) => void
}

export default function NewsCard({ item, onExplain }: NewsCardProps) {
  const timeAgo = getTimeAgo(item.pubDate)

  return (
    <article className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-5 transition-all duration-200 hover:border-cyan-500/30 hover:bg-slate-800/80">
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
        <span className="rounded bg-slate-700/50 px-2 py-0.5 font-medium text-slate-400">
          {item.source}
        </span>
        <span>{timeAgo}</span>
      </div>

      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="line-clamp-2 block font-semibold text-white transition-colors hover:text-cyan-300"
      >
        {item.title}
      </a>

      {item.description && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-400">{item.description}</p>
      )}

      <button
        type="button"
        onClick={() => onExplain(item)}
        className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-600/15 px-4 py-1.5 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-600/25 active:scale-[0.98]"
      >
        Analyze with AI
      </button>
    </article>
  )
}

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const timestamp = date.getTime()

  if (!Number.isFinite(timestamp)) return ''

  const diff = Date.now() - timestamp
  const minutes = Math.max(0, Math.floor(diff / 60000))
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
