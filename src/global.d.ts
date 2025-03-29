declare module 'array-range'

type XYZNumbers = [number, number, number]

type SoundConfigT = {
  path: string
  volume: number
  playbackRate: number
  debounceRate: number
}

type SoundsConfigsT = {
  [key: string]: SoundConfigT
}
