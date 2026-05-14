import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

function MainLayoutHeader() {
  return (
    <header className="fixed top-16 z-99 flex w-full justify-center">
      <div className="flex justify-center gap-3 rounded-4xl border p-2 shadow-md backdrop-blur-sm">
        <Button
          variant="ghost"
          className="font-serif"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          創
        </Button>
        <Button
          variant="ghost"
          type="button"
          onClick={() => scrollToSection("experience")}
        >
          Experience
        </Button>
        <Button
          variant="ghost"
          type="button"
          onClick={() => scrollToSection("projects")}
        >
          Projects
        </Button>
        <Button
          variant="ghost"
          type="button"
          onClick={() => scrollToSection("contact")}
        >
          Contact
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}

export { MainLayoutHeader }
