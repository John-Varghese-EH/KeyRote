"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-10 w-[120px] rounded-full bg-slate-200/20 animate-pulse" />
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-200 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700/50 rounded-full w-fit">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-full transition-all duration-300 ${
          theme === "light" 
            ? "bg-white text-slate-900 shadow-sm" 
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
        }`}
        aria-label="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-full transition-all duration-300 ${
          theme === "system" 
            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
        }`}
        aria-label="System mode"
      >
        <Monitor className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-full transition-all duration-300 ${
          theme === "dark" 
            ? "bg-slate-700 text-white shadow-sm" 
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  )
}
