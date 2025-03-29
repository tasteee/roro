import { v4 as uuid } from 'uuid'
import { Vector3 } from 'three'
import type { ShapeT } from '$lib/types'

class RecentlyUsedShapes {
  list = $state<ShapeT[]>([])

  add(shape: ShapeT) {
    this.remove(shape)
    this.list.push(shape)
  }

  remove(shape: ShapeT) {
    this.list = this.list.filter((stateShape) => {
      return shape.id !== stateShape.id
    })
  }
}

const recentlyUsedShapesStore = new RecentlyUsedShapes()
export default recentlyUsedShapesStore
