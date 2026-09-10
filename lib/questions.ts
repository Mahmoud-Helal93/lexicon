import type {
  ArabicDirection,
  DefinitionDirection,
  Question,
  QuestionCategory,
  QuestionDirection,
  QuestionOption,
  QuestionTypeSetting,
  VocabWord,
} from "./types"
import { shuffle } from "./vocab"

export interface PracticeConfig {
  type: QuestionTypeSetting
  definitionDirection: DefinitionDirection
  arabicDirection: ArabicDirection
}

let qSeq = 0

function pickCategory(config: PracticeConfig): QuestionCategory {
  if (config.type === "mixed") return Math.random() < 0.5 ? "definition" : "arabic"
  return config.type
}

function pickDirection(config: PracticeConfig, category: QuestionCategory): QuestionDirection {
  if (category === "definition") {
    const d = config.definitionDirection
    if (d === "mixed") return Math.random() < 0.5 ? "word-def" : "def-word"
    return d === "word-def" ? "word-def" : "def-word"
  }
  const a = config.arabicDirection
  if (a === "mixed") return Math.random() < 0.5 ? "word-ar" : "ar-word"
  return a === "word-ar" ? "word-ar" : "ar-word"
}

/** Choose up to `count` distractor words, preferring same-group words. */
function pickDistractors(
  target: VocabWord,
  pool: VocabWord[],
  count: number,
  answerText: (w: VocabWord) => string,
): VocabWord[] {
  const correct = answerText(target)
  const usableTexts = new Set<string>([correct])
  const eligible = pool.filter((w) => {
    if (w.id === target.id) return false
    const t = answerText(w)
    if (usableTexts.has(t)) return false // avoid duplicate answer text
    return true
  })

  const sameGroup = shuffle(eligible.filter((w) => w.group === target.group))
  const otherGroups = shuffle(eligible.filter((w) => w.group !== target.group))
  const ordered = [...sameGroup, ...otherGroups]

  const chosen: VocabWord[] = []
  for (const w of ordered) {
    const t = answerText(w)
    if (usableTexts.has(t)) continue
    usableTexts.add(t)
    chosen.push(w)
    if (chosen.length >= count) break
  }
  return chosen
}

export function buildQuestion(target: VocabWord, pool: VocabWord[], config: PracticeConfig): Question {
  const category = pickCategory(config)
  const direction = pickDirection(config, category)

  let prompt: string
  let promptIsArabic = false
  let answerText: (w: VocabWord) => string
  let optionIsArabic = false

  switch (direction) {
    case "word-def":
      prompt = target.word
      answerText = (w) => w.definition
      break
    case "def-word":
      prompt = target.definition
      answerText = (w) => w.word
      break
    case "word-ar":
      prompt = target.word
      answerText = (w) => w.arabicTranslation
      optionIsArabic = true
      break
    case "ar-word":
      prompt = target.arabicTranslation
      promptIsArabic = true
      answerText = (w) => w.word
      break
  }

  const distractors = pickDistractors(target, pool, 3, answerText)
  const correctOption: QuestionOption = { text: answerText(target), isArabic: optionIsArabic, wordId: target.id }
  const distractorOptions: QuestionOption[] = distractors.map((w) => ({
    text: answerText(w),
    isArabic: optionIsArabic,
    wordId: w.id,
  }))

  const options = shuffle([correctOption, ...distractorOptions])
  const correctIndex = options.findIndex((o) => o.wordId === target.id)

  return {
    id: `q-${qSeq++}`,
    wordId: target.id,
    category,
    direction,
    prompt,
    promptIsArabic,
    options,
    correctIndex,
  }
}

/** Generate one question per word, shuffled. */
export function buildQuestionSet(words: VocabWord[], pool: VocabWord[], config: PracticeConfig): Question[] {
  const order = shuffle(words)
  return order.map((w) => buildQuestion(w, pool, config))
}
