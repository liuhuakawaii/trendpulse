import { useState, useCallback } from 'react'
import type { TrendingRepo, NewsItem } from './types'
import { useAI } from './hooks/useAI'
import { useTheme } from './hooks/useTheme'
import Header from './components/Header'
import Feed from './components/NewsFeed'
import AIDetailPanel from './components/AIDetailPanel'
import SettingsPanel from './components/SettingsPanel'

export default function App() {
  const { config, saveConfig, output, loading: aiLoading, error: aiError, explain, clearOutput } = useAI()
  const { theme, toggle: toggleTheme } = useTheme()

  const [showSettings, setShowSettings] = useState(false)
  const [aiTitle, setAiTitle] = useState('')
  const [showAI, setShowAI] = useState(false)

  const handleRepoExplain = useCallback(
    (repo: TrendingRepo) => {
      setAiTitle(repo.fullName)
      setShowAI(true)
      explain(
        'github',
        `Name: ${repo.fullName}\nDescription: ${repo.description}\nLanguage: ${repo.language}\nStars: ${repo.stars}\nForks: ${repo.forks}\nToday Stars: ${repo.todayStars}\nURL: ${repo.url}`
      )
    },
    [explain]
  )

  const handleNewsExplain = useCallback(
    (item: NewsItem) => {
      setAiTitle(item.title)
      setShowAI(true)
      explain(
        'news',
        `Title: ${item.title}\nDescription: ${item.description}\nSource: ${item.source}\nPublished: ${item.pubDate}\nLink: ${item.link}`
      )
    },
    [explain]
  )

  const closeAI = useCallback(() => {
    setShowAI(false)
    clearOutput()
  }, [clearOutput])

  return (
    <div className="min-h-[100dvh]" style={{ background: 'var(--bg-primary)' }}>
      <Header
        onSettingsClick={() => setShowSettings(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Feed onRepoExplain={handleRepoExplain} onNewsExplain={handleNewsExplain} />
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>TrendPulse</span>
          <span>Powered by Cloudflare Workers</span>
        </div>
      </footer>

      {showAI && (
        <AIDetailPanel
          title={aiTitle}
          content={output}
          loading={aiLoading}
          error={aiError}
          onClose={closeAI}
        />
      )}

      {showSettings && (
        <SettingsPanel
          config={config}
          onSave={saveConfig}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
