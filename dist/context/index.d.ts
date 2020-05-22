import React, { Dispatch } from 'react';
import { IState } from './state';
import { IAction } from './action';
import { IPicture } from '@/components/bussniess/PictureViewer/interface';
interface IContext extends IState {
    dispatch: Dispatch<IAction>;
}
interface Props {
    picturesList: IPicture[];
}
declare const ContextProvider: React.FC<Props>;
export declare function useStore(): IContext;
export default ContextProvider;
