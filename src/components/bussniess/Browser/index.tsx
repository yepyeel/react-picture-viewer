import React, { Fragment, memo } from 'react'
import { useStore } from '@/context'
import { Portal } from 'react-portal'
import Viewer from '../Viewer'
import Controller from '../Controller'
import ScaleTip from '@/components/common/ScaleTip'
import { Props } from './interface.d'
import styles from './styles.module.scss'

const Browser: React.FC<Props> = (props) => {
  const { keyboard, currentOrder } = props
  const { layerShown, dispatch } = useStore()

  return (
    <Fragment>
      {layerShown && (
        <Portal>
          <div className={styles.wrapperLayer}>
            <Viewer currentOrder={currentOrder} />

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
