"use client"

import { GraduationCap, AlertCircle } from "lucide-react"
import { GroupSelector } from "@/components/group-selector"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function StudySetup({
  includeMastered,
  onIncludeMasteredChange,
  wordCount,
  masteredInSelection,
  onStart,
}: {
  includeMastered: boolean
  onIncludeMasteredChange: (v: boolean) => void
  wordCount: number
  masteredInSelection: number
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
