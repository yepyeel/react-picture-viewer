import { IPicture } from '..'

export interface IState {
  layerShown: boolean
  picturesList: IPicture[]
  pictureOrder: number
  imgScale: number
  imgRotate: number
}

interface initialProps {
  picturesList: IPicture[]
}

export const initialState = ({ picturesList }: initialProps): IState => ({
  picturesList,
  layerShown: false,
  imgScale: 1,
  pictureOrder: 0,
  imgRotate: 0
})
