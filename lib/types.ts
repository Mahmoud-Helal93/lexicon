export interface VocabWord {
  id: string
  group: number
  word: string
  definition: string
  arabicTranslation: string
}

export type QuestionCategory = "definition" | "arabic"
export type QuestionTypeSetting = "definition" | "arabic" | "mixed"
export type DefinitionDirection = "word-def" | "def-word" | "mixed"
export type ArabicDirection = "word-ar" | "ar-word" | "mixed"

/** A concrete direction for a single generated question. */
export type QuestionDirection = "word-def" | "def-word" | "word-ar" | "ar-word"

export interface Question {
  id: string
  wordId: string
  category: QuestionCategory
  direction: QuestionDirection
  prompt: string
  promptIsArabic: boolean
  options: QuestionOption[]
  correctIndex: number
}

export interface QuestionOption {
  text: string
  isArabic: boolean
  wordId: string
}

export interface PersistedState {
  bookmarks: string[]
  masteredWords: string[]
  studyStats: {
    sessionsCompleted: number
    totalKnownMarks: number
    totalRepeats: number
    lastStudied: string | null
  }
  practiceStats: {
    sessionsCompleted: number
    totalAnswered: number
    totalCorrect: number
    lastPracticed: string | null
  }
}
