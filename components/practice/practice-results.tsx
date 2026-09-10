"use client"

import Link from "next/link"
import { RotateCw, Target, GraduationCap, Bookmark, ArrowLeft, Check, X } from "lucide-react"
import type { Question } from "@/lib/types"
import { getWord } from "@/lib/vocab"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface AnswerRecord {
  question: Question
  chosenIndex: number
  correct: boolean
}

export function PracticeResults({
  records,
  onPracticeAgain,
  onPracticeMissed,
  onBackToSetup,
}: {
  records: AnswerRecord[]
  onPracticeAgain: () => void
  onPracticeMissed: (wordIds: string[]) => void
  onBackToSetup: () => void
}) {
  const { addBookmarks, isBookmarked } = useStore()
  const total = records.length
  const correct = records.filter((r) => r.correct).length
  const pct = total ? Math.round((correct / total) * 100) : 0

  const byCat = (cat: "definition" | "arabic") => {
    const items = records.filter((r) => r.question.category === cat)
    return { correct: items.filter((r) => r.correct).length, total: items.length }
  }
  const def = byCat("definition")
  const ar = byCat("arabic")

  const missedIds = Array.from(new Set(records.filter((r) => !r.correct).map((r) => r.question.wordId)))
  const allMissedBookmarked = missedIds.length > 0 && missedIds.every((id) => isBookmarked(id))

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="rounded-3xl border border-border bg-card p-8 text-center sm:p-10">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-primary/12 text-primary">
          <Target className="size-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Practice complete</h2>
        <div className="mt-4 text-5xl font-bold tabular-nums tracking-tight">
          {correct}
          <span className="text-2xl font-normal text-muted-foreground"> / {total}</span>
        </div>
        <div className="mt-1 text-lg font-semibold text-primary tabular-nums">{pct}%</div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {def.total > 0 && (
            <div className="rounded-xl bg-secondary/60 px-4 py-4">
              <div className="text-xl font-semibold tabular-nums">
                {def.correct} / {def.total}
              </div>
              <div className="text-xs text-muted-foreground">Definition</div>
            </div>
          )}
          {ar.total > 0 && (
            <div className="rounded-xl bg-secondary/60 px-4 py-4">
              <div className="text-xl font-semibold tabular-nums">
                {ar.correct} / {ar.total}
              </div>
              <div className="text-xs text-muted-foreground">Arabic</div>
            </div>
          )}
        </div>

        <div className="mt-7 flex flex-col gap-2.5">
          <Button size="lg" onClick={onPracticeAgain}>
            <RotateCw className="size-5" /> Practice again
          </Button>
          {missedIds.length > 0 && (
            <Button size="lg" variant="outline" onClick={() => onPracticeMissed(missedIds)}>
              <Target className="size-5" /> Practice missed words ({missedIds.length})
            </Button>
          )}
          <Button asChild size="lg" variant="outline">
            <Link href="/study">
              <GraduationCap className="size-5" /> Study these words
            </Link>
          </Button>
          {missedIds.length > 0 && (
            <Button
              size="lg"
              variant="ghost"
              disabled={allMissedBookmarked}
              onClick={() => addBookmarks(missedIds)}
            >
              <Bookmark className="size-5" />
              {allMissedBookmarked ? "Missed words bookmarked" : "Bookmark missed words"}
            </Button>
          )}
          <Button size="lg" variant="ghost" onClick={onBackToSetup}>
            <ArrowLeft className="size-5" /> Back to setup
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Review</h3>
        <ul className="divide-y divide-border">
          {records.map((r, i) => {
            const word = getWord(r.question.wordId)
            if (!word) return null
            return (
              <li key={i} className="flex items-center gap-3 py-3">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full",
                    r.correct
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-destructive/15 text-destructive",
                  )}
                >
                  {r.correct ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                </span>
                <span className="flex-1 font-medium">{word.word}</span>
                <span className="text-arabic text-sm text-muted-foreground" lang="ar">
                  {word.arabicTranslation}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
