/** Sun-over-arch mark. Decorative; the "SolarArc" wordmark next to it carries the name. */
export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <circle cx="16" cy="9" r="5" fill="#F5B700" />
      <g stroke="#F5B700" strokeWidth="1.5" strokeLinecap="round">
        <path d="M16 1.5v1.5M9 4l1 1M23 4l-1 1M7 10h1.5M25 10h-1.5" />
      </g>
      <path d="M4 28V22a12 12 0 0 1 24 0v6" fill="none" stroke="#1F6F40" strokeWidth="3" strokeLinecap="round" />
      <path d="M3 28.5h26" stroke="#7A5C3E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
