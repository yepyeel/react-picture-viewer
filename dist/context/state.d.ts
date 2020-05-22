import { IPicture } from '@/components/bussniess/PictureViewer/interface';
export interface IState {
    layerShown: boolean;
    picturesList: IPicture[];
    imgScale: number;
}
export declare const initialState: (picturesList: IPicture[]) => IState;
