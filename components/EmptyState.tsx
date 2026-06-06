import * as React from 'react'
import { cn } from '~/lib/utils'
import { LucideIcon } from 'lucide-react'
import { HTMLAttributes, ReactNode } from 'react'

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  title: string
  description?: string
  actions?: ReactNode
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actions,
  className,
  ...props
}: EmptyStateProps) => {
  return (
    <div
      className={ cn(
        'flex min-h-[400px] flex-col items-center justify-center rounded-md p-8',
        'text-center animate-in fade-in-75 zoom-in-75 duration-300',
        className
      ) }
      { ...props }
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
        <Icon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
      </div>

      <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
        { title }
      </h3>

      { description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm whitespace-pre-wrap">
          { description }
        </p>
      ) }

      { actions && (
        <div className="mt-6 flex items-center justify-center gap-4">
          { actions }
        </div>
      ) }
    </div>
  )
}
