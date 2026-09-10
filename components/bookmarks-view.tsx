"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { Bookmark, GraduationCap, BookOpen } from "lucide-react"
import { useStore } from "@/lib/store"
import { getWord } from "@/lib/vocab"
import type { VocabWord } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { BookmarkButton } from "@/components/bookmark-button"
import { EmptyState } from "@/components/empty-state"

export function BookmarksView() {
  const { state, hydrated, selection, setSelection } = useStore()
  const router = useRouter()

  const words = useMemo(() => {
    return state.bookmarks
      .map((id) => getWord(id))
      .filter((w): w is VocabWord => Boolean(w))
      .sort((a, b) => a.group - b.group || a.word.localeCompare(b.word))
  }, [state.bookmarks])

  const goStudyOrPractice = (path: "/study" | "/practice") => {
    setSelection({ ...selection, groups: [], includeBookmarks: true })
    router.push(path)
  }

  if (!hydrated) return <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6" />

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>
          <p className="mt-1 text-muted-foreground">
            {words.length} bookmarked word{words.length === 1 ? "" : "s"}
          </p>
        </div>
        {words.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => goStudyOrPractice("/study")}>
              <GraduationCap className="size-4" /> Study bookmarks
            </Button>
            <Button onClick={() => goStudyOrPractice("/practice")}>
              <BookOpen className="size-4" /> Practice bookmarks
            </Button>
          </div>
        )}
      </div>

      {words.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Bookmark}
            title="No bookmarked words yet"
            description="Bookmark words while studying or practicing and they will appear here for focused review."
          >
            <Button onClick={() => router.push("/study")}>
              <GraduationCap className="size-4" /> Start studying
            </Button>
          </EmptyState>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {words.map((w) => (
            <li key={w.id} className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{w.word}</h3>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    Group {w.group}
                  </span>
                </div>
                <p className="text-arabic mt-1 text-base font-medium text-primary" lang="ar">
                  {w.arabicTranslation}
                </p>
                <p className="mt-1 text-sm text-muted-foreground text-pretty">{w.definition}</p>
              </div>
              <BookmarkButton wordId={w.id} size="sm" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
