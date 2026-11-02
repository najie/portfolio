import { useCallback } from "react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  LinkSquare01Icon,
  Mail01Icon,
  Linkedin02Icon,
  Copy01Icon,
  GithubIcon,
} from "@hugeicons/core-free-icons"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "./ui/item"
import { ContactParticles } from "./contact-particles"

const EMAIL = "jeremylaurain+free@gmail.com"

const ContactSection = () => {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(EMAIL)
    toast("Email copied to clipboard", {
      position: "bottom-center",
    })
  }, [])

  return (
    <section id="contact" className="scroll-mt-8">
      <h2 className="section-label">Let's get in touch</h2>
      <div className="relative">
        <ContactParticles />
        <ItemGroup className="glass gap-0 rounded-3xl p-4">
          <Item>
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={Mail01Icon} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Email</ItemTitle>
              <ItemDescription>A good old email</ItemDescription>
            </ItemContent>
            <ItemActions>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/90 bg-white/70 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white hover:text-foreground"
              >
                <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
                Copy
              </button>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item asChild>
            <a
              href="https://www.linkedin.com/in/jlaurain/"
              target="_blank"
              rel="noreferrer"
            >
              <ItemMedia variant="icon">
                <HugeiconsIcon icon={Linkedin02Icon} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>LinkedIn</ItemTitle>
                <ItemDescription>Let's connect on LinkedIn</ItemDescription>
              </ItemContent>
              <ItemActions>
                <HugeiconsIcon
                  icon={LinkSquare01Icon}
                  className="size-4 text-muted-foreground"
                />
              </ItemActions>
            </a>
          </Item>
          <ItemSeparator />
          <Item asChild>
            <a href="https://github.com/najie" target="_blank" rel="noreferrer">
              <ItemMedia variant="icon">
                <HugeiconsIcon icon={GithubIcon} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Github</ItemTitle>
                <ItemDescription>Check out my Github</ItemDescription>
              </ItemContent>
              <ItemActions>
                <HugeiconsIcon
                  icon={LinkSquare01Icon}
                  className="size-4 text-muted-foreground"
                />
              </ItemActions>
            </a>
          </Item>
        </ItemGroup>
      </div>
    </section>
  )
}

export { ContactSection }
