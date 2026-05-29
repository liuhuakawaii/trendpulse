import type { TrendingRepo } from '../types'

interface RepoCardProps {
  repo: TrendingRepo
  onExplain: (repo: TrendingRepo) => void
}

export default function RepoCard({ repo, onExplain }: RepoCardProps) {
  return (
    <article className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-5 transition-all duration-200 hover:border-cyan-500/30 hover:bg-slate-800/80">
      <div className="min-w-0">
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-lg font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
        >
          {repo.fullName}
        </a>
        <p className="mt-1 line-clamp-2 text-sm text-slate-400">
          {repo.translatedDescription || repo.description || 'No description'}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {repo.stars.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 3a3 3 0 0 1 3 3c0 .83-.34 1.58-.88 2.12L12 11l2.88-2.88A3 3 0 1 1 16 9.83l-3 3V16.2a3 3 0 1 1-2 0v-3.37l-3-3A3 3 0 1 1 7 3Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm10 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
          </svg>
          {repo.forks.toLocaleString()}
        </span>
        {repo.todayStars > 0 && (
          <span className="font-medium text-emerald-400">
            +{repo.todayStars.toLocaleString()} today
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => onExplain(repo)}
        className="mt-4 w-full rounded-lg border border-cyan-500/20 bg-cyan-600/15 px-4 py-2 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-600/25 active:scale-[0.98]"
      >
        Analyze with AI
      </button>
    </article>
  )
}
