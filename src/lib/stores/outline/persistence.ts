import type { OutlineItemT } from '$lib/types'
import { Vector3 } from 'three'
import outlineStore from './OutlineStore.svelte'
import { getCenteredGeometry } from './create'

export function serializeOutlineState() {
  // Deep clone the items to avoid modifying originals
  const serialized = outlineStore.items.map((item) => {
    const serializedItem = {
      ...item,
      position: { x: item.position.x, y: item.position.y, z: item.position.z },
      rotation: { x: item.rotation.x, y: item.rotation.y, z: item.rotation.z },
      scale: { x: item.scale.x, y: item.scale.y, z: item.scale.z },
      pivotPosition: { x: item.pivotPosition.x, y: item.pivotPosition.y, z: item.pivotPosition.z }
    } as OutlineItemT

    if (item.type === 'object') {
      serializedItem.points = item.points.map((p) => [p.x, p.y, p.z])
      delete serializedItem.geometry
    }

    return serializedItem
  })

  const final = JSON.parse(JSON.stringify(serialized))

  // Create a complete state object
  const stateToSave = {
    items: final,
    version: '1.0' // Adding version helps with future format changes
  }

  return stateToSave
}

export function saveProjectToJson() {
  const stateJson = serializeOutlineState()
  const jsonString = JSON.stringify(stateJson)

  // For browser:
  localStorage.setItem('outlineProject', jsonString)

  // // Or for download as file:
  // const blob = new Blob([jsonString], { type: 'application/json' });
  // const url = URL.createObjectURL(blob);
  // const a = document.createElement('a');
  // a.href = url;
  // a.download = 'project.json';
  // a.click();
  // URL.revokeObjectURL(url);

  return jsonString
}

export function hydrateOutlineStore(jsonData) {
  let data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData

  const hydratedItems = data.items.map((item: OutlineItemT) => {
    // Recreate Vector3 objects
    item.position = new Vector3(item.position.x, item.position.y, item.position.z)
    item.rotation = new Vector3(item.rotation.x, item.rotation.y, item.rotation.z)
    item.scale = new Vector3(item.scale.x, item.scale.y, item.scale.z)
    item.pivotPosition = new Vector3(
      item.pivotPosition.x,
      item.pivotPosition.y,
      item.pivotPosition.z
    )

    // For object type, recreate points and geometry
    if (item.type === 'object' && item.points) {
      // Recreate Vector3 points
      item.points = item.points.map((p) => new Vector3(p[0], p[1], p[2]))
      // Recreate the geometry using the points
      item.geometry = getCenteredGeometry(item.points)
    }

    return item
  })

  // Update the store
  outlineStore.items = hydratedItems
  outlineStore.selectedItemIds = [] // Reset selection

  return outlineStore
}

export function loadProjectFromJson(jsonString) {
  // From localStorage:
  const stored = jsonString || localStorage.getItem('outlineProject')

  if (stored) {
    return hydrateOutlineStore(stored)
  } else {
    console.error('No project data found')
    return null
  }
}
