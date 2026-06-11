import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-lg shadow-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all duration-300 active:scale-95 group"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      title={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
    >
      <span className="material-symbols-outlined transition-all duration-500 group-hover:rotate-45">
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
    </Button>
  )
}
