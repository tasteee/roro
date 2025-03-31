import type { ShapeT, ObjectT } from '$lib/types'
import { Box3, Vector3 } from 'three'
import { ConvexGeometry } from 'three/examples/jsm/Addons.js'
import outlineStore from './OutlineStore.svelte'
import { v4 as uuid } from 'uuid'

const createShapePointsVectors = (target: number[][]): Vector3[] => {
  return target.map((point) => new Vector3(point[0], point[1], point[2]))
}

export const getCenteredGeometry = (points: VectorArray3[]): ConvexGeometry => {
  const vectorPoints = createShapePointsVectors(points)
  const convexGeometry = new ConvexGeometry(vectorPoints)
  convexGeometry.computeBoundingBox()
  const boundingBox = convexGeometry.boundingBox as Box3
  const center = new Vector3()
  boundingBox.getCenter(center)
  convexGeometry.translate(-center.x, -center.y, -center.z)
  return convexGeometry
}

export const createObject = (shape: ShapeT, overrideGeometry?: any): ObjectT => {
  const geometry = overrideGeometry ?? getCenteredGeometry(shape.points)

  return {
    type: 'object',
    pivotPosition: [0, 0, 0],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    shapeName: shape.name,
    name: shape.name,
    id: uuid(),
    isVisible: true,
    isLocked: false,
    parentId: '',
    geometry
  }
}

export const createGroup = () => {
  return {
    type: 'group',
    pivotPosition: [0, 0, 0],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    name: 'group',
    id: uuid(),
    isOpen: true,
    isVisible: true,
    isLocked: false,
    parentId: ''
  }
}
