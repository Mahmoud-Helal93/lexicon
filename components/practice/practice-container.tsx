"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ArrowLeft } from "lucide-react"
import type { Question, VocabWord } from "@/lib/types"
import { useStore } from "@/lib/store"
import { getWord, resolveWordSet, shuffle } from "@/lib/vocab"
import { buildQuestionSet, type PracticeConfig } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PracticeSetup } from "./practice-setup"
import { QuestionCard } from "./question-card"
import { PracticeResults, type AnswerRecord } from "./practice-results"

type Phase = "setup" | "session" | "results"

const DEFAULT_CONFIG: PracticeConfig = {
  type: "mixed",
  definitionDirection: "mixed",
  arabicDirection: "mixed",
}

export function PracticeContainer() {
  const { selection, state, hydrated, settings, setPracticeOrder, recordPracticeSession } = useStore()
  const [phase, setPhase] = useState<Phase>("setup")
  const [config, setConfig] = useState<PracticeConfig>(DEFAULT_CONFIG)
  const [length, setLength] = useState(20)

  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [chosenIndex, setChosenIndex] = useState<number | null>(null)
  const [records, setRecords] = useState<AnswerRecord[]>([])

  const selectedWords = useMemo(
    () => resolveWordSet(selection.groups, selection.includeBookmarks, state.bookmarks),
    [selection, state.bookmarks],
  )

  const beginSession = useCallback(
    (targetWords: VocabWord[], pool: VocabWord[]) => {
      const count = length === 0 ? targetWords.length : Math.min(length, targetWords.length)
      const orderedWords = settings.practiceOrder === "random" ? shuffle(targetWords) : targetWords
      const chosenWords = orderedWords.slice(0, count)
      const qs = buildQuestionSet(chosenWords, pool, config)
      setQuestions(qs)
      setIndex(0)
      setChosenIndex(null)
      setRecords([])
      setPhase("session")
    },
    [config, length, settings.practiceOrder],
  )

  const start = useCallback(() => {
    if (selectedWords.length === 0) return
    beginSession(selectedWords, selectedWords)
  }, [selectedWords, beginSession])

  const practiceMissed = useCallback(
    (wordIds: string[]) => {
      const missed = wordIds.map((id) => getWord(id)).filter((w): w is VocabWord => Boolean(w))
      if (missed.length === 0) return
      // Use the full selection as distractor pool so options stay plentiful.
      const pool = selectedWords.length >= 4 ? selectedWords : missed
      beginSession(missed, pool)
    },
    [selectedWords, beginSession],
  )

  const answered = chosenIndex !== null
  const current = questions[index]

  const selectAnswer = useCallback(
    (i: number) => {
      if (chosenIndex !== null || !current) return
      setChosenIndex(i)
      setRecords((prev) => [
        ...prev,
        { question: current, chosenIndex: i, correct: i === current.correctIndex },
      ])
    },
    [chosenIndex, current],
  )

  const next = useCallback(() => {
    if (index + 1 >= questions.length) {
      const correct = records.filter((r) => r.correct).length
      recordPracticeSession(records.length, correct)
      setPhase("results")
    } else {
      setIndex((i) => i + 1)
      setChosenIndex(null)
    }
  }, [index, questions.length, records, recordPracticeSession])

  // Keyboard shortcuts
  useEffect(() => {
    if (phase !== "session") return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return
      if (!answered && ["1", "2", "3", "4"].includes(e.key)) {
        const i = Number(e.key) - 1
        if (current && i < current.options.length) {
          e.preventDefault()
          selectAnswer(i)
        }
      } else if (answered && e.key === "Enter") {
        e.preventDefault()
        next()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [phase, answered, current, selectAnswer, next])

  if (!hydrated) {
    return <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6" />
  }

  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-10">
        <PracticeSetup
          config={config}
          onConfigChange={setConfig}
          length={length}
          onLengthChange={setLength}
          wordCount={selectedWords.length}
          order={settings.practiceOrder}
          onOrderChange={setPracticeOrder}
          onStart={start}
        />
      </div>
    )
  }

  if (phase === "results") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-10">
        <PracticeResults
          records={records}
          onPracticeAgain={start}
          onPracticeMissed={practiceMissed}
          onBackToSetup={() => setPhase("setup")}
        />
      </div>
    )
  }

  if (phase === "session" && current) {
    const progressPct = Math.round((index / questions.length) * 100)
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setPhase("setup")}>
            <ArrowLeft className="size-4" /> Exit
          </Button>
          <span className="text-sm text-muted-foreground">
            Question <span className="font-semibold text-foreground tabular-nums">{index + 1}</span> of{" "}
            <span className="tabular-nums">{questions.length}</span>
          </span>
        </div>
        <Progress value={progressPct} className="mb-6 h-2" />
        <QuestionCard
          key={current.id}
          question={current}
          chosenIndex={chosenIndex}
          answered={answered}
          onSelect={selectAnswer}
          onNext={next}
          isLast={index + 1 >= questions.length}
        />
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Press <kbd className="rounded bg-secondary px-1.5 py-0.5">1</kbd>–
          <kbd className="rounded bg-secondary px-1.5 py-0.5">4</kbd> to answer,{" "}
          <kbd className="rounded bg-secondary px-1.5 py-0.5">Enter</kbd> to continue.
        </p>
      </div>
    )
  }

  return null
}
