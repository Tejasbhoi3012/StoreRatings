import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <Sun className={`h-4 w-4 transition-all duration-200 ${isDark ? 'scale-0 -rotate-90 absolute' : 'scale-100 rotate-0'}`} />
      <Moon className={`h-4 w-4 transition-all duration-200 ${isDark ? 'scale-100 rotate-0' : 'scale-0 rotate-90 absolute'}`} />
    </button>
  )
}
