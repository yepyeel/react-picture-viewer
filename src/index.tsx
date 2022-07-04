import React, { useMemo, Fragment, memo } from 'react'
import ContextProvider, { useStore } from '@/context'
import Browser from '@/components/bussniess/Browser'

export interface IPicture {
  src: string
  alt: string
}

export interface Props {
  style?: React.CSSProperties
  className?: string
  zIndex?: number | string
  keyboard?: boolean
  pictureOrder?: number
  picture: IPicture[] | IPicture
  onPreview?: () => void | Promise<void>
  onOut?: () => void | Promise<void>
}

interface ImgProps {
  firstImg: IPicture
  style?: React.CSSProperties
  className?: string
  onPreview?: () => void | Promise<void>
}

const ImgViewer: React.FC<ImgProps> = memo((props) => {
  const { style, className, firstImg, onPreview } = props
  const { dispatch } = useStore()
  return (
    <img
      className={className}
      style={{ cursor: 'zoom-in', ...style }}
      src={firstImg.src}
      alt={firstImg.alt}
      onClick={async () => {
        await onPreview?.()
        dispatch({ type: 'SHOWN_LAYER', visible: true })
      }}
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
    pictureOrder = 0,
    onPreview,
    onOut
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
        <ImgViewer
          firstImg={firstImg}
          style={style}
          className={className}
          onPreview={onPreview}
        />

        <Browser
          zIndex={zIndex}
          keyboard={keyboard}
          pictureOrder={pictureOrder}
          onOut={onOut}
        />
      </Fragment>
    </ContextProvider>
  )
}

export default PictureViewer
