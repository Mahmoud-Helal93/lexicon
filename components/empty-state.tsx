import type { LucideIcon } from "lucide-react"

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <Icon className="size-7" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1.5 max-w-md text-sm text-muted-foreground text-pretty">{description}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
