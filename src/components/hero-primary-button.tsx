import { useDevice } from "@/hooks/use-device"
import { BorderGlow } from "./react-bits"
import { useDarkMode } from "./dark-mode-provider"

const HeroPrimaryButton = () => {
  const dark = useDarkMode()
  const { isMobile } = useDevice()

  console.log(isMobile)

  return (
    <BorderGlow
      edgeSensitivity={0}
      glowColor="40 80 80"
      backgroundColor={dark ? "#120F17" : "#ffffff"}
      isDarkMode={dark}
      borderRadius={99}
      glowRadius={40}
      glowIntensity={0.6}
      coneSpread={10}
      animated={true}
      colors={["#c084fc", "#f472b6", "#38bdf8"]}
      className="2-auto mx-auto mt-16 w-fit"
      isMobile={isMobile}
    >
      <button type="button" className="px-8 py-6">
        Explore what I can do
      </button>
    </BorderGlow>
  )
}

export { HeroPrimaryButton }
