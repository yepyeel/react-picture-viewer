import { IPicture } from '@/components/bussniess/PictureViewer/interface'

export interface IState {
  layerShown: boolean
  picturesList: IPicture[]
  imgScale: number
}

export const initialState = (picturesList: IPicture[]): IState => ({
  picturesList,
  layerShown: false,
  imgScale: 1
})
