import { NEWS_CATEGORIES } from '../types'

interface CategoryTabsProps {
  active: string
  onChange: (category: string) => void
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
      {NEWS_CATEGORIES.map((category) => (
        <button
          key={category.key}
          type="button"
          onClick={() => onChange(category.key)}
          aria-pressed={active === category.key}
          className="flex-1 min-w-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            background: active === category.key ? 'var(--bg-hover-strong)' : 'transparent',
            color: active === category.key ? 'var(--text-primary)' : 'var(--text-muted)',
            boxShadow: active === category.key ? '0 1px 2px var(--shadow)' : 'none',
          }}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
