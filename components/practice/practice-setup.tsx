"use client"

import { BookOpen, AlertCircle } from "lucide-react"
import type {
  ArabicDirection,
  WordOrder,
  DefinitionDirection,
  QuestionTypeSetting,
} from "@/lib/types"
import type { PracticeConfig } from "@/lib/questions"
import { GroupSelector } from "@/components/group-selector"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const LENGTHS = [10, 20, 30, 0] as const

export function PracticeSetup({
  config,
  onConfigChange,
  length,
  onLengthChange,
  wordCount,
  order,
  onOrderChange,
  onStart,
}: {
  config: PracticeConfig
  onConfigChange: (c: PracticeConfig) => void
  length: number
  onLengthChange: (n: number) => void
  wordCount: number
  order: WordOrder
  onOrderChange: (v: WordOrder) => void
  onStart: () => void
}) {
  const canStart = wordCount > 0
  const effective = length === 0 ? wordCount : Math.min(length, wordCount)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Practice</h1>
        <p className="mt-1 text-muted-foreground">Test your knowledge with multiple-choice questions.</p>
      </div>

      <GroupSelector />

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Word order</h2>
        <RadioGroup className="mt-3 grid gap-2.5 sm:grid-cols-2" value={order} onValueChange={(v) => onOrderChange(v as WordOrder)}>
          <OptionRow value="in-order" id="practice-order" label="In order" checked={order === "in-order"} />
          <OptionRow value="random" id="practice-random" label="Random" checked={order === "random"} />
        </RadioGroup>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Question type</h2>
        <RadioGroup
          className="mt-3 grid gap-2.5 sm:grid-cols-3"
          value={config.type}
          onValueChange={(v) => {
            const type = v as QuestionTypeSetting
            onConfigChange({
              ...config,
              type,
              // Reset each direction to its neutral default whenever the question type
              // changes, so no incompatible direction selection can linger in state.
              definitionDirection: type === "definition" || type === "mixed" ? "mixed" : config.definitionDirection,
              arabicDirection: type === "arabic" || type === "mixed" ? "mixed" : config.arabicDirection,
            })
          }}
        >
          <OptionRow value="definition" id="type-def" label="Definition" desc="English word ↔ definition" checked={config.type === "definition"} />
          <OptionRow value="arabic" id="type-ar" label="Arabic translation" desc="English word ↔ Arabic" checked={config.type === "arabic"} />
          <OptionRow value="mixed" id="type-mixed" label="Mixed" desc="Both categories" checked={config.type === "mixed"} />
        </RadioGroup>

        {(config.type === "definition" || config.type === "mixed") && (
          <div className="mt-5">
            <h3 className="text-sm font-medium">Definition direction</h3>
            <RadioGroup
              className="mt-2.5 grid gap-2.5 sm:grid-cols-3"
              value={config.definitionDirection}
              onValueChange={(v) => onConfigChange({ ...config, definitionDirection: v as DefinitionDirection })}
            >
              <OptionRow value="word-def" id="dd-1" label="Word → Definition" checked={config.definitionDirection === "word-def"} />
              <OptionRow value="def-word" id="dd-2" label="Definition → Word" checked={config.definitionDirection === "def-word"} />
              <OptionRow value="mixed" id="dd-3" label="Mixed" checked={config.definitionDirection === "mixed"} />
            </RadioGroup>
          </div>
        )}

        {(config.type === "arabic" || config.type === "mixed") && (
          <div className="mt-5">
            <h3 className="text-sm font-medium">Arabic direction</h3>
            <RadioGroup
              className="mt-2.5 grid gap-2.5 sm:grid-cols-3"
              value={config.arabicDirection}
              onValueChange={(v) => onConfigChange({ ...config, arabicDirection: v as ArabicDirection })}
            >
              <OptionRow value="word-ar" id="ad-1" label="Word → Arabic" checked={config.arabicDirection === "word-ar"} />
              <OptionRow value="ar-word" id="ad-2" label="Arabic → Word" checked={config.arabicDirection === "ar-word"} />
              <OptionRow value="mixed" id="ad-3" label="Mixed" checked={config.arabicDirection === "mixed"} />
            </RadioGroup>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Number of questions</h2>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {LENGTHS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onLengthChange(n)}
              aria-pressed={length === n}
              className={cn(
                "rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                length === n
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-background hover:bg-secondary/50",
              )}
            >
              {n === 0 ? "All" : n}
            </button>
          ))}
        </div>
      </div>

      {!canStart && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
          <AlertCircle className="size-4 shrink-0" />
          Please select at least one group or your bookmarks to begin.
        </div>
      )}

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">{effective}</span> question
          {effective === 1 ? "" : "s"} from {wordCount} word{wordCount === 1 ? "" : "s"}
        </div>
        <Button size="lg" onClick={onStart} disabled={!canStart}>
          <BookOpen className="size-5" /> Start practice
        </Button>
      </div>
    </div>
  )
}

function OptionRow({
  value,
  id,
  label,
  desc,
  checked,
}: {
  value: string
  id: string
  label: string
  desc?: string
  checked: boolean
}) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors",
        checked ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-secondary/50",
      )}
    >
      <RadioGroupItem value={value} id={id} className="mt-0.5" />
      <span className="grid gap-0.5">
        <span className="text-sm font-medium leading-none">{label}</span>
        {desc && <span className="text-xs text-muted-foreground">{desc}</span>}
      </span>
    </Label>
  )
}
