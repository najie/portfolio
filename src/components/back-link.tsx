import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"

const BackLink = ({ href = "/" }: { href?: string }) => (
  <Button
    variant="ghost"
    className="font-display text-lg tracking-wider"
    asChild
  >
    <a href={href} className="flex items-center gap-2">
      <HugeiconsIcon icon={ArrowLeft02Icon} />
      Retour
    </a>
  </Button>
)

export { BackLink }
