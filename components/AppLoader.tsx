import { Loader2 } from 'lucide-react'

interface LoaderProps {
  title?: string
}

export function Loader({ title }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground animate-in fade-in zoom-in-95 duration-300">
      <Loader2 className="h-8 w-8 animate-spin text-primary/80" />
      {
        title &&
        <p className="text-sm font-medium">{title}</p>
      }
    </div>
  )
}
