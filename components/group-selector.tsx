"use client"

import { useMemo } from "react"
import { Bookmark, Check } from "lucide-react"
import { GROUPS, GROUP_COUNTS, resolveWordSet } from "@/lib/vocab"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function GroupSelector() {
  const { selection, setSelection, state } = useStore()

  const selectedCount = useMemo(
    () => resolveWordSet(selection.groups, selection.includeBookmarks, state.bookmarks).length,
    [selection, state.bookmarks],
  )

  const groupSet = new Set(selection.groups)

  const toggleGroup = (g: number) => {
    const next = new Set(groupSet)
    if (next.has(g)) next.delete(g)
    else next.add(g)
    setSelection({ ...selection, groups: Array.from(next).sort((a, b) => a - b) })
  }

  const selectAll = () => setSelection({ ...selection, groups: [...GROUPS] })
  const clearAll = () => setSelection({ ...selection, groups: [] })
  const toggleBookmarks = () => setSelection({ ...selection, includeBookmarks: !selection.includeBookmarks })

  const sourceCount = selection.groups.length + (selection.includeBookmarks ? 1 : 0)

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Select vocabulary</h2>
          <p className="text-sm text-muted-foreground">Choose groups, bookmarks, or a combination.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {GROUPS.map((g) => {
          const active = groupSet.has(g)
          return (
            <button
              key={g}
              type="button"
              onClick={() => toggleGroup(g)}
              aria-pressed={active}
              className={cn(
                "flex items-center justify-between rounded-xl border px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-background hover:border-primary/40 hover:bg-secondary/50",
              )}
            >
              <span>
                <span className="block text-sm font-semibold">Group {g}</span>
                <span className="block text-xs text-muted-foreground tabular-nums">{GROUP_COUNTS[g]} words</span>
              </span>
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-md border",
                  active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                )}
              >
                {active && <Check className="size-3.5" />}
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={toggleBookmarks}
        aria-pressed={selection.includeBookmarks}
        className={cn(
          "mt-2.5 flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          selection.includeBookmarks
            ? "border-amber-400 bg-amber-100/60 dark:border-amber-500/40 dark:bg-amber-500/10"
            : "border-border bg-background hover:border-amber-300 hover:bg-secondary/50",
        )}
      >
        <span className="flex items-center gap-2">
          <Bookmark
            className={cn("size-4", selection.includeBookmarks ? "fill-amber-500 text-amber-500" : "text-muted-foreground")}
          />
          <span>
            <span className="block text-sm font-semibold">Bookmarked words</span>
            <span className="block text-xs text-muted-foreground tabular-nums">
              {state.bookmarks.length} bookmarked
            </span>
          </span>
        </span>
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-md border",
            selection.includeBookmarks ? "border-amber-500 bg-amber-500 text-white" : "border-border",
          )}
        >
          {selection.includeBookmarks && <Check className="size-3.5" />}
        </span>
      </button>

      <div className="mt-5 flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3 text-sm">
        <span className="text-muted-foreground">
          {sourceCount === 0 ? (
            "No source selected"
          ) : (
            <>
              <span className="font-semibold text-foreground">{selection.groups.length}</span> group
              {selection.groups.length === 1 ? "" : "s"}
              {selection.includeBookmarks && " + bookmarks"} selected
            </>
          )}
        </span>
        <span className="font-semibold tabular-nums">
          {selectedCount} word{selectedCount === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  )
}
