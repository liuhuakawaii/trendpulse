import type { NewsItem } from '../types'

interface NewsCardProps {
  item: NewsItem
  onExplain: (item: NewsItem) => void
}

export default function NewsCard({ item, onExplain }: NewsCardProps) {
  const timeAgo = getTimeAgo(item.pubDate)

  return (
    <div className="group bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all duration-200">
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <span className="px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 font-medium">
          {item.source}
        </span>
        <span>{timeAgo}</span>
      </div>

      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white font-semibold hover:text-cyan-400 transition-colors line-clamp-2 block"
      >
        {item.title}
      </a>

      {item.description && (
        <p className="text-slate-400 text-sm mt-2 line-clamp-2">{item.description}</p>
      )}

      <button
        onClick={() => onExplain(item)}
        className="mt-3 py-1.5 px-4 rounded-lg bg-cyan-600/20 text-cyan-400 text-sm font-medium hover:bg-cyan-600/30 transition-colors border border-cyan-500/20"
      >
        AI 详细介绍
      </button>
    </div>
  )
}

function getTimeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  } catch {
    return ''
  }
}
