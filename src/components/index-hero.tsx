import { LightPillar, Grainient } from "@/components/react-bits"
import { HeroPrimaryButton } from "./hero-primary-button"
import { DarkModeProvider, useDarkMode } from "./dark-mode-provider"

const Background = () => {
  const dark = useDarkMode()

  return (
    <div className="absolute inset-0">
      {dark ? (
        <LightPillar
          className="h-2xs"
          topColor="#FFF"
          bottomColor="#333"
          intensity={1.5}
          rotationSpeed={0.2}
          glowAmount={0.002}
          pillarWidth={4}
          pillarHeight={0.2}
          noiseIntensity={1}
          pillarRotation={25}
          interactive={false}
          quality="high"
          mixBlendMode="normal"
        />
      ) : (
        <Grainient
          color1="#ff92c8"
          color2="#ffffff"
          color3="#2bbdf5"
          timeSpeed={0.75}
          colorBalance={0.01}
          warpStrength={0.45}
          warpFrequency={12}
          warpSpeed={0.1}
          warpAmplitude={50}
          blendAngle={32}
          blendSoftness={0.87}
          rotationAmount={810}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.7}
          gamma={1.35}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      )}
    </div>
  )
}

function HeroContent() {
  return (
    <section className="relative h-[calc(100svh-2rem)] overflow-hidden rounded-4xl border md:h-[500px]">
      <Background />
      <div className="relative h-full w-full md:pt-32">
        <div className="relative z-10 flex h-full flex-col justify-center px-4 text-center md:block md:px-0">
          <h1 className="animate-text-reveal text-3xl font-bold motion-reduce:animate-none md:text-5xl">
            <span className="text-special">Hi.</span> <br />
            I'm Jeremy Laurain.
            <br />
            Senior Frontend Developer
          </h1>
          <HeroPrimaryButton />
        </div>
      </div>
    </section>
  )
}

const IndexHero = () => (
  <DarkModeProvider>
    <HeroContent />
  </DarkModeProvider>
)

export { IndexHero }
