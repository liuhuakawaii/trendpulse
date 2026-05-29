interface TranslateItem {
  id: string
  title?: string
  description?: string
}

interface TranslatedItem {
  id: string
  title?: string
  description?: string
}

interface AIBinding {
  run: (model: string, params: Record<string, unknown>) => Promise<{ translated_text: string }>
}

export async function translateText(ai: AIBinding, text: string): Promise<string> {
  const result = await ai.run('@cf/meta/m2m100-1.2b', {
    text,
    source_lang: 'English',
    target_lang: 'Chinese',
  })
  return result.translated_text
}

export async function translateBatch(
  ai: AIBinding,
  items: TranslateItem[]
): Promise<TranslatedItem[]> {
  const tasks = items.flatMap((item) => [
    item.title
      ? translateText(ai, item.title).then(
          (t) => ({ type: 'title' as const, id: item.id, text: t }),
          () => ({ type: 'title' as const, id: item.id, text: null })
        )
      : Promise.resolve({ type: 'title' as const, id: item.id, text: null }),
    item.description
      ? translateText(ai, item.description).then(
          (t) => ({ type: 'description' as const, id: item.id, text: t }),
          () => ({ type: 'description' as const, id: item.id, text: null })
        )
      : Promise.resolve({ type: 'description' as const, id: item.id, text: null }),
  ])

  const results = await Promise.all(tasks)

  const map = new Map<string, TranslatedItem>()
  for (const item of items) {
    map.set(item.id, { id: item.id })
  }

  for (const result of results) {
    const entry = map.get(result.id)
    if (!entry) continue
    if (result.type === 'title' && result.text) {
      entry.title = result.text
    } else if (result.type === 'description' && result.text) {
      entry.description = result.text
    }
  }

  return Array.from(map.values())
}
