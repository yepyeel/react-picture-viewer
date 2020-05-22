import { IState } from './state';
import { IAction } from './action';
declare function reducer(state: IState, action: IAction): IState;
export default reducer;
