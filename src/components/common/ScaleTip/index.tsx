import React, { memo, useState, useEffect } from 'react'
import { useStore } from '@/context'
import styles from './style.module.scss'

let timeout: NodeJS.Timeout | null = null

const ScaleTip: React.FC = () => {
  const { imgScale } = useStore()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (timeout) {
      if (!shown) setShown(true)
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      setShown(false)
    }, 1000)

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [imgScale])

  return (
    <div
      className={styles.tooltip}
      style={{
        opacity: shown ? 1 : 0,
        visibility: shown ? 'visible' : 'hidden'
      }}
    >
      {imgScale * 100}%
    </div>
  )
}

export default memo(ScaleTip)
