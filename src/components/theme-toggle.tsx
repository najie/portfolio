import { useEffect, useState } from "react"
import { Sun01Icon, Moon01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"

function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
    const resolved = stored === "dark" || (!stored && prefersDark)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage + prefers-color-scheme (same rules as layout script)
    setDark(resolved)
  }, [])

  function toggle() {
    const next = !dark
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
    setDark(next)
    window.dispatchEvent(new CustomEvent("theme-change"))
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      <HugeiconsIcon icon={dark ? Sun01Icon : Moon01Icon} />
    </Button>
  )
}

export { ThemeToggle }
