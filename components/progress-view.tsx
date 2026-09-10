"use client"

import { useMemo } from "react"
import { Trophy, Bookmark, Layers, Target, GraduationCap, BookOpen } from "lucide-react"
import { useStore } from "@/lib/store"
import { GROUPS, GROUP_COUNTS, TOTAL_WORDS, wordsForGroups } from "@/lib/vocab"
import { Progress } from "@/components/ui/progress"

export function ProgressView() {
  const { state, hydrated } = useStore()

  const masteredSet = useMemo(() => new Set(state.masteredWords), [state.masteredWords])
  const mastered = hydrated ? state.masteredWords.length : 0
  const bookmarked = hydrated ? state.bookmarks.length : 0
  const overallPct = TOTAL_WORDS ? Math.round((mastered / TOTAL_WORDS) * 100) : 0

  const perGroup = useMemo(
    () =>
      GROUPS.map((g) => {
        const words = wordsForGroups([g])
        const done = words.filter((w) => masteredSet.has(w.id)).length
        return { group: g, done, total: GROUP_COUNTS[g], pct: Math.round((done / GROUP_COUNTS[g]) * 100) }
      }),
    [masteredSet],
  )

  const { studyStats, practiceStats } = state
  const accuracy =
    practiceStats.totalAnswered > 0
      ? Math.round((practiceStats.totalCorrect / practiceStats.totalAnswered) * 100)
      : 0

  if (!hydrated) return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6" />

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
      <p className="mt-1 text-muted-foreground">Track how much of the vocabulary you have mastered.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={Layers} value={TOTAL_WORDS} label="Total words" tint="bg-primary/10 text-primary" />
        <Stat icon={Trophy} value={mastered} label="Mastered" tint="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
        <Stat icon={Bookmark} value={bookmarked} label="Bookmarked" tint="bg-amber-500/10 text-amber-600 dark:text-amber-400" />
        <Stat icon={Target} value={`${overallPct}%`} label="Complete" tint="bg-sky-500/10 text-sky-600 dark:text-sky-400" />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Overall mastery</h2>
          <span className="text-sm font-semibold tabular-nums">
            {mastered} / {TOTAL_WORDS}
          </span>
        </div>
        <Progress value={overallPct} className="mt-2 h-3" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <GraduationCap className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Study</h2>
          </div>
          <dl className="grid grid-cols-3 gap-3 text-center">
            <MiniStat label="Sessions" value={studyStats.sessionsCompleted} />
            <MiniStat label="Known marks" value={studyStats.totalKnownMarks} />
            <MiniStat label="Repeats" value={studyStats.totalRepeats} />
          </dl>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Practice</h2>
          </div>
          <dl className="grid grid-cols-3 gap-3 text-center">
            <MiniStat label="Sessions" value={practiceStats.sessionsCompleted} />
            <MiniStat label="Answered" value={practiceStats.totalAnswered} />
            <MiniStat label="Accuracy" value={`${accuracy}%`} />
          </dl>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold">Mastery by group</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {perGroup.map((g) => (
            <li key={g.group} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-sm font-medium">Group {g.group}</span>
              <Progress value={g.pct} className="h-2 flex-1" />
              <span className="w-14 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {g.done}/{g.total}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Stat({
  icon: Icon,
  value,
  label,
  tint,
}: {
  icon: typeof Trophy
  value: string | number
  label: string
  tint: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className={`mb-3 flex size-10 items-center justify-center rounded-xl ${tint}`}>
        <Icon className="size-5" />
      </div>
      <div className="text-3xl font-semibold tabular-nums tracking-tight">{value}</div>
      <div className="mt-0.5 text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-secondary/60 px-2 py-3">
      <div className="text-xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
