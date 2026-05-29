import { useState, useCallback, useEffect, useRef } from 'react'
import type { TrendingRepo, NewsItem } from './types'
import { useGithub } from './hooks/useGithub'
import { useAI } from './hooks/useAI'
import { useTranslation } from './hooks/useTranslation'
import Header from './components/Header'
import GithubTrending from './components/GithubTrending'
import NewsFeed from './components/NewsFeed'
import AIDetailPanel from './components/AIDetailPanel'
import SettingsPanel from './components/SettingsPanel'

export default function App() {
  const { repos, loading: ghLoading, error: ghError, reload: ghReload } = useGithub()
  const { config, saveConfig, output, loading: aiLoading, error: aiError, explain, clearOutput } = useAI()
  const { enabled: translateEnabled, translating, toggle: toggleTranslate, translateRepos, translateNews } = useTranslation()

  const [showSettings, setShowSettings] = useState(false)
  const [aiTitle, setAiTitle] = useState('')
  const [showAI, setShowAI] = useState(false)
  const [translatedRepos, setTranslatedRepos] = useState<TrendingRepo[]>(repos)
  const reposRequestId = useRef(0)

  useEffect(() => {
    if (!translateEnabled || repos.length === 0) {
      setTranslatedRepos(repos)
      return
    }
    const id = ++reposRequestId.current
    translateRepos(repos).then((result) => {
      if (id === reposRequestId.current) {
        setTranslatedRepos(result)
      }
    })
  }, [repos, translateEnabled, translateRepos])

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
      <Header
        onSettingsClick={() => setShowSettings(true)}
        translateEnabled={translateEnabled}
        onToggleTranslate={toggleTranslate}
        translateLoading={translating}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <GithubTrending
          repos={translatedRepos}
          loading={ghLoading}
          error={ghError}
          onReload={ghReload}
          onExplain={handleRepoExplain}
        />
        <NewsFeed
          onExplain={handleNewsExplain}
          translateEnabled={translateEnabled}
          translateNews={translateNews}
        />
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
