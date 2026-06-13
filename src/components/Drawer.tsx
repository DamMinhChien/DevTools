import type {ReactNode} from 'react'
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose} from '@/components/ui/sheet'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  /** Tailwind width class, e.g. 'max-w-2xl', 'w-[50%]', 'w-[700px]' */
  width?: string
  className?: string
}

export function Drawer({open, onClose, title, children, width = 'max-w-lg', className}: DrawerProps) {
  return (
    <Sheet open={open} onOpenChange={(v: boolean) => {
      if (!v) onClose()
    }}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className={[
          width,
          'rounded-l-3xl shadow-2xl bg-white dark:bg-neutral-900 p-0 border-l border-slate-200 dark:border-neutral-800 flex flex-col',
          className
        ].filter(Boolean).join(' ')}
      >
        <SheetHeader className="px-6 pt-6 pb-2 relative shrink-0">
          <SheetTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</SheetTitle>
          <SheetClose asChild>
            <button onClick={onClose}
                    className="absolute right-6 top-6 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-400 hover:text-slate-900">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </SheetClose>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6">{children}</div>
      </SheetContent>
    </Sheet>
  )
}

