import React, { createContext, useReducer, Dispatch, useContext } from 'react'
import { initialState, IState } from './state'
import { IAction } from './action'
import reducer from './reducer'
import { IPicture } from '@/components/bussniess/PictureViewer/interface'

interface IContext extends IState {
  dispatch: Dispatch<IAction>
}
const Context = createContext(null as IContext | null)

interface Props {
  picturesList: IPicture[]
}

const ContextProvider: React.FC<Props> = ({ children, picturesList }) => {
  const [state, dispatch] = useReducer(reducer, initialState(picturesList))

  return (
    <Context.Provider value={{ dispatch, ...state }}>
      {children}
    </Context.Provider>
  )
}

export function useStore() {
  const store = useContext(Context)
  if (!store) {
    throw new Error('store is Empty')
  }

  return store
}

export default ContextProvider
