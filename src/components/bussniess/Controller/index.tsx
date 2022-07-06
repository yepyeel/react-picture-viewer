import React, { memo, Fragment } from 'react'
import Tooltip from '@/components/common/Tooltip'
import {
  useKeyboardClose,
  useIntoViewerShown,
  useScale,
  useToggle,
  useRotate
} from './hooks'
import styles from './styles.module.scss'

interface Props {
  keyboard: boolean
  onClose(): void
}

const Controller: React.FC<Props> = ({ onClose, keyboard }) => {
  useKeyboardClose(keyboard, onClose)
  const controllerShown = useIntoViewerShown()
  const { zoomin, zoomout, zoomreset } = useScale()
  const { rotate } = useRotate()
  const { goNext, goLast, isCanGoNext, isCanGoLast } = useToggle()

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.close} onClick={onClose}>
          <i className="iconfont icon-close" />
        </div>
      </div>

      <div
        className={styles.bottom + (controllerShown ? ` ${styles.shown}` : '')}
      >
        <div className={styles.controller}>
          {(isCanGoLast || isCanGoNext) && (
            <Fragment>
              <Tooltip content="上一张">
                <div
                  className={
                    `${styles.controllerItem}` +
                    `${isCanGoLast ? '' : ` ${styles.disabled}`}`
                  }
                  onClick={goLast}
                >
                  <i
                    className="iconfont icon-arrow"
                    style={{ transform: 'rotate(180deg)' }}
                  />
                </div>
              </Tooltip>

              <Tooltip content="下一张">
                <div
                  className={
                    `${styles.controllerItem}` +
                    `${isCanGoNext ? '' : ` ${styles.disabled}`}`
                  }
                  onClick={goNext}
                >
                  <i className="iconfont icon-arrow" />
                </div>
              </Tooltip>
              <span className={styles.separator} />
            </Fragment>
          )}

          <Tooltip content="旋转">
            <div className={styles.controllerItem} onClick={rotate}>
              <i
                className="iconfont icon-rotate"
                style={{ transform: 'scaleX(-1) rotate(-90deg)' }}
              />
            </div>
          </Tooltip>

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

          <Tooltip content="还原比例">
            <div className={styles.controllerItem} onClick={zoomreset}>
              <i className="iconfont icon-zoomreset" />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default memo(Controller)
