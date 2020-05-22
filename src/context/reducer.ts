import { IState } from './state'
import { IAction } from './action'

function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case 'SHOWN_LAYER': {
      const returnState = { ...state, layerShown: action.visible }
      if (!action.visible) returnState.imgScale = 1
      return returnState
    }

    case 'SET_SCALE': {
      return { ...state, imgScale: action.scale }
    }

    default:
      return state
  }
}

export default reducer
