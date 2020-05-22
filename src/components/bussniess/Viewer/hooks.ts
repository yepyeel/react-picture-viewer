import { useEffect, useState, useCallback } from 'react'
import { useStore } from '@/context'

export function useWindowSize() {
  const [windowWidth, setWindowWidth] = useState(document.body.clientWidth)
  const [windowHeight, setWindowHeight] = useState(document.body.clientHeight)

  const setSize = useCallback(() => {
    setWindowWidth(document.body.clientWidth)
    setWindowHeight(document.body.clientHeight)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', setSize)
    return () => {
      window.removeEventListener('resize', setSize)
    }
  }, [])

  return { windowWidth, windowHeight }
}

export function useImgSize(fn: () => HTMLImageElement | null) {
  const { imgScale } = useStore()
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)

  useEffect(() => {
    const ele = fn()
    if (!ele) return
    setImgWidth(ele.clientWidth * imgScale)
    setImgHeight(ele.clientHeight * imgScale)
  }, [fn])

  return { imgWidth, imgHeight }
}
