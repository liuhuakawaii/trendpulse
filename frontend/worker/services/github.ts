import type { TrendingRepo } from '../types'

export async function fetchTrending(): Promise<TrendingRepo[]> {
  const resp = await fetch('https://github.com/trending', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; TrendPulse/1.0)',
      'Accept': 'text/html',
    },
  })
  const html = await resp.text()
  return parseTrendingHTML(html)
}

export async function fetchTopicRepos(topic: string): Promise<TrendingRepo[]> {
  const resp = await fetch(`https://github.com/topics/${encodeURIComponent(topic)}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; TrendPulse/1.0)',
      'Accept': 'text/html',
    },
  })
  const html = await resp.text()
  return parseTopicHTML(html)
}

function parseTrendingHTML(html: string): TrendingRepo[] {
  const repos: TrendingRepo[] = []
  const articleRegex = /<article class="Box-row">([\s\S]*?)<\/article>/g
  let match: RegExpExecArray | null

  while ((match = articleRegex.exec(html)) !== null && repos.length < 10) {
    const block = match[1]

    const nameMatch = block.match(/href="\/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)"/)
    const fullName = nameMatch ? nameMatch[1].trim() : ''
    if (!isRepositoryPath(fullName)) continue

    const parts = fullName.split('/')
    const name = parts.length > 1 ? parts[1] : fullName

    const descMatch = block.match(/<p class="[^"]*?col-9[^"]*?">([\s\S]*?)<\/p>/)
    const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : ''

    const langMatch = block.match(/itemprop="programmingLanguage">([\s\S]*?)<\//)
    const language = langMatch ? langMatch[1].trim() : ''

    const starRegex = /href="\/[^"]+?\/stargazers"[^>]*?>([\s\S]*?)<\//
    const starMatch = block.match(starRegex)
    const stars = starMatch ? parseNumber(starMatch[1]) : 0

    const forkRegex = /href="\/[^"]+?\/forks"[^>]*?>([\s\S]*?)<\//
    const forkMatch = block.match(forkRegex)
    const forks = forkMatch ? parseNumber(forkMatch[1]) : 0

    const todayMatch = block.match(/([\d,]+)\s+stars?\s+today/i)
    const todayStars = todayMatch ? parseNumber(todayMatch[1]) : 0

    repos.push({
      name,
      fullName,
      description,
      language,
      stars,
      forks,
      todayStars,
      url: `https://github.com/${fullName}`,
    })
  }

  return repos
}

function parseTopicHTML(html: string): TrendingRepo[] {
  const repos: TrendingRepo[] = []

  // Topic pages use a different structure - look for repo links in the list
  const repoRegex = /<a[^>]*?href="\/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)"[^>]*?class="[^"]*?color-fg-muted[^"]*?"/g
  let match: RegExpExecArray | null
  const seen = new Set<string>()

  while ((match = repoRegex.exec(html)) !== null && repos.length < 10) {
    const fullName = match[1].trim()
    if (!isRepositoryPath(fullName) || seen.has(fullName)) continue
    seen.add(fullName)

    const parts = fullName.split('/')
    const name = parts.length > 1 ? parts[1] : fullName

    // Try to find description near this match
    const context = html.slice(Math.max(0, match.index - 200), match.index + 500)
    const descMatch = context.match(/<p[^>]*?class="[^"]*?color-fg-muted[^"]*?"[^>]*?>([\s\S]*?)<\/p>/)
    const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim().slice(0, 200) : ''

    const langMatch = context.match(/itemprop="programmingLanguage">([\s\S]*?)<\//)
    const language = langMatch ? langMatch[1].trim() : ''

    // Try to find star count
    const starMatch = context.match(/stargazers[^>]*?>([\s\S]*?)<\//)
    const stars = starMatch ? parseNumber(starMatch[1]) : 0

    repos.push({
      name,
      fullName,
      description,
      language,
      stars,
      forks: 0,
      todayStars: 0,
      url: `https://github.com/${fullName}`,
    })
  }

  return repos
}

function isRepositoryPath(path: string): boolean {
  const [owner, repo, ...rest] = path.split('/')
  if (!owner || !repo || rest.length > 0) return false

  const reservedOwners = new Set([
    'account',
    'apps',
    'collections',
    'enterprise',
    'features',
    'github',
    'login',
    'marketplace',
    'new',
    'notifications',
    'orgs',
    'pricing',
    'search',
    'settings',
    'sponsors',
    'topics',
    'trending',
  ])

  return !reservedOwners.has(owner.toLowerCase())
}

function parseNumber(text: string): number {
  const cleaned = text.replace(/,/g, '').replace(/<[^>]+>/g, '').trim()
  const num = parseInt(cleaned, 10)
  return isNaN(num) ? 0 : num
}
