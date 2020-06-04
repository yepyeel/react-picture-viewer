import React, { memo } from 'react'
import { useStore } from '@/context'
import { useDragInfo, useMove } from './hooks'
import styles from './style.module.scss'

const Viewer: React.FC = () => {
  const {
    picturesList,
    pictureOrder,
    imgScale,
    imgRotate,
    layerShown
  } = useStore()
  const { isCanDrag } = useDragInfo()
  const { onStartMove, onMoving, onEndMove, offsetPos, dragStatus } = useMove()

  return (
    <div
      className={styles.imgWrapper}
      onMouseUp={onEndMove}
      onMouseLeave={onEndMove}
    >
      <div
        className={styles.container}
        style={{
          transform: layerShown
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0)'
        }}
      >
        <img
          id="viewerImg"
          draggable
          style={{
            transform: `translate(${-offsetPos.x}px, ${-offsetPos.y}px) scale(${imgScale}) rotate(${imgRotate}deg)`,
            transition: dragStatus ? `none` : 'transform 0.3s ease-in-out',
            cursor: isCanDrag ? 'grab' : 'inherit'
          }}
          src={picturesList[pictureOrder]?.src || ''}
          alt={picturesList[pictureOrder]?.alt || ''}
          onMouseDown={onStartMove}
          onMouseMove={onMoving}
        />
      </div>
    </div>
  )
}

export default memo(Viewer)
