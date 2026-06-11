import type { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

type SectionCardProps = PropsWithChildren<{
  title?: string
  description?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}>

export function SectionCard({
  children,
  title,
  description,
  icon,
  actions,
  className,
}: SectionCardProps) {
  return (
    <div className={cn(
      "section-card relative overflow-hidden rounded-[2.5rem] border border-slate-200/50 bg-white dark:bg-slate-900/90 p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12)] transition-all duration-500",
      className
    )}>
      <div className="flex flex-col mb-6 gap-6">
        <div className="flex items-start gap-4 w-full">
          {icon && (
            <div className="mt-1 shrink-0 p-3 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              {typeof icon === 'string' ? (
                <span className="material-symbols-outlined text-[24px]">{icon}</span>
              ) : (
                icon
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h5 className="font-black text-2xl text-slate-800 dark:text-slate-100 tracking-tight leading-tight">{title}</h5>
            {description && (
              <p className="section-card__description text-[14px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-relaxed italic border-l-2 border-slate-100 dark:border-slate-800 pl-3">{description}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-3 w-full bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
            {actions}
          </div>
        )}
      </div>
      <div className="section-card__body relative">{children}</div>
    </div>
  )
}
