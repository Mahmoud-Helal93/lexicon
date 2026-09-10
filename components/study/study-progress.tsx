"use client"

import { remainingCount, type StudySession } from "@/lib/study"
import { Progress } from "@/components/ui/progress"

export function StudyProgress({ session }: { session: StudySession }) {
  const mastered = session.masteredIds.length
  const pct = session.total ? Math.round((mastered / session.total) * 100) : 0
  const inReview = session.inReview.length
  const remaining = remainingCount(session)

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Progress</span>
        <span className="font-semibold tabular-nums text-primary">{pct}%</span>
      </div>
      <Progress value={pct} className="mt-2 h-2" />
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <Stat value={mastered} label="Mastered" className="text-emerald-600 dark:text-emerald-400" />
        <Stat value={remaining} label="Remaining" className="text-foreground" />
        <Stat value={inReview} label="In review" className="text-amber-600 dark:text-amber-400" />
      </div>
    </div>
  )
}

function Stat({ value, label, className }: { value: number; label: string; className?: string }) {
  return (
    <div className="rounded-xl bg-secondary/50 px-2 py-2.5">
      <div className={`text-2xl font-bold tabular-nums ${className ?? ""}`}>{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
