import { chromium } from "playwright"
import { mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const screenshotsDir = join(__dirname, "screenshots")
mkdirSync(screenshotsDir, { recursive: true })

const url = process.argv[2] || "http://localhost:4321"
const filename = process.argv[3] || "screenshot.png"
const out = join(screenshotsDir, filename)

const browser = await chromium.launch({ args: ["--use-gl=angle"] })
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
})
const page = await context.newPage()

await page.goto(url, { waitUntil: "networkidle" })
await page.waitForTimeout(4000)

const canvasCount = await page.evaluate(
  () => document.querySelectorAll("canvas").length,
)
console.log(`canvases: ${canvasCount}`)

await page.screenshot({ path: out, fullPage: true })
await browser.close()
console.log(`Screenshot saved to ${out}`)
