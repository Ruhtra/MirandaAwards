import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  action?: ReactNode
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h1 className="text-foreground text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      {action && <div className="w-full md:w-auto">{action}</div>}
    </div>
  )
}
