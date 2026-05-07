import { useEffect, useMemo, useState } from "react"

type Segment = {
  text?: string
  className?: string
  br?: true
}

const BLINK_PAUSE = 1000
const TYPING_DURATION = 1500

const segments: Segment[] = [
  { text: "Hi.", className: "text-special" },
  { br: true },
  { text: "I'm Jeremy Laurain" },
  { br: true },
  { text: "Senior Frontend Developer" },
]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const getPreviousCharCount = (segmentIndex: number) =>
  segments
    .slice(0, segmentIndex)
    .reduce((sum, segment) => sum + (segment.text?.length ?? 0), 0)

const TypewriterHeading = () => {
  const [visibleChars, setVisibleChars] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const [runToken, setRunToken] = useState(0)

  const totalChars = useMemo(
    () =>
      segments.reduce((sum, segment) => sum + (segment.text?.length ?? 0), 0),
    []
  )

  useEffect(() => {
    const restartTypewriter = () => setRunToken((token) => token + 1)

    window.addEventListener("theme-change", restartTypewriter)

    return () => {
      window.removeEventListener("theme-change", restartTypewriter)
    }
  }, [])

  useEffect(() => {
    let isCancelled = false
    const charDelay = TYPING_DURATION / totalChars

    const typeText = async () => {
      setVisibleChars(0)
      setIsTyping(false)
      setShowCursor(true)

      await sleep(BLINK_PAUSE)
      if (isCancelled) return

      setIsTyping(true)

      for (let charIndex = 1; charIndex <= totalChars; charIndex += 1) {
        if (isCancelled) return
        setVisibleChars(charIndex)
        await sleep(charDelay)
      }

      if (isCancelled) return
      setShowCursor(false)
      setIsTyping(false)
    }

    void typeText()

    return () => {
      isCancelled = true
    }
  }, [runToken, totalChars])

  return (
    <div id="typed-heading-wrapper" className="mb-10">
      <h1
        id="typed-heading"
        className="text-5xl font-bold"
        aria-label="Hi. I'm Jeremy Laurain. Senior Frontend Developer"
      >
        {segments.map((segment, index) => {
          const previousCharCount = getPreviousCharCount(index)

          if (segment.br) {
            return visibleChars >= previousCharCount &&
              previousCharCount > 0 ? (
              <br key={`br-${index}`} />
            ) : null
          }

          const text = segment.text ?? ""
          const visibleTextLength = Math.min(
            Math.max(visibleChars - previousCharCount, 0),
            text.length
          )
          const visibleText = text.slice(0, visibleTextLength)

          if (!visibleText) {
            return null
          }

          return (
            <span key={text} className={segment.className}>
              {visibleText}
            </span>
          )
        })}
        {showCursor ? (
          <span className={`typewriter-cursor${isTyping ? "is-typing" : ""}`} />
        ) : null}
      </h1>
      <h1
        className="pointer-events-none invisible text-5xl font-bold select-none"
        aria-hidden="true"
      >
        <span>Hi.</span>
        <br />
        I'm Jeremy Laurain
        <br />
        Senior Frontend Developer
      </h1>

      <style>{`
        #typed-heading-wrapper {
          display: grid;
        }

        #typed-heading-wrapper > h1 {
          grid-area: 1 / 1;
        }

        .typewriter-cursor {
          display: inline-block;
          width: 3px;
          height: 0.75em;
          background-color: currentColor;
          vertical-align: baseline;
          margin-left: 2px;
          animation: typewriter-blink 0.4s step-end infinite;
        }

        .typewriter-cursor.is-typing {
          animation: none;
          opacity: 1;
        }

        @keyframes typewriter-blink {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default TypewriterHeading
export { TypewriterHeading }
