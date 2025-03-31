import { Euler, Mesh, Vector3 } from 'three'
import * as THREE from 'three'
import store from 'store'
import outlineStore from '../stores/outline/OutlineStore.svelte'
import { ConvexGeometry } from 'three/examples/jsm/Addons.js'

import superjson from 'superjson'

const save = () => {
  const itemsToSave = outlineStore.items.map((item) => {
    if (item.type === 'object') {
      // For object types, we need to serialize the geometry
      // Get the mesh from your meshes store
      const mesh = outlineStore.meshes[item.id]

      // Check if item has a geometry property
      if (item.geometry) {
        // Determine if it's a ConvexGeometry or standard BufferGeometry
        const isConvexGeometry =
          item.geometry.type === 'ConvexGeometry' || item.geometry instanceof ConvexGeometry

        let geometryData
        if (isConvexGeometry) {
          // For ConvexGeometry, we need to extract the position attribute
          const positions = item.geometry.attributes.position
          const vertices = []

          for (let i = 0; i < positions.count; i++) {
            vertices.push({
              x: positions.getX(i),
              y: positions.getY(i),
              z: positions.getZ(i)
            })
          }

          geometryData = {
            type: 'ConvexGeometry',
            vertices: vertices
          }
        } else {
          // For standard BufferGeometry, use Three.js serialization
          geometryData = item.geometry.toJSON()
        }

        // Return the item with serialized geometry
        return {
          ...item,
          geometry: geometryData,
          // Also store material data if needed
          materialData: mesh?.material ? mesh.material.toJSON() : null
        }
      }
    }

    // For groups or other types, just return as is
    return { ...item }
  })

  // Use superjson (which you import) for better serialization
  const serializedItems = superjson.stringify(itemsToSave)
  store.set('items', serializedItems)

  // You can also use your saveProjectToJson function if you need to export to a file
  // saveProjectToJson(itemsToSave);
}

const load = () => {
  // Clear existing meshes
  outlineStore.meshes = {}

  // Get the stored items
  const serialized = store.get('items')
  if (!serialized) return

  // Parse the stored items using superjson
  const storedItems = superjson.parse(serialized)

  // Process the items and reconstruct geometries
  const loadedItems = storedItems.map((item) => {
    if (item.type === 'object' && item.geometry) {
      let geometry

      // Handle different geometry types
      if (item.geometry.type === 'ConvexGeometry') {
        // Recreate ConvexGeometry from vertices
        const points = item.geometry.vertices.map((v) => new Vector3(v.x, v.y, v.z))
        geometry = new ConvexGeometry(points)
      } else {
        // Use Three.js loader for standard geometries
        const loader = new THREE.BufferGeometryLoader()
        geometry = loader.parse(item.geometry)
      }

      // Ensure bounding box is computed
      geometry.computeBoundingBox()

      // Return the item with reconstructed geometry
      // Note: materialData will be used when creating the mesh later
      return {
        ...item,
        geometry,
        materialData: item.materialData || null
      }
    }

    // Return other item types as is
    return item
  })

  // Update the items in the store
  outlineStore.items = loadedItems

  // Create meshes for the loaded objects (this part would typically happen elsewhere,
  // but we're including it here for completeness)
  outlineStore.items.forEach((item) => {
    if (item.type === 'object' && item.geometry) {
      // Create material (if materialData exists)
      let material
      if (item.materialData) {
        const materialLoader = new THREE.MaterialLoader()
        material = materialLoader.parse(item.materialData)
      } else {
        // Default material
        material = new THREE.MeshStandardMaterial({ color: 0x999999 })
      }

      // Create mesh
      const mesh = new Mesh(item.geometry, material)

      // Apply transforms
      mesh.position.set(...item.position)

      // Convert Euler array to Euler object
      const rotation = new Euler(...item.rotation)
      mesh.rotation.copy(rotation)

      mesh.scale.set(...item.scale)

      // Store in meshes object
      outlineStore.meshes[item.id] = mesh

      // Clean up the temporary materialData property
      delete item.materialData
    }
  })
}

export default {
  save,
  load
}
