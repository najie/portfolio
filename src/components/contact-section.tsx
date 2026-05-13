import { useCallback } from "react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  LinkSquare01Icon,
  MailLove02Icon,
  Mail01Icon,
  Linkedin02Icon,
  Copy01Icon,
} from "@hugeicons/core-free-icons"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "./ui/item"

const EMAIL = "jeremylaurain+free@gmail.com"

const ContactSection = () => {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(EMAIL)
    toast("Email copied to clipboard", {
      position: "bottom-center",
    })
  }, [])

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center">
        <HugeiconsIcon
          icon={MailLove02Icon}
          className="size-24 animate-glow-wander"
        />
        <div className="ml-8 h-16 w-1 rotate-15 rounded-full bg-foreground" />
        <hgroup className="ml-8">
          <h2 className="text-5xl font-bold">Contact</h2>
          <h3 className="text-special">Let's get in touch !</h3>
        </hgroup>
      </div>
      <div className="mt-16 flex">
        <div>
          <ItemGroup>
            <Item variant="outline">
              <ItemMedia variant="icon">
                <HugeiconsIcon icon={Mail01Icon} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Email</ItemTitle>
                <ItemDescription>
                  A good old email is always a good idea
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
                  Copy
                </button>
              </ItemActions>
            </Item>
            <Item asChild variant="outline">
              <a href="https://www.linkedin.com/in/jlaurain/">
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
          </ItemGroup>
        </div>
      </div>
    </section>
  )
}

export { ContactSection }
