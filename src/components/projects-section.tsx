import { useRef, useEffect, useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Blockchain03Icon } from "@hugeicons/core-free-icons"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction,
} from "./ui/card"
import { AspectRatio } from "./ui/aspect-ratio"
import { Button } from "./ui/button"
import { projects } from "@/projects/registry"
import { Badge } from "./ui/badge"

interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
}

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const hgroupRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [lines, setLines] = useState<Line[]>([])

  const updateLines = useCallback(() => {
    const section = sectionRef.current
    const hgroup = hgroupRef.current
    if (!section || !hgroup) return

    const sectionRect = section.getBoundingClientRect()
    const hgroupRect = hgroup.getBoundingClientRect()

    const startX = hgroupRect.right - sectionRect.left + 16
    const centerY = hgroupRect.top + hgroupRect.height / 2 - sectionRect.top

    const cards = cardRefs.current.filter(
      (card): card is HTMLDivElement => card !== null
    )
    const gap = 16
    const totalHeight = (cards.length - 1) * gap
    const topY = centerY - totalHeight / 2

    const newLines = cards.map((card, i) => {
      const cardRect = card.getBoundingClientRect()
      const y1 = topY + i * gap
      const x2 = cardRect.left - sectionRect.left
      const y2 = cardRect.top + cardRect.height / 2 - sectionRect.top
      return { x1: startX, y1, x2, y2 }
    })

    setLines(newLines)
  }, [])

  useEffect(() => {
    updateLines()
    window.addEventListener("resize", updateLines)
    return () => window.removeEventListener("resize", updateLines)
  }, [updateLines])

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full items-center justify-between"
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <style>{`
          @keyframes draw-line {
            from { clip-path: inset(0 100% 0 0); }
            to { clip-path: inset(0 0% 0 0); }
          }
        `}</style>
        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray="4 6"
            className="text-muted-foreground/30"
            style={{
              animation: "draw-line 2s ease forwards",
            }}
          />
        ))}
      </svg>

      <div className="flex items-center">
        <HugeiconsIcon
          icon={Blockchain03Icon}
          className="size-24 animate-glow-wander"
        />

        <div className="ml-8 h-16 w-1 rotate-15 rounded-full bg-foreground" />
        <div ref={hgroupRef} className="ml-8">
          <h2 className="text-5xl font-bold">Projects</h2>
          <h3 className="text-special">Made with passion and care</h3>
        </div>
      </div>
      <div className="flex w-[400px] flex-col gap-4">
        {projects.map((project, i) => (
          <Card
            key={project.slug}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
          >
            <CardHeader>
              {project.soonTM && (
                <CardAction>
                  <Badge variant="outline">Coming soon</Badge>
                </CardAction>
              )}
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="grow">
              {project.thumbnail && (
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="rounded"
                  />
                </AspectRatio>
              )}
            </CardContent>
            <CardFooter>
              <a href={`/projects/${project.slug}`} className="w-full">
                <Button className="w-full" disabled={project.soonTM}>
                  View Project
                </Button>
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

export { ProjectsSection }
