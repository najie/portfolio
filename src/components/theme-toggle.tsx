import { useEffect, useState } from "react"
import { Sun01Icon, Moon01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"

function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"))
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
