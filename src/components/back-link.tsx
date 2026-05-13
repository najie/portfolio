import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"

const BackLink = ({ href = "/" }: { href?: string }) => (
  <Button variant="ghost" asChild>
    <a href={href} className="flex items-center gap-2">
      <HugeiconsIcon icon={ArrowLeft02Icon} />
      Retour
    </a>
  </Button>
)

export { BackLink }
