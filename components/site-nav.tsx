"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, GraduationCap, Bookmark, BarChart3, Settings, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/study", label: "Study", icon: GraduationCap },
  { href: "/practice", label: "Practice", icon: BookOpen },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function SiteNav() {
  const pathname = usePathname()
  const { state, hydrated } = useStore()

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link href="/" className="mr-2 flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <span className="hidden text-base sm:inline">GRE Vocabulary</span>
        </Link>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto" aria-label="Primary">
          {links.slice(1).map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                <span className="hidden md:inline">{link.label}</span>
                {link.href === "/bookmarks" && hydrated && state.bookmarks.length > 0 && (
                  <Badge variant="secondary" className="ml-0.5 h-5 min-w-5 justify-center px-1 tabular-nums">
                    {state.bookmarks.length}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
