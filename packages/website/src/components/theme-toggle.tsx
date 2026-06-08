"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <>
        <div className="md:hidden h-8 w-8 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5" />
        <div className="hidden md:block h-9 w-[100px] rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5" />
      </>
    )
  }

  const options = [
    { value: "light", icon: Sun },
    { value: "system", icon: Laptop },
    { value: "dark", icon: Moon },
  ]

  const ActiveIcon = options.find((opt) => opt.value === theme)?.icon || Laptop

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  return (
    <>
      {/* Mobile: Single Cyclic Button */}
      <div className="md:hidden flex items-center p-0.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md">
        <button
          onClick={cycleTheme}
          className="relative p-2 rounded-full text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 shadow-sm"
          aria-label="Toggle Theme"
        >
          <ActiveIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop: 3-Button Toggle */}
      <div className="hidden md:flex items-center p-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-colors z-10 ${
              theme === opt.value
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
            aria-label={`Theme ${opt.value}`}
          >
            {theme === opt.value && (
              <motion.div
                layoutId="theme-bubble"
                className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-sm rounded-full -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <opt.icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    </>
  )
}
