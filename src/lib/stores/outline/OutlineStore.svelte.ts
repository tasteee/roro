import { Box3, Euler, Matrix4, Mesh, Quaternion, Vector3 } from 'three'
import { v4 as uuid } from 'uuid'
import * as THREE from 'three'
import type { ObjectT, OutlineItemT, ShapeT } from '$lib/types'
import store from 'store'

import {
  BufferGeometryUtils,
  ConvexGeometry,
  type TransformControlsMode
} from 'three/examples/jsm/Addons.js'

import throttle from 'just-throttle'
import inputStore from '../InputStore.svelte'
import { createObject, createGroup } from './create'
import { saveProjectToJson } from './persistence'
import superjson from 'superjson'

class OutlineStore {
  items = $state<OutlineItemT[]>([])
  selectedItemIds = $state<string[]>([])
  transformMode = $state<TransformControlsMode>('translate')
  transformSpace = $state('local')
  isSnappingEnabled = $state(true)

  isDragging = $state(false)
  hoveredItemId = $state('')
  isSelectingDisabled = $state(false)
  meshes = {} as any

  snapAmount = $derived.by(() => {
    if (!this.isSnappingEnabled) return null
    if (inputStore.isPressedShift && inputStore.isPressedControl) return 0.005
    if (inputStore.isPressedControl) return 0.01
    if (inputStore.isPressedShift) return 0.025
    return 0.1
  })

  // TODO: Get these values fine tuned.
  // Ideally, without a modifier key rotation would happen in 45 degree snaps.
  // With shift, 20 degree snaps.
  // With control, 10 degree snaps.
  // With shift and control, 5 degree snaps.
  rotationSnapAmount = $derived.by(() => {
    if (!this.isSnappingEnabled) return null
    if (inputStore.isPressedShift && inputStore.isPressedControl) return 0.1
    if (inputStore.isPressedControl) return 0.25
    if (inputStore.isPressedShift) return 0.45
    return 0.7
  })

  scaleSnapAmount = $derived.by(() => {
    if (!this.isSnappingEnabled) return null
    if (inputStore.isPressedShift && inputStore.isPressedControl) return 0.01
    if (inputStore.isPressedControl) return 0.05
    if (inputStore.isPressedShift) return 0.1
    return 0.2
  })

  mergeSelection() {
    const selectedItems = this.getSelectedItems()
    const objectsToMerge = selectedItems.filter((item) => item.type === 'object') as ObjectT[]
    if (objectsToMerge.length <= 1) return

    const topmostItem = this.getTopmostItem(objectsToMerge)
    const topmostIndex = this.items.indexOf(topmostItem)
    const parentId = topmostItem.parentId

    const geometriesToMerge = objectsToMerge.map((object) => {
      const mesh = this.meshes[object.id]
      const geometry = mesh.geometry.clone()
      geometry.applyMatrix4(mesh.matrixWorld)
      return geometry
    })

    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometriesToMerge, false)
    mergedGeometry.computeBoundingBox()

    const mergedObject = {
      type: 'object',
      pivotPosition: [0, 0, 0],
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      shapeName: 'merged',
      name: 'Merged Object',
      id: uuid(),
      isVisible: true,
      isLocked: false,
      parentId,
      geometry: mergedGeometry
    }

    const boundingBox = new Box3().setFromObject(new Mesh(mergedGeometry))
    const center = new Vector3()
    boundingBox.getCenter(center)

    mergedGeometry.translate(-center.x, 0, -center.z)
    mergedObject.pivotPosition = [-center.x, 0, -center.z]

    const objectIdsToRemove = objectsToMerge.map((obj) => obj.id)
    const newItems = this.removeItemsById(objectIdsToRemove)
    newItems.splice(topmostIndex, 0, mergedObject)
    this.items = newItems
    this.selectedItemIds = [mergedObject.id]
  }

  removeItemsById(ids: string[], target: OutlineItemT[] = this.items) {
    return target.filter((item) => !ids.includes(item.id))
  }

  selectAll = () => {
    const ids = this.items.map((item) => item.id)
    this.selectedItemIds = ids
  }

  setTransformMode(value: string) {
    this.transformMode = value as TransformControlsMode
  }

  toggleSnappingEnabled() {
    this.isSnappingEnabled = !this.isSnappingEnabled
  }

  toggleTransformSpace = throttle(() => {
    const newValue = this.transformSpace === 'local' ? 'world' : 'local'
    this.transformSpace = newValue
    console.log(newValue)
  }, 350)

  addObject(options: ShapeT) {
    const shape = createObject(options)
    let newItems = [...this.items]

    if (this.selectedItemIds.length === 0) {
      // Add shape at the top level (topmost in the panel)
      shape.parentId = ''
      newItems.unshift(shape)
    } else if (this.selectedItemIds.length === 1) {
      const selectedItem = this.getItemById(this.selectedItemIds[0], newItems)
      if (!selectedItem) return

      if (selectedItem.type === 'group') {
        // Add shape inside the selected group
        shape.parentId = selectedItem.id

        // Find where to insert - should be at the top of the group's contents
        const firstChildIndex = this.findFirstChildIndex(selectedItem.id, newItems)
        if (firstChildIndex !== -1) {
          newItems.splice(firstChildIndex, 0, shape)
        } else {
          // No children yet, find the group and insert after it
          const groupIndex = newItems.indexOf(selectedItem)
          newItems.splice(groupIndex + 1, 0, shape)
        }
      } else {
        // Add shape at the same level as the selected item, right above it
        shape.parentId = selectedItem.parentId
        const selectedIndex = newItems.indexOf(selectedItem)
        newItems.splice(selectedIndex + 1, 0, shape)
      }
    } else {
      // Multi-selection: Add shape above the topmost selected item
      const selectedItems = this.getSelectedItems()
      const topmostItem = this.getTopmostItem(selectedItems, newItems)
      if (!topmostItem) return

      shape.parentId = topmostItem.parentId
      const topmostIndex = newItems.indexOf(topmostItem)
      newItems.splice(topmostIndex, 0, shape)
    }

    this.items = newItems
    this.selectedItemIds = [shape.id]
  }

  addGroup() {
    const group = createGroup()
    let newItems = [...this.items]
    const selectedItems = this.getSelectedItems()

    if (selectedItems.length === 0) {
      // If nothing is selected, add the group to the top
      newItems.unshift(group)
      this.items = newItems
      this.selectedItemIds = [group.id]
      return
    }

    // Find the topmost selected item for insertion point
    const topmostItem = this.getTopmostItem(selectedItems, newItems)
    if (!topmostItem) return

    const insertionIndex = newItems.indexOf(topmostItem)
    group.parentId = topmostItem.parentId

    // Handle group creation with selection
    const itemsToGroup = selectedItems.filter((item) => item.parentId === topmostItem.parentId)

    if (itemsToGroup.length > 0) {
      // Remove items that will go into the group
      newItems = newItems.filter((item) => !itemsToGroup.includes(item))

      // Insert the group
      newItems.splice(insertionIndex, 0, group)

      // Add the items back inside the group
      itemsToGroup.forEach((item) => {
        const updatedItem = { ...item, parentId: group.id }
        newItems.splice(insertionIndex + 1, 0, updatedItem)
      })
    } else {
      // Just insert an empty group
      newItems.splice(insertionIndex, 0, group)
    }

    this.items = newItems
    this.selectedItemIds = [group.id]
  }

  getSelectedItems() {
    return this.items.filter((item) => {
      return this.selectedItemIds.includes(item.id)
    })
  }

  getTopmostItem(items: OutlineItemT[], target: OutlineItemT[] = this.items): OutlineItemT {
    const ids = items.map((item) => item.id)

    return target.find((item) => {
      return ids.includes(item.id)
    }) as OutlineItemT
  }

  findFirstChildIndex(parentId: string, target: OutlineItemT[] = this.items): number {
    return target.findIndex((item) => item.parentId === parentId)
  }

  moveItemUp(id: string) {
    const item = this.getItemById(id, this.items)
    if (!item) return

    const newItems = [...this.items]
    const itemIndex = newItems.indexOf(item)

    if (itemIndex <= 0) return // Already at the top

    // Find the previous sibling (item with same parentId)
    let prevIndex = itemIndex - 1
    while (prevIndex >= 0) {
      if (newItems[prevIndex].parentId === item.parentId) {
        break
      }
      prevIndex--
    }

    if (prevIndex < 0)
      return // No siblings above
      // Swap with previous sibling
    ;[newItems[itemIndex], newItems[prevIndex]] = [newItems[prevIndex], newItems[itemIndex]]
    this.items = newItems
  }

  // Move item down in the layer order
  moveItemDown(id: string) {
    const item = this.getItemById(id, this.items)
    if (!item) return

    const newItems = [...this.items]
    const itemIndex = newItems.indexOf(item)

    if (itemIndex >= newItems.length - 1) return // Already at the bottom

    // Find the next sibling (item with same parentId)
    let nextIndex = itemIndex + 1
    while (nextIndex < newItems.length) {
      if (newItems[nextIndex].parentId === item.parentId) {
        break
      }
      nextIndex++
    }

    if (nextIndex >= newItems.length)
      return // No siblings below
      // Swap with next sibling
    ;[newItems[itemIndex], newItems[nextIndex]] = [newItems[nextIndex], newItems[itemIndex]]
    this.items = newItems
  }

  // Ungroup a group
  ungroup(id: string) {
    const group = this.getItemById(id, this.items)
    if (!group || group.type !== 'group') return

    const newItems = [...this.items]
    const groupIndex = newItems.indexOf(group)
    const groupParentId = group.parentId
    // Get all children of the group
    const children = this.getChildreByParentId(id, newItems)
    // Remove the group
    newItems.splice(groupIndex, 1)
    // Update children's parentId and insert them where the group was
    children.forEach((child, index) => {
      const updatedChild = { ...child, parentId: groupParentId }
      newItems.splice(groupIndex + index, 0, updatedChild)
    })

    this.items = newItems
    this.selectedItemIds = children.map((child) => child.id)
  }

  // Duplicate selected items
  duplicateSelected() {
    if (this.selectedItemIds.length === 0) return
    const newItems = this.items.slice()
    const newSelectedIds: string[] = []
    const selectedItems = this.getSelectedItems()

    for (const item of selectedItems) {
      console.log('duplicating ', item.name)
      if (item.name.length > 20) break
      const duplicate = this.duplicateItem(item)
      newSelectedIds.push(duplicate.id)
      const itemIndex = newItems.indexOf(item)
      newItems.splice(itemIndex + 1, 0, duplicate)

      // If it's a group, also duplicate its children
      if (item.type === 'group') {
        console.log('IS A GROUP')
        const children = this.getChildreByParentId(item.id, this.items)
        const duplicatedChildren = children.map((child) => {
          const duplicatedChild = this.duplicateItem(child)
          duplicatedChild.parentId = duplicate.id
          return duplicatedChild
        })

        // Insert duplicated children after the group
        duplicatedChildren.forEach((child, index) => {
          newItems.splice(itemIndex + 2 + index, 0, child)
        })
      }
    }

    this.items = newItems
    this.selectedItemIds = newSelectedIds
  }

  duplicateItem(item: OutlineItemT): OutlineItemT {
    const newItem = { ...item }
    newItem.id = uuid()
    newItem.name = newItem.name + ' copy'
    return newItem
  }

  deleteSelected() {
    if (this.selectedItemIds.length === 0) return
    let newItems = [...this.items]
    // collect all items to be deleted (including children of groups)
    const itemsToDelete = new Set<string>()

    const addItemAndChildren = (id: string) => {
      itemsToDelete.add(id)
      const children = this.getChildreByParentId(id, newItems)
      children.forEach((child) => addItemAndChildren(child.id))
    }

    this.selectedItemIds.forEach((id) => addItemAndChildren(id))
    // filter out all items to be deleted
    newItems = newItems.filter((item) => !itemsToDelete.has(item.id))
    this.items = newItems
    this.selectedItemIds = []
  }

  selectItem(id: string) {
    this.selectedItemIds = [id]
  }

  clearSelection = () => {
    this.selectedItemIds = []
  }

  addToSelection(id: string) {
    if (!this.selectedItemIds.includes(id)) {
      this.selectedItemIds.push(id)
    }
  }

  removeFromSelection(id: string) {
    this.selectedItemIds = this.selectedItemIds.filter((itemId) => {
      return itemId !== id
    })
  }

  // recursively toggle visibility
  toggleChildrenVisibility(parentId: string, isVisible: boolean) {
    const children = this.getChildreByParentId(parentId, this.items)
    children.forEach((child) => {
      child.isVisible = isVisible
      if (child.type === 'group') {
        this.toggleChildrenVisibility(child.id, isVisible)
      }
    })
  }

  // recursively toggle locked state
  toggleChildrenLocked(parentId: string, isLocked: boolean) {
    const children = this.getChildreByParentId(parentId, this.items)
    children.forEach((child) => {
      child.isLocked = isLocked
      if (child.type === 'group') {
        this.toggleChildrenLocked(child.id, isLocked)
      }
    })
  }

  getChildreByParentId(id: string, target: OutlineItemT[] = this.items) {
    return target.filter((item) => {
      return item.parentId === id
    })
  }

  getItemById(id: string, target: OutlineItemT[] = this.items) {
    return target.find((item) => {
      return item.id === id
    }) as OutlineItemT
  }
}

const outlineStore = new OutlineStore()
export default outlineStore
