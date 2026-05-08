import { HugeiconsIcon } from "@hugeicons/react"
import { Blockchain03Icon } from "@hugeicons/core-free-icons"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card"
import { AspectRatio } from "./ui/aspect-ratio"
import { Button } from "./ui/button"
import { projects } from "@/projects/registry"

const ProjectsSection = () => {
  return (
    <section className="mt-16 flex w-full flex-col">
      <div className="flex items-center">
        <HugeiconsIcon
          icon={Blockchain03Icon}
          className="size-24 animate-glow-wander"
        />

        <hgroup className="ml-8 border-l border-mist-600 pl-8">
          <h2 className="text-5xl font-bold">Projects</h2>
          <h3 className="text-special">Made with passion and care</h3>
        </hgroup>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.slug}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
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
                <Button className="w-full">View Project</Button>
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

export { ProjectsSection }
