// "Oui" wordmark: three equal-weight strokes, a rounded-square O, U and I at cap-small height.
const OuiLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 60 100"
    fill="none"
    stroke="currentColor"
    strokeWidth={7}
    className={className}
    role="img"
    aria-label="Oui"
  >
    <rect x="3.5" y="3.5" width="15" height="93" rx="7" />
    <path d="M30.5 24v65.5a7 7 0 0 0 14 0V24" />
    <path d="M56.5 24v76" />
  </svg>
)

export { OuiLogo }
