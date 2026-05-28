import { useState, useCallback } from 'react'
import type { AIConfig } from '../types'
import { streamAIExplain } from '../services/api'

const DEFAULT_CONFIG: AIConfig = {
  provider: 'claude',
  apiKey: '',
  model: 'claude-sonnet-4-20250514',
  endpoint: '',
}

export function useAI() {
  const [config, setConfig] = useState<AIConfig>(() => {
    const saved = localStorage.getItem('trendpulse-ai-config')
    return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG
  })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveConfig = useCallback((newConfig: AIConfig) => {
    setConfig(newConfig)
    localStorage.setItem('trendpulse-ai-config', JSON.stringify(newConfig))
  }, [])

  const explain = useCallback(
    async (category: 'github' | 'news', content: string) => {
      if (!config.apiKey) {
        setError('Please configure your AI API key in Settings')
        return
      }
      setOutput('')
      setLoading(true)
      setError(null)

      await streamAIExplain(
        category,
        content,
        config,
        (text) => setOutput((prev) => prev + text),
        () => setLoading(false),
        (err) => { setError(err); setLoading(false) }
      )
    },
    [config]
  )

  const clearOutput = useCallback(() => {
    setOutput('')
    setError(null)
  }, [])

  return { config, saveConfig, output, loading, error, explain, clearOutput }
}
