interface AIDetailPanelProps {
  title: string
  content: string
  loading: boolean
  error: string | null
  onClose: () => void
}

export default function AIDetailPanel({
  title,
  content,
  loading,
  error,
  onClose,
}: AIDetailPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white truncate">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
              {error}
            </div>
          )}

          {loading && !content && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <span>AI is analyzing...</span>
              </div>
            </div>
          )}

          {content && (
            <div className="prose prose-invert prose-sm max-w-none">
              <div
                className="text-slate-300 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: formatMarkdown(content),
                }}
              />
              {loading && (
                <span className="inline-block w-2 h-5 bg-violet-400 animate-pulse ml-0.5 align-middle" />
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
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold text-white mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-white mt-5 mb-2">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-800 px-1.5 py-0.5 rounded text-violet-400 text-sm">$1</code>')
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
}
