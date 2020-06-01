import React, { Fragment, memo, useEffect } from 'react'
import { useStore } from '@/context'
import { Portal } from 'react-portal'
import Viewer from '../Viewer'
import Controller from '../Controller'
import ScaleTip from '@/components/common/ScaleTip'
import { Props } from './interface.d'
import styles from './styles.module.scss'

const Browser: React.FC<Props> = (props) => {
  const { keyboard, pictureOrder, zIndex } = props
  const { layerShown, dispatch } = useStore()

  useEffect(() => {
    if (layerShown) {
      dispatch({ type: 'SET_PICTURE_ORDER', order: pictureOrder })
    }
  }, [layerShown])

  return (
    <Fragment>
      {layerShown && (
        <Portal>
          <div
            className={styles.wrapperLayer}
            style={{ zIndex: +zIndex || 1000 }}
          >
            <Viewer />

            <Controller
              keyboard={keyboard}
              onClose={() => dispatch({ type: 'SHOWN_LAYER', visible: false })}
            />

            <ScaleTip />
          </div>
        </Portal>
      )}
    </Fragment>
  )
}

export default memo(Browser)
