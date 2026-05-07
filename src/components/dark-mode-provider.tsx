import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type DarkModeContextValue = { dark: boolean }

const DarkModeContext = createContext<DarkModeContextValue | null>(null)

function DarkModeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const sync = () => setDark(document.documentElement.classList.contains("dark"))
    sync()
    window.addEventListener("theme-change", sync)
    return () => window.removeEventListener("theme-change", sync)
  }, [])

  return (
    <DarkModeContext.Provider value={{ dark }}>
      {children}
    </DarkModeContext.Provider>
  )
}

function useDarkMode() {
  const ctx = useContext(DarkModeContext)
  if (!ctx) throw new Error("useDarkMode must be used within <DarkModeProvider>")
  return ctx.dark
}

export { DarkModeProvider, useDarkMode }
