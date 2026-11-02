import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Briefcase02Icon,
  Blockchain03Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"
import { getActiveSectionIndex } from "@/lib/scroll-spy"

const sections = [
  { id: "experience", label: "Experience", icon: Briefcase02Icon },
  { id: "projects", label: "Projects", icon: Blockchain03Icon },
  { id: "contact", label: "Contact", icon: Mail01Icon },
]

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

// Lock-screen tab bar: floats at the bottom, its lit pill follows the section in view.
function MainLayoutHeader() {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const update = () => {
      const tops = sections.map(
        ({ id }) =>
          document.getElementById(id)?.getBoundingClientRect().top ?? Infinity
      )
      const { scrollHeight } = document.documentElement
      const remaining = scrollHeight - window.innerHeight - window.scrollY
      const index = getActiveSectionIndex(tops, window.innerHeight, remaining)
      setActive(sections[index]?.id ?? null)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <nav
      aria-label="Sections"
      className="glass fixed bottom-5 left-1/2 z-99 flex -translate-x-1/2 gap-1 rounded-full p-1.5"
    >
      {sections.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          data-active={active === id || undefined}
          aria-current={active === id ? "true" : undefined}
          className="flex items-center gap-2 rounded-full px-4 py-3 font-display text-lg tracking-wider transition-[background-color,box-shadow] duration-300 hover:bg-white/50 data-active:bg-white/80 data-active:shadow-[0_6px_16px_-8px_rgb(0_0_0/0.25)]"
          onClick={() => scrollToSection(id)}
        >
          <HugeiconsIcon icon={icon} className="size-5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </nav>
  )
}

export { MainLayoutHeader }
