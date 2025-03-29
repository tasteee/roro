import { Vector3 } from 'three'

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
  points: number[][]
}

// ObjectTs are instaciated ShapeTs
// inside of a project. They are living
// entities that can be manipulated inside
// of the 3D workspace.
export type ObjectT = {
  type: 'object'
  id: string
  name: string
  shapeName: string
  points: Vector3[]
  position: Vector3
  rotation: Vector3
  scale: Vector3
  pivotPosition: Vector3
  parentId: string
  isVisible: boolean
  isLocked: boolean
}

// GroupTs are containers for ObjectTs
// that allow ObjectTs to be manupulated
// together and maintain their relativity
// to each other.
export type GroupT = {
  type: 'group'
  id: string
  name: string
  parentId: string
  points: Vector3[]
  position: Vector3
  rotation: Vector3
  scale: Vector3
  pivotPosition: Vector3
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
