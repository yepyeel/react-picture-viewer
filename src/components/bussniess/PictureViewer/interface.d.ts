import * as React from 'react'

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
}
