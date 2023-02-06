import { RefObject, useEffect, useMemo, useState } from "react"

export function useOnScreen(ref: RefObject<HTMLElement> | any) {
    const [isIntersecting, setIntersecting] = useState(false)
    
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIntersecting(entry.isIntersecting)
        })

        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])
  
    return isIntersecting
}