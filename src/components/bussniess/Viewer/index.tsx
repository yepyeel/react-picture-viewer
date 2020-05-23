import React, { memo } from 'react'
import { useStore } from '@/context'
import { useDragInfo, useMove } from './hooks'
import styles from './style.module.scss'

interface Props {
  currentOrder: number
}

const Viewer: React.FC<Props> = ({ currentOrder }) => {
  const { picturesList, imgScale } = useStore()
  const { isCanDrag } = useDragInfo()
  const { onStartMove, onMoving, onEndMove, offsetPos, dragStatus } = useMove()

  return (
    <div
      className={styles.imgWrapper}
      onMouseUp={onEndMove}
      onMouseLeave={onEndMove}
    >
      <div className={styles.container}>
        <img
          id="viewerImg"
          draggable
          style={{
            transform: `translate(${-offsetPos.x}px, ${-offsetPos.y}px) scale(${imgScale})`,
            transition: dragStatus ? `none` : 'transform 0.3s ease-in-out',
            cursor: isCanDrag ? 'grab' : 'inherit'
          }}
          src={picturesList[currentOrder].src}
          alt={picturesList[currentOrder].alt}
          onMouseDown={onStartMove}
          onMouseMove={onMoving}
        />
      </div>
    </div>
  )
}

export default memo(Viewer)
