import rawWords from "./words.json"
import type { VocabWord } from "./types"

export const WORDS: VocabWord[] = rawWords as VocabWord[]

export const WORD_BY_ID: Map<string, VocabWord> = new Map(WORDS.map((w) => [w.id, w]))

export const GROUPS: number[] = Array.from(new Set(WORDS.map((w) => w.group))).sort((a, b) => a - b)

export const GROUP_COUNTS: Record<number, number> = WORDS.reduce(
  (acc, w) => {
    acc[w.group] = (acc[w.group] ?? 0) + 1
    return acc
  },
  {} as Record<number, number>,
)

export const TOTAL_WORDS = WORDS.length

export function getWord(id: string): VocabWord | undefined {
  return WORD_BY_ID.get(id)
}

export function wordsForGroups(groups: number[]): VocabWord[] {
  if (groups.length === 0) return []
  const set = new Set(groups)
  return WORDS.filter((w) => set.has(w.group))
}

/**
 * Resolve the active word set from selected groups and/or bookmarked words,
 * de-duplicating so a bookmarked word that also lives in a selected group
 * appears only once.
 */
export function resolveWordSet(groups: number[], includeBookmarks: boolean, bookmarkIds: string[]): VocabWord[] {
  const map = new Map<string, VocabWord>()
  for (const w of wordsForGroups(groups)) map.set(w.id, w)
  if (includeBookmarks) {
    for (const id of bookmarkIds) {
      const w = WORD_BY_ID.get(id)
      if (w) map.set(w.id, w)
    }
  }
  return Array.from(map.values())
}

/** Fisher–Yates shuffle returning a new array. */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
