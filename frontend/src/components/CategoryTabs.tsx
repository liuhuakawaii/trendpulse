import { NEWS_CATEGORIES } from '../types'

interface CategoryTabsProps {
  active: string
  onChange: (category: string) => void
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {NEWS_CATEGORIES.map((category) => (
        <button
          key={category.key}
          type="button"
          onClick={() => onChange(category.key)}
          aria-pressed={active === category.key}
          className={`flex items-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition-all active:scale-[0.98] ${
            active === category.key
              ? 'border-cyan-500/30 bg-cyan-600/20 text-cyan-300'
              : 'border-transparent bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
          }`}
        >
          <span
            aria-hidden="true"
            className="grid h-5 min-w-8 place-items-center rounded-md bg-slate-950/50 px-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500"
          >
            {category.shortLabel}
          </span>
          {category.label}
        </button>
      ))}
    </div>
  )
}
