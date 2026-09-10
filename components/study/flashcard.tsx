"use client"

import { RotateCw, Check, X } from "lucide-react"
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
    <div className="flex flex-col items-center">
      <div className="flip-card relative w-full">
        <div
          role="button"
          tabIndex={0}
          aria-label={flipped ? "Card revealed. Press space to flip back." : `Flashcard: ${word.word}. Press space to reveal.`}
          onClick={onFlip}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              onFlip()
            }
          }}
          className="group block h-96 w-full cursor-pointer select-none focus-visible:outline-none sm:h-[28rem]"
        >
          <div className={cn("flip-inner h-full w-full rounded-3xl", flipped && "is-flipped")}>
            {/* Front */}
            <div className="flip-face flex h-full w-full flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 shadow-sm ring-1 ring-transparent transition-shadow group-focus-visible:ring-ring">
              <span className="absolute right-4 top-4">
                <BookmarkButton wordId={word.id} />
              </span>
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Group {word.group}</span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{word.word}</h2>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <RotateCw className="size-4" /> Click or press Space to reveal
              </span>
            </div>

            {/* Back */}
            <div className="flip-face flip-back flex h-full w-full flex-col items-center justify-center gap-3 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/8 via-card to-accent/25 p-8 shadow-sm">
              <span className="absolute right-4 top-4">
                <BookmarkButton wordId={word.id} />
              </span>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{word.word}</h3>
              <p className="text-arabic text-2xl font-semibold text-primary sm:text-3xl" lang="ar">
                {word.arabicTranslation}
              </p>
              <p className="max-w-md text-pretty text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
                {word.definition}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
          disabled={!flipped}
          onClick={onUnknown}
          className="h-14 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
        >
          <X className="size-5" /> Unknown
          <kbd className="ml-1 hidden rounded bg-destructive/10 px-1.5 py-0.5 text-[11px] font-medium sm:inline">U</kbd>
        </Button>
        <Button
          size="lg"
          disabled={!flipped}
          onClick={onKnown}
          className="h-14 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40"
        >
          <Check className="size-5" /> Known
          <kbd className="ml-1 hidden rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-medium sm:inline">K</kbd>
        </Button>
      </div>
      {!flipped && (
        <p className="mt-3 text-xs text-muted-foreground">Reveal the card to mark it Known or Unknown.</p>
      )}
    </div>
  )
}
