import { BufferGeometry, Vector3 } from 'three'
import type { ConvexGeometry } from 'three/examples/jsm/Addons.js'

// A shape represents an object
// that can be found by browsing
// the shapes browser. They are
// user submitted objects that
// are meant to be referenced as
// templates for creating new
// objects inside of a project.
export type ShapeT = {
  id: string
  name: string
  authorId: string
  createdDate: number
  categories: string[]
  points: VectorArray3[]
}

// ObjectTs are instaciated ShapeTs
// inside of a project. They are living
// entities that can be manipulated inside
// of the 3D workspace.
export type ObjectT = {
  type: string
  id: string
  name: string
  shapeName: string
  geometry: ConvexGeometry | BufferGeometry
  position: VectorArray3
  rotation: VectorArray3
  scale: VectorArray3
  pivotPosition: VectorArray3
  parentId: string
  isVisible: boolean
  isLocked: boolean
}

// GroupTs are containers for ObjectTs
// that allow ObjectTs to be manupulated
// together and maintain their relativity
// to each other.
export type GroupT = {
  type: string
  id: string
  name: string
  parentId: string
  position: VectorArray3
  rotation: VectorArray3
  scale: VectorArray3
  pivotPosition: VectorArray3
  isVisible: boolean
  isLocked: boolean
  isOpen: boolean
}

export type OutlineItemT = ObjectT | GroupT

export type ShapeCategoryT = {
  id: string
  name: string
  shapes: ShapeT[]
}
