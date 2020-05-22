import { useEffect, useCallback, useState } from 'react'
import { useStore } from '@/context'

export function useKeyboardClose(usingStatus: boolean, onClose: () => void) {
  const listenEnterToClose = useCallback(
    (e: KeyboardEvent) => {
      if (e.code !== 'Escape') return
      e.preventDefault()
      onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!usingStatus) return
    document.addEventListener('keyup', listenEnterToClose)
    return () => {
      document.removeEventListener('keyup', listenEnterToClose)
    }
  }, [])
}

export function useIntoViewerShown() {
  const { layerShown } = useStore()
  const [controllerShown, setControllerShown] = useState(true)

  useEffect(() => {
    if (!layerShown) return
    setTimeout(() => {
      setControllerShown(false)
    }, 2000)
  }, [layerShown])

  return controllerShown
}

export function useScaleFn() {
  const { dispatch, imgScale } = useStore()
  const zoomin = useCallback(() => {
    if (imgScale >= 5) return
    dispatch({ type: 'SET_SCALE', scale: imgScale + 0.25 })
  }, [imgScale])

  const zoomout = useCallback(() => {
    if (imgScale <= 0.25) return
    dispatch({ type: 'SET_SCALE', scale: imgScale - 0.25 })
  }, [imgScale])

  return { zoomin, zoomout }
}
