"use client"

import { Check, X } from "lucide-react"
import type { QuestionOption } from "@/lib/types"
import { cn } from "@/lib/utils"

export function AnswerOption({
  option,
  index,
  answered,
  isCorrect,
  isChosen,
  onSelect,
}: {
  option: QuestionOption
  index: number
  answered: boolean
  isCorrect: boolean
  isChosen: boolean
  onSelect: () => void
}) {
  const showCorrect = answered && isCorrect
  const showWrong = answered && isChosen && !isCorrect

  return (
    <button
      type="button"
      disabled={answered}
      onClick={onSelect}
      aria-label={`Option ${index + 1}: ${option.text}`}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
        !answered && "border-border bg-background hover:border-primary/50 hover:bg-secondary/50",
        showCorrect && "border-emerald-500 bg-emerald-500/10",
        showWrong && "border-destructive bg-destructive/10",
        answered && !showCorrect && !showWrong && "border-border bg-background opacity-60",
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md border text-sm font-semibold tabular-nums",
          showCorrect && "border-emerald-500 bg-emerald-500 text-white",
          showWrong && "border-destructive bg-destructive text-white",
          !showCorrect && !showWrong && "border-border text-muted-foreground",
        )}
      >
        {showCorrect ? <Check className="size-4" /> : showWrong ? <X className="size-4" /> : index + 1}
      </span>
      <span
        className={cn("flex-1 text-pretty", option.isArabic ? "text-arabic text-lg font-medium" : "text-[15px]")}
        lang={option.isArabic ? "ar" : undefined}
      >
        {option.text}
      </span>
    </button>
  )
}
