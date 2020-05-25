interface SHOWN_LAYER {
  type: 'SHOWN_LAYER'
  visible: boolean
}

interface SET_SCALE {
  type: 'SET_SCALE'
  scale: number
}

interface SET_ROTATE {
  type: 'SET_ROTATE'
  rotate: number
}

interface SET_PICTURE_ORDER {
  type: 'SET_PICTURE_ORDER'
  order: number
}

export type IAction = SHOWN_LAYER | SET_SCALE | SET_ROTATE | SET_PICTURE_ORDER
