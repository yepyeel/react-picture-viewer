export interface Props {
  keyboard: boolean
  zIndex: number | string
  pictureOrder: number
  onOut?: () => void | Promise<void>
}
