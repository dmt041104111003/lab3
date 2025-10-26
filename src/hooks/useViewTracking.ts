import { useEffect } from 'react'

export function useViewTracking(postSlug: string) {
  useEffect(() => {
    if (!postSlug || typeof window === 'undefined') return

    const trackView = async () => {
      try {
        const deviceData = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          screenResolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          cookieEnabled: navigator.cookieEnabled,
          doNotTrack: navigator.doNotTrack || 'unknown',
          hardwareConcurrency: navigator.hardwareConcurrency || 0,
          maxTouchPoints: navigator.maxTouchPoints || 0,
          colorDepth: screen.colorDepth,
          pixelRatio: window.devicePixelRatio || 1,
        }

        await fetch(`/api/posts/${postSlug}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ deviceData }),
        })
      } catch (error) {
        console.log('View tracking failed:', error)
      }
    }

    const timeoutId = setTimeout(trackView, 1000)

    return () => clearTimeout(timeoutId)
  }, [postSlug])
}
