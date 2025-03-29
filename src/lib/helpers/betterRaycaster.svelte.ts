import { injectPlugin, isInstanceOf } from '@threlte/core'
import type { BufferGeometry, Mesh } from 'three'
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh'

export const betterRaycaster = () => {
  injectPlugin('bvh-raycast', (args) => {
    $effect(() => {
      const isBufferGeometry = isInstanceOf(args.ref, 'BufferGeometry')
      const isMesh = isInstanceOf(args.ref, 'Mesh')

      if (isBufferGeometry) {
        args.ref.computeBoundsTree = computeBoundsTree
        args.ref.disposeBoundsTree = disposeBoundsTree
        args.ref.computeBoundsTree()
      }

      if (isMesh) args.ref.raycast = acceleratedRaycast
      return () => isBufferGeometry && args.ref.disposeBoundsTree()
    })
  })
}

export const hoverRaycast = (ref: any) => (raycaster: any, intersects: any) => {
  ref.raycast(raycaster, intersects)

  const receivedHit = intersects.length > 0
  if (!receivedHit) return

  intersects.sort((a: any, b: any) => {
    return a.distance - b.distance
  })

  const intersectionIndex = intersects.findIndex((intersect: any) => {
    return intersect.object === ref
  })

  const isThisObjectClosest = intersectionIndex === 0
  // If this object isn't the closest, remove its intersection
  if (!isThisObjectClosest) intersects.splice(intersectionIndex, 1)
  // Remove all other intersections if this is the closest
  if (isThisObjectClosest) intersects.splice(1)
}
