export type Project = {
  slug: string
  title: string
  description: string
  tags: string[]
  thumbnail?: string
  soonTM: boolean
}

export const projects: Project[] = [
  {
    slug: "pomodoro",
    title: "Pomodoro Timer",
    description: "A drag-to-set Pomodoro timer",
    tags: ["react", "animations"],
    soonTM: false,
  },
  {
    slug: "cookie-clicker",
    title: "Cookie Clicker",
    description: "A nice animated minimalistic clicker game",
    tags: ["react", "animations"],
    soonTM: true,
  },
  {
    slug: "zod-form",
    title: "A Form with Zod validation",
    description: "A form with Zod validation and a nice UI",
    tags: ["react", "zod", "form"],
    soonTM: true,
  },
]
