import type { TrendingRepo } from '../types'

interface RepoCardProps {
  repo: TrendingRepo
  onExplain: (repo: TrendingRepo) => void
}

export default function RepoCard({ repo, onExplain }: RepoCardProps) {
  return (
    <div className="group bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 hover:border-violet-500/30 hover:bg-slate-800/80 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300 font-semibold text-lg truncate block"
          >
            {repo.fullName}
          </a>
          <p className="text-slate-400 text-sm mt-1 line-clamp-2">
            {repo.description || 'No description'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {repo.stars.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          {repo.forks.toLocaleString()}
        </span>
        {repo.todayStars > 0 && (
          <span className="text-emerald-400 font-medium">
            +{repo.todayStars.toLocaleString()} today
          </span>
        )}
      </div>

      <button
        onClick={() => onExplain(repo)}
        className="mt-4 w-full py-2 px-4 rounded-lg bg-violet-600/20 text-violet-400 text-sm font-medium hover:bg-violet-600/30 transition-colors border border-violet-500/20"
      >
        AI 详细介绍
      </button>
    </div>
  )
}
