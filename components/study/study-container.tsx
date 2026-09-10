"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useStore } from "@/lib/store"
import { getWord, resolveWordSet } from "@/lib/vocab"
import {
  createStudySession,
  currentWordId,
  isComplete,
  markKnown,
  markUnknown,
  type StudySession,
} from "@/lib/study"
import { Button } from "@/components/ui/button"
import { StudySetup } from "./study-setup"
import { Flashcard } from "./flashcard"
import { StudyProgress } from "./study-progress"
import { StudyComplete } from "./study-complete"

type Phase = "setup" | "session" | "complete"

export function StudyContainer() {
  const { selection, state, hydrated, markMastered, recordStudySession } = useStore()
  const [phase, setPhase] = useState<Phase>("setup")
  const [includeMastered, setIncludeMastered] = useState(false)
  const [session, setSession] = useState<StudySession | null>(null)
  const [flipped, setFlipped] = useState(false)

  const selectedWords = useMemo(
    () => resolveWordSet(selection.groups, selection.includeBookmarks, state.bookmarks),
    [selection, state.bookmarks],
  )
  const masteredInSelection = useMemo(
    () => selectedWords.filter((w) => state.masteredWords.includes(w.id)).length,
    [selectedWords, state.masteredWords],
  )

  const start = useCallback(() => {
    let words = selectedWords
    if (!includeMastered) {
      const masteredSet = new Set(state.masteredWords)
      words = words.filter((w) => !masteredSet.has(w.id))
    }
    if (words.length === 0) return
    setSession(createStudySession(words))
    setFlipped(false)
    setPhase("session")
  }, [selectedWords, includeMastered, state.masteredWords])

  const finalize = useCallback(
    (finished: StudySession) => {
      markMastered(finished.masteredIds)
      recordStudySession(finished.knownMarks, finished.repeats)
      setSession(finished)
      setPhase("complete")
    },
    [markMastered, recordStudySession],
  )

  const handleKnown = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev
      const next = markKnown(prev)
      if (isComplete(next)) {
        finalize(next)
        return next
      }
      return next
    })
    setFlipped(false)
  }, [finalize])

  const handleUnknown = useCallback(() => {
    setSession((prev) => (prev ? markUnknown(prev) : prev))
    setFlipped(false)
  }, [])

  // Keyboard shortcuts during a session
  useEffect(() => {
    if (phase !== "session") return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return
      if (e.key === " ") {
        e.preventDefault()
        setFlipped((f) => !f)
      } else if ((e.key === "k" || e.key === "K") && flipped) {
        e.preventDefault()
        handleKnown()
      } else if ((e.key === "u" || e.key === "U") && flipped) {
        e.preventDefault()
        handleUnknown()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [phase, flipped, handleKnown, handleUnknown])

  if (!hydrated) {
    return <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6" />
  }

  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-10">
        <StudySetup
          includeMastered={includeMastered}
          onIncludeMasteredChange={setIncludeMastered}
          wordCount={selectedWords.length}
          masteredInSelection={masteredInSelection}
          onStart={start}
        />
      </div>
    )
  }

  if (phase === "complete" && session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <StudyComplete session={session} onStudyAgain={start} onBackToSetup={() => setPhase("setup")} />
      </div>
    )
  }

  if (phase === "session" && session) {
    const wid = currentWordId(session)
    const word = wid ? getWord(wid) : undefined
    if (!word) return null
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setPhase("setup")}>
            <ArrowLeft className="size-4" /> Exit
          </Button>
          <span className="text-sm text-muted-foreground">
            Card <span className="font-semibold text-foreground tabular-nums">{session.masteredIds.length + 1}</span> of{" "}
            <span className="tabular-nums">{session.total}</span>
          </span>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
          <Flashcard
            key={word.id + session.queue.length}
            word={word}
            flipped={flipped}
            onFlip={() => setFlipped((f) => !f)}
            onKnown={handleKnown}
            onUnknown={handleUnknown}
          />
          <div className="order-first lg:order-last">
            <StudyProgress session={session} />
          </div>
        </div>
      </div>
    )
  }

  return null
}
