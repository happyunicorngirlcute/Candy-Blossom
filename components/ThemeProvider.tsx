"use client"

import { createContext, useContext, useEffect, useState } from "react"

type ThemeContextType = {
  dark: boolean
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    try {
      const stored = localStorage.getItem("theme")
      if (stored) return stored === "dark"
      return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false
    } catch {
      return false
    }
  })

  const toggle = () => {
    setDark((prev) => {
      const next = !prev
      try {
        localStorage.setItem("theme", next ? "dark" : "light")
      } catch { }
      document.documentElement.classList.toggle("dark", next)
      return next
    })
  }

  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", dark)
    } catch { }
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider")
  return ctx
}