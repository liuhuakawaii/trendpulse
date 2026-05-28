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
