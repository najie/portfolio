import { HugeiconsIcon } from "@hugeicons/react"
import { FallingStarIcon } from "@hugeicons/core-free-icons"

const SkillsSection = () => {
  return (
    <section className="mt-16 flex w-full flex-col">
      <div className="flex items-center">
        <HugeiconsIcon
          icon={FallingStarIcon}
          className="size-24 animate-glow-wander"
        />

        <hgroup className="ml-8 border-l border-mist-600 pl-8">
          <h2 className="text-5xl font-bold">Skills</h2>
          <h3 className="text-special">
            The tools I use to build amazing things
          </h3>
        </hgroup>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
    </section>
  )
}

export { SkillsSection }
