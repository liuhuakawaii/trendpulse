import { useState } from 'react'
import type { AIConfig, AIProviderType } from '../types'
import { AI_MODELS } from '../types'

interface SettingsPanelProps {
  config: AIConfig
  onSave: (config: AIConfig) => void
  onClose: () => void
}

export default function SettingsPanel({ config, onSave, onClose }: SettingsPanelProps) {
  const [form, setForm] = useState<AIConfig>(config)

  const handleSave = () => {
    onSave(form)
    onClose()
  }

  const providers: { key: AIProviderType; label: string }[] = [
    { key: 'claude', label: 'Claude' },
    { key: 'openai', label: 'OpenAI' },
    { key: 'custom', label: 'Custom' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border shadow-2xl animate-slide-up" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: `0 25px 50px -12px var(--shadow)` }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>Settings</h3>
            <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>Configure your AI provider</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-4 space-y-5">
          {/* Provider */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Provider</label>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
              {providers.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setForm((f) => ({ ...f, provider: p.key, model: AI_MODELS[p.key][0] || '' }))}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: form.provider === p.key ? 'var(--bg-hover-strong)' : 'transparent',
                    color: form.provider === p.key ? 'var(--text-primary)' : 'var(--text-muted)',
                    boxShadow: form.provider === p.key ? '0 1px 2px var(--shadow)' : 'none',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>API Key</label>
            <input
              type="password"
              value={form.apiKey}
              onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
              placeholder="sk-..."
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
              style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Model</label>
            {form.provider === 'custom' ? (
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                placeholder="e.g. gpt-4o-mini"
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
                style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
            ) : (
              <select
                value={form.model}
                onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
                style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                {AI_MODELS[form.provider].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            )}
          </div>

          {/* Custom Endpoint */}
          {form.provider === 'custom' && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Endpoint</label>
              <input
                type="url"
                value={form.endpoint}
                onChange={(e) => setForm((f) => ({ ...f, endpoint: e.target.value }))}
                placeholder="https://your-api.com/v1"
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
                style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
              <p className="mt-1.5 text-xs" style={{ color: 'var(--text-faint)' }}>/chat/completions will be appended automatically</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all active:scale-[0.98]"
            style={{ background: 'var(--bg-hover)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-sm font-semibold text-white hover:bg-emerald-400 transition-all active:scale-[0.98]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
