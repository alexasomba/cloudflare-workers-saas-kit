import * as React from "react"

const DEFAULT_BREAKPOINT_PX = 768

export function useIsMobile(breakpointPx: number = DEFAULT_BREAKPOINT_PX) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpointPx}px)`) 

    const update = () => setIsMobile(media.matches)
    update()

    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [breakpointPx])

  return isMobile
}
