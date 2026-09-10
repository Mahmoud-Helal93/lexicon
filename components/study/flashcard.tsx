"use client"

import { Check, X, RotateCcw } from "lucide-react"
import type { VocabWord } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookmarkButton } from "@/components/bookmark-button"

export function Flashcard({
  word,
  flipped,
  onFlip,
  onKnown,
  onUnknown,
}: {
  word: VocabWord
  flipped: boolean
  onFlip: () => void
  onKnown: () => void
  onUnknown: () => void
}) {
  return (
    <div className="w-full">
      <div className="flip-card w-full">
        <div className={cn("flip-inner min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]", flipped && "is-flipped")}>
          {/* Front — the English word */}
          <div
            role="button"
            tabIndex={0}
            onClick={onFlip}
            onKeyDown={(e) => {
              if (e.key === "Enter") onFlip()
            }}
            aria-label="Reveal definition and translation"
            className="flip-face flex w-full cursor-pointer flex-col items-center justify-center rounded-[2rem] border border-border/80 bg-card p-8 text-center shadow-xl shadow-foreground/5 ring-1 ring-border/30 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-12"
          >
            <div className="absolute inset-x-6 top-6 flex items-center justify-between">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                Group {word.group}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Study
              </span>
            </div>
            <span className="text-5xl font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              {word.word}
            </span>
            <span className="absolute inset-x-0 bottom-7 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <RotateCcw className="size-4" />
              Click or press <kbd className="rounded bg-secondary px-1.5 py-0.5 text-xs">Space</kbd> to reveal
            </span>
          </div>

          {/* Back — definition & Arabic translation */}
          <div
            role="button"
            tabIndex={flipped ? 0 : -1}
            onClick={onFlip}
            onKeyDown={(e) => {
              if (e.key === "Enter") onFlip()
            }}
            aria-label="Show word"
            className="flip-back flip-face flex w-full cursor-pointer flex-col justify-center rounded-[2rem] border border-border/80 bg-card p-8 text-center shadow-xl shadow-foreground/5 ring-1 ring-border/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-12"
          >
            <div className="absolute right-6 top-6" onClick={(e) => e.stopPropagation()}>
              <BookmarkButton wordId={word.id} />
            </div>

            <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Word</p>
                <p className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{word.word}</p>
              </div>

              <div className="h-px w-full bg-border" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Arabic</p>
                <p className="text-arabic mt-1 text-3xl font-semibold text-primary sm:text-4xl" lang="ar">
                  {word.arabicTranslation}
                </p>
              </div>

              <div className="h-px w-full bg-border" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Definition</p>
                <p className="mt-1 text-lg leading-relaxed text-foreground/90 text-pretty sm:text-xl">
                  {word.definition}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Known / Unknown controls */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
        <Button
          size="lg"
          variant="outline"
          onClick={onUnknown}
          className="h-16 border-destructive/40 text-base font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive sm:text-lg"
        >
          <X className="size-5" /> Unknown
          <kbd className="ml-1 hidden rounded bg-destructive/10 px-1.5 py-0.5 text-xs sm:inline">U</kbd>
        </Button>
        <Button
          size="lg"
          onClick={onKnown}
          disabled={!flipped}
          className="h-16 bg-success text-base font-semibold text-success-foreground hover:bg-success/90 sm:text-lg"
        >
          <Check className="size-5" /> Known
          <kbd className="ml-1 hidden rounded bg-black/10 px-1.5 py-0.5 text-xs sm:inline">K</kbd>
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {flipped ? "Mark whether you knew this word." : "Reveal the card, then mark Known or Unknown."}
      </p>
    </div>
  )
}
