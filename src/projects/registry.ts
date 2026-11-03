export type Project = {
  slug: string
  title: string
  description: string
  tags: string[]
  thumbnail?: string
  url?: string // hosted elsewhere, opens in a new tab
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
    slug: "finance-to-the-moon",
    title: "Finance to the Moon",
    description:
      "Tracks my crypto and stock portfolio and suggests the next moves",
    tags: ["finance", "browser"],
    url: "https://najie.github.io/finance-to-the-moon/",
    soonTM: false,
  },
  {
    slug: "pdf-invoice-editor",
    title: "Invoice PDF Editor",
    description: "Retype text on an existing invoice PDF and export it",
    tags: ["pdf", "browser"],
    url: "https://najie.github.io/pdf-invoice-editor/",
    soonTM: false,
  },
]
