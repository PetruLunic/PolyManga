import { useState, useEffect } from 'react'

// Return the width of the device screen without scrollbar
export const useScreenWidth = (debounceTime = 100) => {
  const [screenWidth, setScreenWidth] = useState(0)

  useEffect(() => {
    // Set initial width after mount
    setScreenWidth(document.body.clientWidth)

    let timeoutId: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setScreenWidth(document.body.clientWidth)
      }, debounceTime)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [debounceTime]) // Re-run effect if debounceTime changes

  return screenWidth
}
