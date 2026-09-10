import type { VocabWord } from "./types"
import { shuffle } from "./vocab"

/** Number of other words that must pass before an "Unknown" word returns. */
export const REPEAT_GAP = 5

export interface StudySession {
  /** Active queue of word ids; index 0 is the current card. */
  queue: string[]
  /** Total distinct words in this study cycle. */
  total: number
  /** Ids marked Known during this session (mastered). */
  masteredIds: string[]
  /** Count of Known button presses. */
  knownMarks: number
  /** Count of Unknown button presses (repeats scheduled). */
  repeats: number
  /** Ids currently awaiting repetition (marked Unknown, not yet Known). */
  inReview: string[]
}

export function createStudySession(words: VocabWord[]): StudySession {
  return {
    queue: shuffle(words.map((w) => w.id)),
    total: words.length,
    masteredIds: [],
    knownMarks: 0,
    repeats: 0,
    inReview: [],
  }
}

/** Word is mastered: drop it from the active queue permanently for this cycle. */
export function markKnown(session: StudySession): StudySession {
  if (session.queue.length === 0) return session
  const [current, ...rest] = session.queue
  return {
    ...session,
    queue: rest,
    masteredIds: session.masteredIds.includes(current) ? session.masteredIds : [...session.masteredIds, current],
    knownMarks: session.knownMarks + 1,
    inReview: session.inReview.filter((id) => id !== current),
  }
}

/** Word is unknown: reinsert it so it reappears after REPEAT_GAP other words. */
export function markUnknown(session: StudySession): StudySession {
  if (session.queue.length === 0) return session
  const [current, ...rest] = session.queue
  const insertAt = Math.min(REPEAT_GAP, rest.length)
  const next = rest.slice()
  next.splice(insertAt, 0, current)
  return {
    ...session,
    queue: next,
    // if it was previously counted as mastered (unlikely) remove it
    masteredIds: session.masteredIds.filter((id) => id !== current),
    repeats: session.repeats + 1,
    inReview: session.inReview.includes(current) ? session.inReview : [...session.inReview, current],
  }
}

export function currentWordId(session: StudySession): string | null {
  return session.queue[0] ?? null
}

export function isComplete(session: StudySession): boolean {
  return session.queue.length === 0
}

/** Words waiting to be mastered (unique ids left in queue). */
export function remainingCount(session: StudySession): number {
  return new Set(session.queue).size
}
