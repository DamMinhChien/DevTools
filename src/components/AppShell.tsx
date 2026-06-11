import type { PropsWithChildren } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <TooltipProvider>
      <div className="app-shell min-h-screen flex flex-col">
        <div className="app-shell__content flex-1">{children}</div>
      </div>
    </TooltipProvider>
  )
}
