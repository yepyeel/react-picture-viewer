import React, { memo } from 'react'
import { useStore } from '@/context'
import styles from './style.module.scss'

interface Props {
  currentOrder: number
}

const Viewer: React.FC<Props> = ({ currentOrder }) => {
  const { picturesList, imgScale } = useStore()

  return (
    <div className={styles.imgWrapper}>
      <div className={styles.container}>
        <img
          style={{ transform: `scale(${imgScale})` }}
          src={picturesList[currentOrder].src}
          alt={picturesList[currentOrder].alt}
          onMouseDown={(e) => e.preventDefault()}
        />
      </div>
    </div>
  )
}

export default memo(Viewer)
