import { Vector3 } from 'three'
import { v4 as uuid } from 'uuid'
import type { GroupT, ObjectT, OutlineItemT, ShapeT } from '$lib/types'
import type { TransformControlsMode } from 'three/examples/jsm/Addons.js'
import throttle from 'just-throttle'
import inputStore from '../InputStore.svelte'

const createVectorFromPoint = (point: number[]) => {
  return new Vector3(point[0], point[1], point[2])
}

const createShapePointsVectors = (target: number[][]) => {
  return target.map(createVectorFromPoint)
}

const createObject = (shape: ShapeT): ObjectT => {
  return {
    type: 'object',
    pivotPosition: new Vector3(0, 0, 0),
    position: new Vector3(0, 0, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(1, 1, 1),
    shapeName: shape.name,
    points: createShapePointsVectors(shape.points),
    name: shape.name,
    id: uuid(),
    isVisible: true,
    isLocked: false,
    parentId: ''
  }
}

const createGroup = () => {
  return {
    type: 'group',
    pivotPosition: new Vector3(0, 0, 0),
    position: new Vector3(0, 0, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(1, 1, 1),
    name: 'group',
    id: uuid(),
    isOpen: true,
    isVisible: true,
    isLocked: false,
    parentId: ''
  }
}

class OutlineStore {
  items = $state<OutlineItemT[]>([])
  selectedItemIds = $state<string[]>([])
  transformMode = $state<TransformControlsMode>('translate')
  transformSpace = $state('local')
  isSnappingEnabled = $state(true)

  isDragging = $state(false)
  hoveredItemId = $state('')
  isSelectingDisabled = $state(false)

  snapAmount = $derived.by(() => {
    if (!outlineStore.isSnappingEnabled) return null
    if (inputStore.isPressedShift && inputStore.isPressedControl) return 0.005
    if (inputStore.isPressedControl) return 0.01
    if (inputStore.isPressedShift) return 0.025
    return 0.1
  })

  rotationSnapAmount = $derived.by(() => {
    if (!outlineStore.isSnappingEnabled) return null
    if (inputStore.isPressedShift && inputStore.isPressedControl) return 0.1
    if (inputStore.isPressedControl) return 0.25
    if (inputStore.isPressedShift) return 0.45
    return 0.7
  })

  scaleSnapAmount = $derived.by(() => {
    if (!outlineStore.isSnappingEnabled) return null
    if (inputStore.isPressedShift && inputStore.isPressedControl) return 0.01
    if (inputStore.isPressedControl) return 0.05
    if (inputStore.isPressedShift) return 0.1
    return 0.2
  })

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

    console.log({ selectedItems })

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
    console.log('DONE')
  }

  duplicateItem(item: OutlineItemT): OutlineItemT {
    const newItem = { ...item }
    newItem.id = uuid()
    newItem.name = newItem.name + ' copy'
    return newItem
  }

  // Delete selected items
  deleteSelected() {
    if (this.selectedItemIds.length === 0) return

    let newItems = [...this.items]

    // First collect all items to be deleted (including children of groups)
    const itemsToDelete = new Set<string>()

    const addItemAndChildren = (id: string) => {
      itemsToDelete.add(id)
      const children = this.getChildreByParentId(id, newItems)
      children.forEach((child) => addItemAndChildren(child.id))
    }

    this.selectedItemIds.forEach((id) => addItemAndChildren(id))

    // Then filter out all items to be deleted
    newItems = newItems.filter((item) => !itemsToDelete.has(item.id))

    this.items = newItems
    this.selectedItemIds = []
  }

  // Existing methods...
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

  toggleGroupOpen(id: string) {
    const item = this.getItemById(id, this.items) as GroupT
    if (item) item.isOpen = !item.isOpen
  }

  toggleItemVisible(id: string) {
    const item = this.getItemById(id, this.items)
    if (!item) return

    item.isVisible = !item.isVisible
    this.toggleChildrenVisibility(id, item.isVisible)
  }

  // Helper to recursively toggle visibility
  toggleChildrenVisibility(parentId: string, isVisible: boolean) {
    const children = this.getChildreByParentId(parentId, this.items)
    children.forEach((child) => {
      child.isVisible = isVisible
      if (child.type === 'group') {
        this.toggleChildrenVisibility(child.id, isVisible)
      }
    })
  }

  toggleItemLocked(id: string) {
    const item = this.getItemById(id, this.items)
    if (!item) return

    item.isLocked = !item.isLocked
    this.toggleChildrenLocked(id, item.isLocked)
  }

  // Helper to recursively toggle locked state
  toggleChildrenLocked(parentId: string, isLocked: boolean) {
    const children = this.getChildreByParentId(parentId, this.items)
    children.forEach((child) => {
      child.isLocked = isLocked
      if (child.type === 'group') {
        this.toggleChildrenLocked(child.id, isLocked)
      }
    })
  }

  renameItem(id: string, newName: string) {
    const item = this.getItemById(id, this.items)
    if (item) item.name = newName
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

  getFirstItemByIds(ids: string[], target: OutlineItemT[] = this.items) {
    return target.find((item) => {
      return ids.includes(item.id)
    })
  }

  removeItemsByIds(ids: string[], target: OutlineItemT[]) {
    return target.filter((item) => {
      return !ids.includes(item.id)
    })
  }
}

const outlineStore = new OutlineStore()
export default outlineStore
globalThis.outlineStore = outlineStore
