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
    slug: "cookie-clicker",
    title: "Cookie Clicker",
    description: "A nice animated minimalistic clicker game",
    tags: ["react", "animations"],
    soonTM: true,
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
