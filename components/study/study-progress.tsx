"use client"

import type { StudySession } from "@/lib/study"
import { Progress } from "@/components/ui/progress"

export function StudyProgress({ session }: { session: StudySession }) {
  const mastered = session.masteredIds.length
  const pct = session.total ? Math.round((mastered / session.total) * 100) : 0
  const inReview = session.inReview.length

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm font-medium text-muted-foreground">Progress</div>
          <div className="mt-0.5 text-2xl font-semibold tabular-nums">
            {mastered} <span className="text-base font-normal text-muted-foreground">/ {session.total} mastered</span>
          </div>
        </div>
        <div className="text-right text-2xl font-semibold tabular-nums">{pct}%</div>
      </div>
      <Progress value={pct} className="mt-3 h-2.5" />
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <Stat label="Mastered" value={mastered} tint="text-emerald-600 dark:text-emerald-400" />
        <Stat label="In review" value={inReview} tint="text-amber-600 dark:text-amber-400" />
        <Stat label="Total" value={session.total} tint="text-foreground" />
      </div>
    </div>
  )
}

function Stat({ label, value, tint }: { label: string; value: number; tint: string }) {
  return (
    <div className="rounded-xl bg-secondary/60 px-2 py-3">
      <div className={`text-xl font-semibold tabular-nums ${tint}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
