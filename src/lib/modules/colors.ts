import { colord, extend } from 'colord'
import lchPlugin from 'colord/plugins/lch'
import mixPlugin from 'colord/plugins/mix'

extend([lchPlugin, mixPlugin])

export { colord }

export function getContrastingTextColor(hex: string): string {
  return colord(hex).isDark() ? 'white' : 'black'
}

export const createColorsRange = (startColor: string, endColor: string, count: number) => {
  const start = colord(startColor)
  const end = colord(endColor)
  const bars = new Array(count)

  bars[0] = colord(startColor).toLch()

  for (let i = 1; i < count - 1; i++) {
    const t = i / (count - 1)
    const oklch = colord(start).mix(colord(end), t).toLch()
    bars[i] = oklch
  }

  bars[count - 1] = colord(endColor).toLch()
  return bars
}
