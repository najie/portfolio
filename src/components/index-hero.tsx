import { HeroPrimaryButton } from "./hero-primary-button"
import { OuiLogo } from "./oui-logo"

const IndexHero = () => (
  <section className="flex flex-col items-center pt-4 pb-6 text-center">
    <OuiLogo className="h-9" />
    <p className="mt-2 font-display text-base tracking-wider">
      "Oui" is the answer to{" "}
      <span className="text-special">"can we build this?"</span>
    </p>
    <p className="mt-10 text-[15px] font-medium tracking-wide text-muted-foreground">
      Senior Frontend Developer · Paris · Freelance
    </p>
    <h1 className="mt-2 animate-text-reveal font-display text-[clamp(4rem,12vw,8rem)] leading-[0.95] tracking-wide motion-reduce:animate-none">
      <span className="text-special">Hi</span>
      <br />
      I'm Jeremy Laurain
    </h1>
    <p className="mt-3 text-lg">
      A decade of React, TypeScript and interfaces that feel finished.
    </p>
    <HeroPrimaryButton />
  </section>
)

export { IndexHero }
