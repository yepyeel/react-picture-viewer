import React, { memo } from 'react'
import Tooltip from '@/components/common/Tooltip'
import { useStore } from '@/context'
import { useKeyboardClose, useIntoViewerShown, useScaleFn } from './hooks'
import styles from './styles.module.scss'

interface Props {
  keyboard: boolean
  onClose(): void
}

const Controller: React.FC<Props> = ({ onClose, keyboard }) => {
  const { dispatch } = useStore()
  useKeyboardClose(keyboard, onClose)
  const controllerShown = useIntoViewerShown()
  const { zoomin, zoomout } = useScaleFn()

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div
          className={styles.close}
          onClick={() => dispatch({ type: 'SHOWN_LAYER', visible: false })}
        >
          <i className="iconfont icon-close" />
        </div>
      </div>

      <div
        className={styles.bottom + (controllerShown ? ` ${styles.shown}` : '')}
      >
        <div className={styles.controller}>
          <Tooltip content="上一张">
            <div className={styles.controllerItem} onClick={zoomin}>
              <i
                className="iconfont icon-arrow"
                style={{ transform: 'rotate(180deg)' }}
              />
            </div>
          </Tooltip>

          <Tooltip content="下一张">
            <div className={styles.controllerItem} onClick={zoomin}>
              <i className="iconfont icon-arrow" />
            </div>
          </Tooltip>

          <span className={styles.separator} />

          <Tooltip content="放大">
            <div className={styles.controllerItem} onClick={zoomin}>
              <i className="iconfont icon-zoomin" />
            </div>
          </Tooltip>

          <Tooltip content="缩小">
            <div className={styles.controllerItem} onClick={zoomout}>
              <i className="iconfont icon-zoomout" />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default memo(Controller)
