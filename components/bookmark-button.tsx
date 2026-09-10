"use client"

import { Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"

export function BookmarkButton({
  wordId,
  size = "md",
  className,
}: {
  wordId: string
  size?: "sm" | "md"
  className?: string
}) {
  const { isBookmarked, toggleBookmark } = useStore()
  const active = isBookmarked(wordId)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        toggleBookmark(wordId)
      }}
      aria-pressed={active}
      aria-label={active ? "Remove bookmark" : "Bookmark this word"}
      title={active ? "Remove bookmark" : "Bookmark this word"}
      className={cn(
        "inline-flex items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        size === "md" ? "size-10" : "size-8",
        active
          ? "border-amber-300 bg-amber-100 text-amber-600 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-400"
          : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground",
        className,
      )}
    >
      <Bookmark className={cn(size === "md" ? "size-5" : "size-4", active && "fill-current")} />
    </button>
  )
}
