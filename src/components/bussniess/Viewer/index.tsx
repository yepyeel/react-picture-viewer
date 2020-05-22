import React, { memo, useMemo, useCallback, MouseEvent } from 'react'
import { useStore } from '@/context'
import { useWindowSize, useImgSize } from './hooks'
import styles from './style.module.scss'

interface Props {
  currentOrder: number
}

const Viewer: React.FC<Props> = ({ currentOrder }) => {
  const { picturesList, imgScale } = useStore()
  const { windowWidth, windowHeight } = useWindowSize()
  const { imgWidth, imgHeight } = useImgSize(() =>
    document.querySelector<HTMLImageElement>('#viewerImg')
  )

  const isCanDrag = useMemo(
    () => imgWidth > windowWidth || imgHeight > windowHeight,
    [imgWidth, imgHeight, windowWidth, windowHeight]
  )

  const startMove = useCallback(
    (e: MouseEvent<HTMLImageElement>) => {
      e.preventDefault()
      if (!isCanDrag) return
      console.log('startMove', e)
    },
    [isCanDrag]
  )

  const endMove = useCallback(
    (e: MouseEvent<HTMLImageElement>) => {
      if (!isCanDrag) return
      console.log('endMove', e)
    },
    [isCanDrag]
  )

  return (
    <div className={styles.imgWrapper}>
      <div className={styles.container}>
        <img
          id="viewerImg"
          style={{
            transform: `scale(${imgScale})`,
            cursor: isCanDrag ? 'grab' : 'inherit'
          }}
          src={picturesList[currentOrder].src}
          alt={picturesList[currentOrder].alt}
          onMouseDown={startMove}
          onMouseUp={endMove}
        />
      </div>
    </div>
  )
}

export default memo(Viewer)
