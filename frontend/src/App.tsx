import { useState, useCallback } from 'react'
import type { TrendingRepo, NewsItem } from './types'
import { useGithub } from './hooks/useGithub'
import { useAI } from './hooks/useAI'
import Header from './components/Header'
import GithubTrending from './components/GithubTrending'
import NewsFeed from './components/NewsFeed'
import AIDetailPanel from './components/AIDetailPanel'
import SettingsPanel from './components/SettingsPanel'

export default function App() {
  const { repos, loading: ghLoading, error: ghError, reload: ghReload } = useGithub()
  const { config, saveConfig, output, loading: aiLoading, error: aiError, explain, clearOutput } = useAI()

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
    <div className="min-h-screen">
      <Header onSettingsClick={() => setShowSettings(true)} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <GithubTrending
          repos={repos}
          loading={ghLoading}
          error={ghError}
          onReload={ghReload}
          onExplain={handleRepoExplain}
        />
        <NewsFeed onExplain={handleNewsExplain} />
      </main>

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
