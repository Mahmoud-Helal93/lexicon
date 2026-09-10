"use client"

import { GraduationCap, AlertCircle } from "lucide-react"
import { GroupSelector } from "@/components/group-selector"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { WordOrder } from "@/lib/types"

export function StudySetup({
  includeMastered,
  onIncludeMasteredChange,
  wordCount,
  masteredInSelection,
  order,
  onOrderChange,
  onStart,
}: {
  includeMastered: boolean
  onIncludeMasteredChange: (v: boolean) => void
  wordCount: number
  masteredInSelection: number
  order: WordOrder
  onOrderChange: (v: WordOrder) => void
  onStart: () => void
}) {
  const effective = includeMastered ? wordCount : wordCount - masteredInSelection
  const canStart = effective > 0

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Study</h1>
        <p className="mt-1 text-muted-foreground">
          Flip through flashcards and mark each word Known or Unknown.
        </p>
      </div>

      <GroupSelector />

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Word order</h2>
        <RadioGroup className="mt-3 grid gap-2.5 sm:grid-cols-2" value={order} onValueChange={(v) => onOrderChange(v as WordOrder)}>
          <Label htmlFor="study-order" className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-3.5 py-3">
            <RadioGroupItem value="in-order" id="study-order" /> In order
          </Label>
          <Label htmlFor="study-random" className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-3.5 py-3">
            <RadioGroupItem value="random" id="study-random" /> Random
          </Label>
        </RadioGroup>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <Checkbox
            id="include-mastered"
            checked={includeMastered}
            onCheckedChange={(v) => onIncludeMasteredChange(v === true)}
            className="mt-0.5"
          />
          <div className="grid gap-0.5">
            <Label htmlFor="include-mastered" className="cursor-pointer text-sm font-medium">
              Include mastered words
            </Label>
            <p className="text-sm text-muted-foreground">
              {masteredInSelection > 0
                ? `${masteredInSelection} word${masteredInSelection === 1 ? "" : "s"} in this selection ${
                    masteredInSelection === 1 ? "is" : "are"
                  } already mastered.`
                : "None of the selected words are mastered yet."}
            </p>
          </div>
        </div>
      </div>

      {!canStart && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
          <AlertCircle className="size-4 shrink-0" />
          {wordCount === 0
            ? "Please select at least one group or your bookmarks to begin."
            : "All selected words are mastered. Enable “Include mastered words” to study them again."}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="text-sm text-muted-foreground">
          Ready to study <span className="font-semibold text-foreground tabular-nums">{effective}</span> word
          {effective === 1 ? "" : "s"}
        </div>
        <Button size="lg" onClick={onStart} disabled={!canStart}>
          <GraduationCap className="size-5" /> Start studying
        </Button>
      </div>
    </div>
  )
}
