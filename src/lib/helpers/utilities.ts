import { MathUtils } from 'three'
import * as threeHelpers from './three'

class MeshesHelpers {
  getDimensionsFromGLTF = (json: any) => {
    const positionAccessorIndex = json.meshes[0].primitives[0].attributes.POSITION
    const positionAccessor = json.accessors[positionAccessorIndex]
    const { min, max } = positionAccessor

    if (!min || !max || min.length !== 3 || max.length !== 3) {
      throw new Error(
        'Invalid POSITION accessor: min and max values are required and should have 3 components.'
      )
    }

    return {
      x: max[0] - min[0],
      y: max[1] - min[1],
      z: max[2] - min[2]
    }
  }
}

class NumberHelpers {
  percentageToRadians(percentage: number): number {
    const degrees = (percentage / 100) * 360
    return degrees * MathUtils.DEG2RAD
  }

  radiansToPercentage(radians: number): number {
    const degrees = radians * MathUtils.RAD2DEG
    return (degrees / 360) * 100
  }

  percentageToDegrees(percentage: number): number {
    percentage = percentage % 360
    if (percentage < 0) percentage += 360
    return (percentage * Math.PI) / 180
  }

  toDecimals(value: number = 0, decimals: number = 2): number {
    return parseFloat(value.toFixed(decimals))
  }

  toInteger(value: number): number {
    return Math.round(value)
  }

  // 1 unit in the 3D space is 3 feet.
  // sizeToScale(80) // would be 80% of 1 unit.
  // 100% of 1 unit is 1 unit, which is 3 feet.
  // 80% of 1 unit is 0.8 units, which is 2.4 feet.
  // 42% of 1 unit is 0.42 units, which is 1.26 feet.
  sizeToScale(value: number): number {
    return value / 100
  }

  // unitToFeet(2.4) // would be 2.4 units, which is 7.2 feet.
  // unitToFeet(0.42) // would be 0.42 units, which is 1.26 feet.
  // unitToFeet(82) // would be 82 units, which is 246 feet.
  unitToFeet(units: number): number {
    return units * 3
  }

  percentageToOpacity(percentage: number): number {
    return percentage / 100
  }

  opacityToPercentage(opacity: number): number {
    return opacity * 100
  }

  percentageToRange(percentage: number, min: number, max: number): number {
    return (percentage / 100) * (max - min) + min
  }

  formatAsPercentage(value: number): string {
    return Math.round(value * 100) + '%'
  }

  formatAsFeet(value: number): string {
    return value.toFixed(1) + ' ft'
  }

  withMaxDecimals(value: number, decimals: number = 2): number {
    return parseFloat(value.toFixed(decimals))
  }
}

class ArrayHelpers {
  without(target: any[], source: any) {
    return target.filter((item) => item !== source)
  }

  includesSome(target: any[], source: any[]) {
    return source.some((item) => target.includes(item))
  }

  includesAll(target: any[], source: any[]) {
    return source.every((item) => target.includes(item))
  }

  matchId(id: string) {
    return (item: any) => item.id === id
  }

  unmatchId(id: string) {
    return (item: any) => item.id !== id
  }
}

class ColorHelpers {
  getContrastingTextColor(hex: string) {
    const isHexColor = hex.startsWith('#')
    if (!isHexColor) return 'black'
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return brightness > 0.5 ? 'black' : 'white'
  }
}

class EventHelpers {
  getKey(event: KeyboardEvent) {
    const key = event.key.toLowerCase()
    return key === ' ' ? 'space' : key
  }
}

class Utilities {
  three = threeHelpers
  meshes = new MeshesHelpers()
  number = new NumberHelpers()
  array = new ArrayHelpers()
  color = new ColorHelpers()
  event = new EventHelpers()

  capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  windowEvent = (eventName: string, handler: (event: Event) => void) => {
    window.addEventListener(eventName, handler)
    return () => window.removeEventListener(eventName, handler)
  }
}

export default new Utilities()
