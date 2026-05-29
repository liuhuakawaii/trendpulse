interface AIDetailPanelProps {
  title: string
  content: string
  loading: boolean
  error: string | null
  onClose: () => void
}

export default function AIDetailPanel({ title, content, loading, error, onClose }: AIDetailPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[80vh] rounded-3xl border shadow-2xl flex flex-col animate-slide-up" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: `0 25px 50px -12px var(--shadow)` }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>
              <svg className="w-4.5 h-4.5" style={{ color: 'var(--accent-text)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border p-4 text-sm mb-4" style={{ background: 'var(--error-bg)', borderColor: 'var(--error-border)', color: 'var(--error-text)' }}>
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {loading && !content && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>
                <svg className="w-5 h-5 animate-pulse" style={{ color: 'var(--accent-text)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Analyzing...</p>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>This may take a few seconds</p>
            </div>
          )}

          {content && (
            <div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
              />
              {loading && (
                <span className="inline-block w-1.5 h-4 animate-pulse ml-0.5 align-middle rounded-sm" style={{ background: 'var(--accent-text)', opacity: 0.6 }} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatMarkdown(text: string): string {
  return text
    .replace(/^### (.*$)/gm, '<h3 style="color:var(--text-primary)" class="text-base font-semibold mt-5 mb-2 tracking-tight">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 style="color:var(--text-primary)" class="text-lg font-bold mt-6 mb-2 tracking-tight">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 style="color:var(--text-primary)" class="text-xl font-bold mt-7 mb-3 tracking-tight">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary)" class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:var(--code-bg);color:var(--accent-text)" class="px-1.5 py-0.5 rounded-md text-xs font-mono">$1</code>')
    .replace(/^- (.*$)/gm, '<li class="ml-4" style="color:var(--text-secondary)">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal" style="color:var(--text-secondary)">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
}
