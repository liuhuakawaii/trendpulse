import type { TrendingRepo } from '../types'

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Shell: '#89e051',
  Lua: '#000080',
  Zig: '#ec915c',
}

interface RepoCardProps {
  repo: TrendingRepo
  onExplain: (repo: TrendingRepo) => void
}

export default function RepoCard({ repo, onExplain }: RepoCardProps) {
  const langColor = LANGUAGE_COLORS[repo.language] || '#a1a1aa'

  return (
    <article
      className="group relative rounded-2xl border p-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = `0 10px 25px -5px var(--shadow)` }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Repo Name */}
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-base font-semibold tracking-tight transition-colors duration-150"
        style={{ color: 'var(--text-primary)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-text)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
      >
        {repo.fullName}
      </a>

      {/* Description */}
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {repo.description || 'No description provided'}
      </p>

      {/* Metrics */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs" style={{ color: 'var(--text-faint)' }}>
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: langColor }} />
            <span style={{ color: 'var(--text-secondary)' }}>{repo.language}</span>
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5 text-amber-500/70" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>{repo.stars.toLocaleString()}</span>
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 3a3 3 0 0 1 3 3c0 .83-.34 1.58-.88 2.12L12 11l2.88-2.88A3 3 0 1 1 16 9.83l-3 3V16.2a3 3 0 1 1-2 0v-3.37l-3-3A3 3 0 1 1 7 3Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm10 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
          </svg>
          <span>{repo.forks.toLocaleString()}</span>
        </span>
        {repo.todayStars > 0 && (
          <span className="text-emerald-500 font-medium">
            +{repo.todayStars.toLocaleString()}
          </span>
        )}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => onExplain(repo)}
        className="mt-4 w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]"
        style={{ background: 'var(--bg-hover)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-bg)'; e.currentTarget.style.color = 'var(--accent-text)'; e.currentTarget.style.borderColor = 'var(--accent-border)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        Analyze with AI
      </button>
    </article>
  )
}
