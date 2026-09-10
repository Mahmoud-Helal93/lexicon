"use client"

import Link from "next/link"
import { GraduationCap, BookOpen, Bookmark, Layers, Trophy, ArrowRight, Target } from "lucide-react"
import { useStore } from "@/lib/store"
import { TOTAL_WORDS, GROUPS } from "@/lib/vocab"
import { Button } from "@/components/ui/button"

function StatCard({
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

export function Dashboard() {
  const { state, hydrated } = useStore()
  const mastered = hydrated ? state.masteredWords.length : 0
  const bookmarked = hydrated ? state.bookmarks.length : 0
  const pct = TOTAL_WORDS ? Math.round((mastered / TOTAL_WORDS) * 100) : 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/12 via-card to-accent/30 p-8 sm:p-12">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Layers className="size-3.5" /> {GROUPS.length} groups · {TOTAL_WORDS} words
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Master GRE vocabulary, one card at a time.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Learn with flashcards and simple spaced repetition, then test yourself on definitions and Arabic
            translations. Your progress and bookmarks are saved automatically.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/study">
                <GraduationCap className="size-5" /> Start studying
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/practice">
                <BookOpen className="size-5" /> Practice
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Your progress</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={Layers}
            value={TOTAL_WORDS}
            label="Total words"
            tint="bg-primary/10 text-primary"
          />
          <StatCard
            icon={Trophy}
            value={mastered}
            label="Mastered"
            tint="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            icon={Bookmark}
            value={bookmarked}
            label="Bookmarked"
            tint="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          />
          <StatCard
            icon={Target}
            value={`${pct}%`}
            label="Overall complete"
            tint="bg-sky-500/10 text-sky-600 dark:text-sky-400"
          />
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          href="/study"
          className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
        >
          <div>
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="size-6" />
            </div>
            <h3 className="text-xl font-semibold">Study</h3>
            <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
              Flip flashcards and mark words Known or Unknown. Unknown words return after five other words until you
              master them.
            </p>
          </div>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Continue learning
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/practice"
          className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
        >
          <div>
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <BookOpen className="size-6" />
            </div>
            <h3 className="text-xl font-semibold">Practice</h3>
            <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
              Test yourself with multiple-choice questions on English definitions and Arabic translations, in either
              direction.
            </p>
          </div>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Test your vocabulary
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>
    </div>
  )
}
