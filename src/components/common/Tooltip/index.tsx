import React, { memo } from 'react'
import styles from './styles.module.scss'

interface Props {
  content: React.ReactNode
  children: React.ReactNode
}

const Tooltip: React.FC<Props> = ({ content, children }) => {
  return (
    <div className={styles.tooltip}>
      {children}

      <span className={styles.tooltipContent}>{content}</span>
    </div>
  )
}

export default memo(Tooltip)
