import React, { useMemo, Fragment, memo } from 'react'
import ContextProvider, { useStore } from '@/context'
import Browser from '@/components/bussniess/Browser'
import { Props, IPicture } from './interface'

interface ImgProps {
  style?: React.CSSProperties
  className?: string
  firstImg: IPicture
}
const ImgViewer: React.FC<ImgProps> = memo((props) => {
  const { style, className, firstImg } = props
  const { dispatch } = useStore()
  return (
    <img
      className={className}
      style={{ cursor: 'zoom-in', ...style }}
      src={firstImg.src}
      alt={firstImg.alt}
      onClick={() => dispatch({ type: 'SHOWN_LAYER', visible: true })}
    />
  )
})

const PictureViewer: React.FC<Props> = (props) => {
  const {
    className,
    style,
    picture,
    zIndex = 1000,
    keyboard = true,
    currentOrder = 0
  } = props

  const firstImg = useMemo<IPicture>(
    () => (Array.isArray(picture) ? picture[0] : picture),
    [picture]
  )

  const picturesList = useMemo<IPicture[]>(
    () => (Array.isArray(picture) ? picture : [picture]),
    [picture]
  )

  return (
    <ContextProvider picturesList={picturesList}>
      <Fragment>
        <ImgViewer firstImg={firstImg} style={style} className={className} />

        <Browser
          zIndex={zIndex}
          keyboard={keyboard}
          currentOrder={currentOrder}
        />
      </Fragment>
    </ContextProvider>
  )
}

export default PictureViewer
