"use client"

import { useState } from "react"
import { Trophy, Bookmark, RotateCcw, Trash2, AlertTriangle } from "lucide-react"
import { useStore } from "@/lib/store"
import { TOTAL_WORDS } from "@/lib/vocab"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type PendingAction = "study" | "bookmarks" | "all" | null

export function SettingsView() {
  const { state, hydrated, resetStudyProgress, clearBookmarks, resetAll } = useStore()
  const [pending, setPending] = useState<PendingAction>(null)

  const mastered = hydrated ? state.masteredWords.length : 0
  const bookmarked = hydrated ? state.bookmarks.length : 0

  const dialogs = {
    study: {
      title: "Reset study progress?",
      description:
        "This will clear all mastered-word progress and study statistics. Your bookmarks will be kept. This cannot be undone.",
      confirmLabel: "Reset progress",
      onConfirm: resetStudyProgress,
    },
    bookmarks: {
      title: "Clear all bookmarks?",
      description: `This will remove all ${bookmarked} bookmarked word${
        bookmarked === 1 ? "" : "s"
      }. This cannot be undone.`,
      confirmLabel: "Clear bookmarks",
      onConfirm: clearBookmarks,
    },
    all: {
      title: "Reset all progress?",
      description:
        "This will remove mastered-word progress, study and practice statistics, and all bookmarks. This cannot be undone.",
      confirmLabel: "Reset everything",
      onConfirm: resetAll,
    },
  } as const

  const active = pending ? dialogs[pending] : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-muted-foreground">Manage your saved progress and data.</p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Trophy className="size-5" />
          </div>
          <div className="text-3xl font-semibold tabular-nums">{mastered}</div>
          <div className="mt-0.5 text-sm text-muted-foreground">of {TOTAL_WORDS} words mastered</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Bookmark className="size-5" />
          </div>
          <div className="text-3xl font-semibold tabular-nums">{bookmarked}</div>
          <div className="mt-0.5 text-sm text-muted-foreground">bookmarked words</div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-semibold">Data management</h2>
          <p className="text-sm text-muted-foreground">Destructive actions require confirmation.</p>
        </div>
        <ul className="divide-y divide-border">
          <Row
            title="Reset study progress"
            description="Clear mastered words and study statistics."
            action={
              <Button variant="outline" onClick={() => setPending("study")}>
                <RotateCcw className="size-4" /> Reset
              </Button>
            }
          />
          <Row
            title="Clear bookmarks"
            description="Remove every bookmarked word."
            action={
              <Button variant="outline" onClick={() => setPending("bookmarks")} disabled={bookmarked === 0}>
                <Bookmark className="size-4" /> Clear
              </Button>
            }
          />
          <Row
            title="Reset all progress"
            description="Wipe mastered words, statistics, and bookmarks."
            action={
              <Button variant="destructive" onClick={() => setPending("all")}>
                <Trash2 className="size-4" /> Reset all
              </Button>
            }
          />
        </ul>
      </div>

      <Dialog open={pending !== null} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-1 flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <DialogTitle>{active?.title}</DialogTitle>
            <DialogDescription>{active?.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                active?.onConfirm()
                setPending(null)
              }}
            >
              {active?.confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Row({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action: React.ReactNode
}) {
  return (
    <li className="flex items-center justify-between gap-4 p-5">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      {action}
    </li>
  )
}
