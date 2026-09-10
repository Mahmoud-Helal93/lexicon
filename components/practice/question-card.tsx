"use client"

import { Check, X, ArrowRight } from "lucide-react"
import type { Question } from "@/lib/types"
import { getWord } from "@/lib/vocab"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookmarkButton } from "@/components/bookmark-button"
import { AnswerOption } from "./answer-option"

const PROMPT_LABEL: Record<Question["direction"], string> = {
  "word-def": "What is the definition?",
  "def-word": "Which word matches this definition?",
  "word-ar": "ما الترجمة العربية؟",
  "ar-word": "Which English word matches this translation?",
}

export function QuestionCard({
  question,
  chosenIndex,
  answered,
  onSelect,
  onNext,
  isLast,
}: {
  question: Question
  chosenIndex: number | null
  answered: boolean
  onSelect: (i: number) => void
  onNext: () => void
  isLast: boolean
}) {
  const word = getWord(question.wordId)
  const correct = answered && chosenIndex === question.correctIndex
  const label = PROMPT_LABEL[question.direction]
  const labelIsArabic = question.direction === "word-ar"

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-7 shadow-lg shadow-foreground/5 ring-1 ring-border/30 sm:p-10">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          {question.category === "definition" ? "Definition" : "Arabic translation"}
        </span>
        {word && <BookmarkButton wordId={word.id} size="sm" />}
      </div>

      <div className="mt-8 text-center">
        <p
          className={cn(
            "font-bold tracking-tight text-balance",
            question.promptIsArabic
              ? "text-arabic text-4xl text-primary sm:text-6xl"
              : "text-3xl sm:text-5xl",
          )}
          lang={question.promptIsArabic ? "ar" : undefined}
        >
          {question.prompt}
        </p>
        <p className={cn("mt-3 text-sm text-muted-foreground", labelIsArabic && "text-arabic text-base")} lang={labelIsArabic ? "ar" : undefined}>
          {label}
        </p>
      </div>

      <div className="mt-9 grid gap-3" role="listbox" aria-label="Answer choices">
        {question.options.map((opt, i) => (
          <AnswerOption
            key={i}
            option={opt}
            index={i}
            answered={answered}
            isCorrect={i === question.correctIndex}
            isChosen={i === chosenIndex}
            onSelect={() => onSelect(i)}
          />
        ))}
      </div>

      {answered && word && (
        <div
          className={cn(
            "mt-6 rounded-2xl border p-5",
            correct
              ? "border-emerald-500/40 bg-emerald-500/8"
              : "border-destructive/40 bg-destructive/8",
          )}
        >
          <div className="flex items-center gap-2 font-semibold">
            {correct ? (
              <>
                <Check className="size-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400">Correct</span>
              </>
            ) : (
              <>
                <X className="size-5 text-destructive" />
                <span className="text-destructive">Incorrect</span>
              </>
            )}
          </div>
          <div className="mt-3 flex flex-col items-start gap-1">
            <span className="text-lg font-bold">{word.word}</span>
            <span className="text-arabic text-lg font-medium text-primary" lang="ar">
              {word.arabicTranslation}
            </span>
            <span className="text-sm text-muted-foreground text-pretty">{word.definition}</span>
          </div>
          <Button className="mt-5 w-full sm:w-auto" size="lg" onClick={onNext} autoFocus>
            {isLast ? "See results" : "Next question"} <ArrowRight className="size-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
