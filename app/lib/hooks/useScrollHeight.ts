import { useState, useEffect } from 'react'

// Return the width of the device screen without scrollbar
export const useScrollHeight = (debounceTime = 100) => {
  const [scrollHeight, setScrollHeight] = useState(0)

  useEffect(() => {
    // Set initial width after mount
    setScrollHeight(Math.round(window.scrollY));

    let timeoutId: ReturnType<typeof setTimeout>
    const handleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setScrollHeight(Math.round(window.scrollY));
      }, debounceTime)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [debounceTime]) // Re-run effect if debounceTime changes

  return scrollHeight;
}
