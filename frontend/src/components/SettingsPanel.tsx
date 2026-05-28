import { useState, useEffect } from 'react'
import type { AIConfig, AIProviderType } from '../types'
import { AI_MODELS } from '../types'

interface SettingsPanelProps {
  config: AIConfig
  onSave: (config: AIConfig) => void
  onClose: () => void
}

export default function SettingsPanel({ config, onSave, onClose }: SettingsPanelProps) {
  const [form, setForm] = useState<AIConfig>(config)

  useEffect(() => {
    setForm(config)
  }, [config])

  const handleSave = () => {
    onSave(form)
    onClose()
  }

  const providers: { key: AIProviderType; label: string }[] = [
    { key: 'claude', label: 'Claude (Anthropic)' },
    { key: 'openai', label: 'OpenAI' },
    { key: 'custom', label: 'Custom' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <h3 className="text-lg font-bold text-white">AI Settings</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Provider */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Provider</label>
            <div className="grid grid-cols-3 gap-2">
              {providers.map((p) => (
                <button
                  key={p.key}
                  onClick={() => {
                    setForm((f) => ({
                      ...f,
                      provider: p.key,
                      model: AI_MODELS[p.key][0],
                    }))
                  }}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    form.provider === p.key
                      ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
                      : 'bg-slate-800/50 text-slate-400 border border-transparent hover:bg-slate-700/50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">API Key</label>
            <input
              type="password"
              value={form.apiKey}
              onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
              placeholder="sk-..."
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Model</label>
            <select
              value={form.model}
              onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
            >
              {AI_MODELS[form.provider].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Endpoint */}
          {form.provider === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Custom Endpoint
              </label>
              <input
                type="url"
                value={form.endpoint}
                onChange={(e) => setForm((f) => ({ ...f, endpoint: e.target.value }))}
                placeholder="https://your-api.com/v1/chat/completions"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-slate-700/50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
