import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  action?: ReactNode
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">{title}</h1>
      {action && <div className="w-full md:w-auto">{action}</div>}
    </div>
  )
}
