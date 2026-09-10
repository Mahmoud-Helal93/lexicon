"use client"

import Link from "next/link"
import { Trophy, RotateCw, BookOpen, ArrowLeft } from "lucide-react"
import type { StudySession } from "@/lib/study"
import { Button } from "@/components/ui/button"

export function StudyComplete({
  session,
  onStudyAgain,
  onBackToSetup,
}: {
  session: StudySession
  onStudyAgain: () => void
  onBackToSetup: () => void
}) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-8 text-center sm:p-10">
      <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        <Trophy className="size-8" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Group complete!</h2>
      <p className="mt-2 text-muted-foreground">
        You mastered {session.total} word{session.total === 1 ? "" : "s"}.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-secondary/60 px-4 py-4">
          <div className="text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
            {session.knownMarks}
          </div>
          <div className="text-xs text-muted-foreground">Known marks</div>
        </div>
        <div className="rounded-xl bg-secondary/60 px-4 py-4">
          <div className="text-2xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">
            {session.repeats}
          </div>
          <div className="text-xs text-muted-foreground">Repeats</div>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-2.5">
        <Button size="lg" onClick={onStudyAgain}>
          <RotateCw className="size-5" /> Study again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/practice">
            <BookOpen className="size-5" /> Practice these words
          </Link>
        </Button>
        <Button size="lg" variant="ghost" onClick={onBackToSetup}>
          <ArrowLeft className="size-5" /> Back to study setup
        </Button>
      </div>
    </div>
  )
}
