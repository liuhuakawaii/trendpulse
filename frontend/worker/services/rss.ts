import type { NewsItem } from '../types'

const RSS_SOURCES: Record<string, string[]> = {
  tech: [
    'https://hnrss.org/frontpage',
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
  ],
  aiml: [
    'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml',
    'https://www.deeplearning.ai/the-batch/feed/',
    'https://rss.arxiv.org/rss/cs.AI',
  ],
  programming: [
    'https://dev.to/feed',
    'https://css-tricks.com/feed/',
    'https://www.smashingmagazine.com/feed/',
  ],
  business: [
    'https://feeds.reuters.com/reuters/businessNews',
    'https://feeds.bbci.co.uk/news/business/rss.xml',
  ],
  science: [
    'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
    'https://www.sciencedaily.com/rss/all.xml',
  ],
  gaming: [
    'https://feeds.feedburner.com/ign/all',
    'https://kotaku.com/rss',
    'https://www.polygon.com/rss/index.xml',
  ],
  finance: [
    'https://www.coindesk.com/arc/outboundfeeds/rss/',
    'https://techcrunch.com/category/cryptocurrency/feed/',
  ],
  world: [
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    'https://feeds.reuters.com/reuters/worldNews',
  ],
  health: [
    'https://feeds.bbci.co.uk/news/health/rss.xml',
    'https://www.medicalnewstoday.com/newsfeeds/rss',
  ],
}

export async function fetchNews(category: string): Promise<NewsItem[]> {
  if (category === 'showhn') return fetchShowHN()

  const sources = RSS_SOURCES[category]
  if (!sources) return []

  const results = await Promise.allSettled(
    sources.map((url) => fetchSingleRSS(url, category))
  )

  const items: NewsItem[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') {
      items.push(...r.value)
    }
  }

  return items
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 20)
}

async function fetchShowHN(): Promise<NewsItem[]> {
  const items = await fetchSingleRSS('https://hnrss.org/frontpage', 'showhn')
  return items
    .filter((item) => item.link.includes('github.com'))
    .slice(0, 20)
}

async function fetchSingleRSS(url: string, category: string): Promise<NewsItem[]> {
  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TrendPulse/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
      redirect: 'follow',
    })
    const text = await resp.text()
    return parseRSS(text, category, url)
  } catch {
    return []
  }
}

function parseRSS(xml: string, category: string, sourceUrl: string): NewsItem[] {
  const items: NewsItem[] = []
  const sourceName = new URL(sourceUrl).hostname.replace('www.', '').split('.')[0]

  // RSS 2.0 items
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match: RegExpExecArray | null

  while ((match = itemRegex.exec(xml)) !== null && items.length < 10) {
    const block = match[1]

    const title = extractTag(block, 'title')
    const link = extractTag(block, 'link')
    const description = stripHTML(extractTag(block, 'description') || extractTag(block, 'summary') || '')
    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'published') || new Date().toISOString()

    if (title) {
      items.push({
        title,
        description: description.slice(0, 300),
        link: link || '#',
        pubDate,
        source: sourceName,
        category,
      })
    }
  }

  // Atom entries fallback
  if (items.length === 0) {
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
    while ((match = entryRegex.exec(xml)) !== null && items.length < 10) {
      const block = match[1]

      const title = extractTag(block, 'title')
      const linkMatch = block.match(/<link[^>]*?href="([^"]*?)"/)
      const link = linkMatch ? linkMatch[1] : ''
      const description = stripHTML(extractTag(block, 'summary') || extractTag(block, 'content') || '')
      const pubDate = extractTag(block, 'published') || extractTag(block, 'updated') || new Date().toISOString()

      if (title) {
        items.push({
          title,
          description: description.slice(0, 300),
          link: link || '#',
          pubDate,
          source: sourceName,
          category,
        })
      }
    }
  }

  return items
}

function extractTag(xml: string, tag: string): string {
  // Handle CDATA
  const cdataRegex = new RegExp(`<${tag}[^>]*?>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>)?([\\s\\S]*?)<\\/${tag}>`, 'i')
  const cdataMatch = xml.match(cdataRegex)
  if (cdataMatch) {
    return (cdataMatch[1] || cdataMatch[2] || '').trim()
  }
  return ''
}

function stripHTML(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
