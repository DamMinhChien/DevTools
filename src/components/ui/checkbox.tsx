import * as React from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => {
    return (
      <label className="inline-flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "w-[17px] h-[17px] rounded-[4px] border-2 border-slate-300 transition-all duration-150 flex items-center justify-center",
            "peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30",
            "hover:border-slate-400 peer-checked:hover:bg-primary/90",
            className
          )}
        >
          {checked && (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="text-white">
              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
