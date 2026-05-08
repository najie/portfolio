export type Project = {
  slug: string
  title: string
  description: string
  tags: string[]
  thumbnail?: string
}

export const projects: Project[] = [
  {
    slug: "pomodoro",
    title: "Pomodoro Timer",
    description: "Mobile haptics & animations",
    tags: ["react", "animations"],
    thumbnail: "https://picsum.photos/400/225",
  },
]
