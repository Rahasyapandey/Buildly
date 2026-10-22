import { useEffect, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './themeContextDef'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 1. Check saved localStorage preference
    const saved = localStorage.getItem('buildly-theme') as Theme | null
    if (saved === 'light' || saved === 'dark') return saved

    // 2. Default to 'light' mode so the workspace matches the landing page
    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('buildly-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const setTheme = (t: Theme) => {
    setThemeState(t)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
