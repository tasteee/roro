<script lang="ts">
  import { Group } from 'three'

  import { T, useTask } from '@threlte/core'
  import { ConvexGeometry } from 'three/examples/jsm/Addons.js'
  import { Vector3, MeshStandardMaterial, DoubleSide, Raycaster, Mesh } from 'three'
  import outlineStore from '../stores/outline/OutlineStore.svelte'
  import WorkspaceItem from './WorkspaceItem.svelte'
  import DragControls from './DragControls.svelte'
  import inputStore from '$lib/stores/InputStore.svelte'
  import cameraStore from '$lib/stores/camera/CameraStore.svelte'
  import audioStore from '$lib/stores/AudioStore.svelte'
  import { withMinMax } from '$lib/helpers/withMinMax'
  import materials from '$lib/constants/materials'

  // when dragging controls: document.body.style.cursor = 'grabbing'

  // how big the grid/workspace is on the x and z axis, and how tall the workspace is on the y axis.
  const workspaceSpaceSize = 128

  type PropsT = {
    id: string
  }

  const props: PropsT = $props()
  const item = $derived(outlineStore.getItemById(props.id))
  const children = $derived(outlineStore.getChildreByParentId(item?.id))
  const isSelected = $derived(outlineStore.selectedItemIds.includes(item?.id))
  const geometry = $derived(new ConvexGeometry(item.points))
  let groupMeshRef = $state<Group>(null!)
  let objectMeshRef = $state<Mesh>(null!)
  const meshRef = $derived(groupMeshRef || objectMeshRef)
  const shouldShowControls = $derived(isSelected && !item.isLocked && item.isVisible)

  const material = $derived.by(() => {
    if (!item.isVisible) return materials.hidden
    if (isSelected) return materials.selected
    return materials.standard
  })

  let dragAxes = $derived.by(() => {
    if (isSelected && inputStore.isPressedAlt) return 'y'
    return isSelected ? 'xz' : ''
  })

  function handleClick(event: MouseEvent) {
    if (item.isLocked || !item.isVisible) return
    event.stopPropagation()
    if (inputStore.isPressedShift && isSelected) outlineStore.removeFromSelection(item.id)
    if (inputStore.isPressedShift && !isSelected) outlineStore.addToSelection(item.id)
    if (!inputStore.isPressedShift && !isSelected) outlineStore.selectItem(item.id)
  }

  const handleDragStart = () => {
    if (!isSelected) return
    cameraStore.controls.enabled = false
    outlineStore.isDragging = true
  }

  const handleDragEnd = () => {
    if (!isSelected) return
    cameraStore.controls.enabled = true
    outlineStore.isDragging = false
  }

  const handleDrag = (event: any) => {
    if (!isSelected) return
    audioStore.playClip('itemMove')
    const maxX = workspaceSpaceSize / 2 + 0.5
    const maxY = workspaceSpaceSize / 2
    const maxZ = workspaceSpaceSize / 2 + 0.5
    const minX = -maxX
    const minY = -maxY
    const minZ = -maxZ
    const positionX = withMinMax(minX, maxX, event.object.position.x)
    const positionY = withMinMax(minY, maxY, event.object.position.y)
    const positionZ = withMinMax(minZ, maxZ, event.object.position.z)
    item.position = new Vector3(positionX, positionY, positionZ)
  }

  const position = $derived<XYZNumbers>([item.position.x, item.position.y, item.position.z])
  const rotation = $derived<XYZNumbers>([item.rotation.x, item.rotation.y, item.rotation.z])
  const scale = $derived<XYZNumbers>([item.scale.x, item.scale.y, item.scale.z])
</script>

{#if meshRef && shouldShowControls}
  <T.BoxHelper args={[meshRef]} />
  <DragControls
    axes={dragAxes}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
    onDrag={handleDrag}
    target={meshRef}
  />
{/if}

{#if item && item.isVisible}
  {#if item.type === 'group'}
    <T.Group
      bind:ref={groupMeshRef}
      {position}
      {rotation}
      {scale}
      visible={item.isVisible}
      castShadow={item.isVisible}
      receiveShadow={item.isVisible}
      onclick={handleClick}
      interactive
    >
      {#each children as child (child.id)}
        <WorkspaceItem id={child.id} />
      {/each}
    </T.Group>
  {/if}

  {#if item.type === 'object' && geometry}
    <T.Mesh
      bind:ref={objectMeshRef}
      {geometry}
      {material}
      {position}
      {rotation}
      {scale}
      visible={item.isVisible}
      castShadow={item.isVisible}
      receiveShadow={item.isVisible}
      onclick={handleClick}
      onpointerover={() => (document.body.style.cursor = item.isLocked ? 'not-allowed' : 'pointer')}
      onpointerout={() => (document.body.style.cursor = 'default')}
      interactive
    >
      {#if isSelected}
        <T.LineSegments {geometry}>
          <T.EdgesGeometry />
          <T.LineBasicMaterial color={0xffffff} />
        </T.LineSegments>
      {/if}
    </T.Mesh>
  {/if}
{/if}
