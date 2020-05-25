import { useEffect, useState, useCallback, useMemo, MouseEvent } from 'react'
import { useStore } from '@/context'
import usePrevious from '@/utils/usePrevious'

const floor = (num: number) => Math.floor(num)
const abs = (num: number) => Math.abs(num)

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

export function useDragInfo() {
  const { windowWidth, windowHeight } = useWindowSize()
  const { imgWidth, imgHeight } = useImgSize(() =>
    document.querySelector<HTMLImageElement>('#viewerImg')
  )

  const isCanDrag = useMemo(
    () => imgWidth > windowWidth || imgHeight > windowHeight,
    [imgWidth, imgHeight, windowWidth, windowHeight]
  )

  return { isCanDrag, windowWidth, windowHeight, imgWidth, imgHeight }
}

export function useMove() {
  const { imgScale } = useStore()
  const preImgScale = usePrevious(imgScale, (prev, next) => prev !== next)
  const [dragStatus, setDragStatus] = useState(false)
  const [lastReacordPos, setLastRecordPos] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [offsetPos, setOffsetPos] = useState({ x: 0, y: 0 })
  const {
    isCanDrag,
    windowWidth,
    imgWidth,
    windowHeight,
    imgHeight
  } = useDragInfo()

  useEffect(() => {
    // If it is not possible in advance, set the picture as the center
    if (!isCanDrag) {
      setStartPos({ x: 0, y: 0 })
      setOffsetPos({ x: 0, y: 0 })
      setLastRecordPos({ x: 0, y: 0 })
    } else {
      if (!preImgScale) return
      if (preImgScale < imgScale) return

      setOffsetPos({ x: 0, y: 0 })
      setLastRecordPos({ x: 0, y: 0 })
    }
  }, [preImgScale, isCanDrag])

  const onStartMove = useCallback(
    (e: MouseEvent<HTMLImageElement>) => {
      e.preventDefault()
      if (!isCanDrag) return
      setDragStatus(true)
      setStartPos({ x: e.clientX, y: e.clientY })
    },
    [isCanDrag]
  )

  const onMoving = useCallback(
    (e: MouseEvent<HTMLImageElement>) => {
      e.persist()
      if (!isCanDrag || !dragStatus) return

      const newPosX = startPos.x - e.clientX + lastReacordPos.x
      const newPosY = startPos.y - e.clientY + lastReacordPos.y

      if (imgWidth > windowWidth || imgHeight > windowHeight) {
        if (abs(floor(newPosX)) < floor((imgWidth - windowWidth) / 2)) {
          setOffsetPos((pos) => ({
            ...pos,
            x: newPosX
          }))
        }

        if (abs(floor(newPosY)) < floor((imgHeight - windowHeight) / 2)) {
          setOffsetPos((pos) => ({
            ...pos,
            y: newPosY
          }))
        }
      }
    },
    [
      isCanDrag,
      dragStatus,
      startPos,
      lastReacordPos,
      imgWidth,
      imgHeight,
      windowWidth,
      windowHeight
    ]
  )

  const onEndMove = useCallback(
    (e: MouseEvent<HTMLImageElement>) => {
      e.preventDefault()
      if (dragStatus === false) return
      setDragStatus(false)
      setLastRecordPos({ x: offsetPos.x, y: offsetPos.y })
    },
    [isCanDrag, dragStatus, offsetPos]
  )

  return { onStartMove, onMoving, onEndMove, offsetPos, dragStatus }
}
