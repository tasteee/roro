import type { ObjectT, ShapeCategoryT, ShapeT } from '$lib/types'
import { v4 as uuid } from 'uuid'

export const cube = {
  id: 'cube',
  name: 'Cube',
  authorId: '12345',
  createdDate: 12345,
  categories: ['basic', 'boxy'],
  points: [
    // Bottom square
    [0, 0, 0],
    [0, 0, 1],
    [1, 0, 0],
    [1, 0, 1],
    // Top square
    [0, 1, 0],
    [0, 1, 1],
    [1, 1, 1],
    [1, 1, 0]
  ]
}

export const cone = {
  id: 'cone',
  name: 'Cone',
  authorId: '12345',
  createdDate: 12345,
  categories: ['basic', 'triangular'],
  points: [
    // Bottom square
    [0, 0, 0],
    [0, 0, 1],
    [1, 0, 0],
    [1, 0, 1],
    // Top point
    [0.5, 1, 0.5]
  ]
}

export const rightTriangle = {
  id: 'rightTriangle',
  name: 'Right Triangle',
  authorId: '12345',
  createdDate: 12345,
  categories: ['basic', 'triangular'],
  points: [
    // Bottom square
    [0, 0, 0],
    [0, 0, 1],
    [1, 0, 0],
    [1, 0, 1],
    [1, 1, 1],
    [1, 1, 0]
  ]
}

export const pyramid = {
  id: 'pyramid',
  name: 'Pyramid',
  authorId: '12345',
  createdDate: 12345,
  categories: ['basic', 'pointy'],
  points: [
    // Base square
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
    // Apex point
    [0.5, 0.5, 1]
  ]
}
export const cylinder = {
  id: 'cylinder',
  name: 'Cylinder',
  authorId: '12345',
  createdDate: 12345,
  categories: ['rounded', '3d'],
  points: [
    // Bottom circle (approximated with a hexagon for simplicity)
    [0.5, 0, 0], // Center bottom
    [0, 0, 0.5],
    [0.5, 0, 1],
    [1, 0, 0.5],
    [1, 0, -0.5],
    [0.5, 0, -1],
    [0, 0, -0.5],
    // Top circle (same as bottom but elevated)
    [0.5, 1, 0], // Center top
    [0, 1, 0.5],
    [0.5, 1, 1],
    [1, 1, 0.5],
    [1, 1, -0.5],
    [0.5, 1, -1],
    [0, 1, -0.5]
  ]
}

export const sphere = {
  id: 'sphere',
  name: 'Sphere',
  authorId: '12345',
  createdDate: 12345,
  categories: ['rounded', '3d'],
  points: [
    // Approximating a sphere with points on different latitudes
    // Top point (north pole)
    [0.5, 1, 0.5],
    // Latitude near the top
    [0.25, 0.75, 0.25],
    [0.75, 0.75, 0.25],
    [0.75, 0.75, 0.75],
    [0.25, 0.75, 0.75],
    // Equator
    [0, 0.5, 0.5],
    [1, 0.5, 0.5],
    [0.5, 0.5, 1],
    [0.5, 0.5, 0],
    // Latitude near the bottom
    [0.25, 0.25, 0.25],
    [0.75, 0.25, 0.25],
    [0.75, 0.25, 0.75],
    [0.25, 0.25, 0.75],
    // Bottom point (south pole)
    [0.5, 0, 0.5]
  ]
}

export const diamond = {
  id: 'diamond',
  name: 'Diamond',
  authorId: '12345',
  createdDate: 12345,
  categories: ['basic', 'sharp'],
  points: [
    // Top point
    [0.5, 1, 0.5],
    // Middle square (equator)
    [0, 0.5, 0],
    [1, 0.5, 0],
    [1, 0.5, 1],
    [0, 0.5, 1],
    // Bottom point
    [0.5, 0, 0.5]
  ]
}

export const donut = {
  id: 'donut',
  name: 'Donut',
  authorId: '12345',
  createdDate: 12345,
  categories: ['rounded', 'hollow'],
  points: [
    // Outer circle (approximated with points around a larger radius)
    [1, 0, 0], // Right
    [0.707, 0.707, 0], // Top-right
    [0, 1, 0], // Top
    [-0.707, 0.707, 0], // Top-left
    [-1, 0, 0], // Left
    [-0.707, -0.707, 0], // Bottom-left
    [0, -1, 0], // Bottom
    [0.707, -0.707, 0], // Bottom-right

    // Inner circle (approximated with points around a smaller radius)
    [0.5, 0, 0], // Right (inner)
    [0.354, 0.354, 0], // Top-right (inner)
    [0, 0.5, 0], // Top (inner)
    [-0.354, 0.354, 0], // Top-left (inner)
    [-0.5, 0, 0], // Left (inner)
    [-0.354, -0.354, 0], // Bottom-left (inner)
    [0, -0.5, 0], // Bottom (inner)
    [0.354, -0.354, 0] // Bottom-right (inner)
  ]
}

export const shapes = [cube, cone, rightTriangle, pyramid, cylinder, sphere, diamond, donut]

export const categories: ShapeCategoryT[] = [
  {
    id: uuid(),
    name: 'Basic',
    shapes: [...shapes]
  }
]

export const getShapeByName = (name: string) => {
  return shapes.find((shape) => shape.name === name) as ShapeT
}
