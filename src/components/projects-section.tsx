import { useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Clock01Icon,
  Invoice01Icon,
  LinkSquare01Icon,
  Rocket01Icon,
} from "@hugeicons/core-free-icons"
import { projects } from "@/projects/registry"
import { Badge } from "./ui/badge"
import { TestItCallout } from "./test-it-callout"

const icons: Record<string, typeof Clock01Icon> = {
  pomodoro: Clock01Icon,
  "finance-to-the-moon": Rocket01Icon,
  "pdf-invoice-editor": Invoice01Icon,
}

const widgetClass =
  "glass flex min-h-48 flex-col gap-4 rounded-3xl p-5 text-left"

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} id="projects" className="relative scroll-mt-8">
      <TestItCallout sectionRef={sectionRef} />
      <h2 className="section-label">Projects</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {projects.map((project) => {
          const content = (
            <>
              <span className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-[14px] bg-white shadow-xs">
                  <HugeiconsIcon
                    icon={icons[project.slug]}
                    className="size-5"
                  />
                </span>
                {project.url && (
                  <HugeiconsIcon
                    icon={LinkSquare01Icon}
                    className="size-4 text-muted-foreground"
                  />
                )}
              </span>
              <div>
                {project.soonTM ? (
                  <Badge variant="outline">Coming soon</Badge>
                ) : (
                  <Badge>Live</Badge>
                )}
                <h3 className="mt-1.5 font-display text-2xl leading-none tracking-wide">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </>
          )
          return project.soonTM ? (
            <div key={project.slug} className={widgetClass}>
              {content}
            </div>
          ) : (
            <a
              key={project.slug}
              href={project.url ?? `/projects/${project.slug}`}
              {...(project.url && {
                target: "_blank",
                rel: "noreferrer",
              })}
              className={`${widgetClass} glass-tap`}
            >
              {content}
            </a>
          )
        })}
      </div>
    </section>
  )
}

export { ProjectsSection }
