<script lang="ts">
  import { Box3, Group } from 'three'
  import { useCursor, interactivity } from '@threlte/extras'
  import TransformControls from './TransformControls.svelte'
  import { T } from '@threlte/core'
  import { ConvexGeometry } from 'three/examples/jsm/Addons.js'
  import { Vector3, Mesh } from 'three'
  import outlineStore from '../stores/outline/OutlineStore.svelte'
  import WorkspaceItem from './WorkspaceItem.svelte'
  import inputStore from '$lib/stores/InputStore.svelte'
  import cameraStore from '$lib/stores/camera/CameraStore.svelte'
  import colors from '$lib/constants/colors'
  import { hoverRaycast } from '$lib/helpers/betterRaycaster.svelte'
  import { onMount } from 'svelte'

  type PropsT = { id: string }
  const props: PropsT = $props()

  const item = $derived(outlineStore.getItemById(props.id))
  const outlineIndex = $derived(outlineStore.items.indexOf(item))
  const children = $derived(outlineStore.getChildreByParentId(item?.id))
  const isSelected = $derived(outlineStore.selectedItemIds.includes(item?.id))

  let groupMeshRef = $state<Group>(null!)
  let objectMeshRef = $state<Mesh>(null!)
  let transformControlsRef = $state(null!)
  let isHovering = $state(false)

  const shouldShowControls = $derived(isSelected && !item.isLocked && item.isVisible)
  const meshRef = $derived(groupMeshRef || objectMeshRef)

  onMount(() => {
    outlineStore.meshes[item.id] = meshRef
  })

  // $effect(() => {
  //   if (!meshRef) return
  //   outlineStore.meshes[item.id] = meshRef
  //   console.log(item.name)
  //   $inspect(meshRef)
  // })

  $effect(() => {
    if (!isHovering) return
    outlineStore.hoveredItemId = item.id
  })

  const meshColor = $derived.by(() => {
    if (item.isLocked) return colors.gray4
    if (outlineStore.hoveredItemId === item.id || isHovering) return colors.white
    if (isSelected) return colors.gray1
    return colors.gray4
  })

  const setCursor = (value: string) => {
    document.body.style.cursor = value
  }

  const handlePointerEnterLeave = (willBeHovering: boolean) => {
    return (event: MouseEvent) => {
      if (inputStore.isMouseDown) return
      event.stopPropagation()
      isHovering = willBeHovering
    }
  }

  const handlePointerDown = (event: MouseEvent) => {
    // event.stopPropagation()
    // inputStore.handleMouseDown()
  }

  const handlePointerUp = (event: MouseEvent) => {
    inputStore.handleMouseUp()
    event.stopPropagation()
    if (inputStore.wasLastClickLong) return
    if (outlineStore.isSelectingDisabled) return
    if (item.isLocked || !item.isVisible) return
    if (inputStore.isPressedShift && isSelected) outlineStore.removeFromSelection(item.id)
    if (inputStore.isPressedShift && !isSelected) outlineStore.addToSelection(item.id)
    if (!inputStore.isPressedShift && !isSelected) outlineStore.selectItem(item.id)
  }

  const onTransformStart = () => {
    outlineStore.isSelectingDisabled = true
    cameraStore.controls.enabled = false
    setCursor('none')
  }

  const onTransformEnd = () => {
    outlineStore.isSelectingDisabled = false
    cameraStore.controls.enabled = true
    setCursor('default')
  }

  const onTransform = () => {
    item.position = [meshRef.position.x, meshRef.position.y, meshRef.position.z]
    item.rotation = [meshRef.rotation.x, meshRef.rotation.y, meshRef.rotation.z]
    item.scale = [meshRef.scale.x, meshRef.scale.y, meshRef.scale.z]
  }
</script>

{#if meshRef && shouldShowControls}
  <TransformControls
    bind:controls={transformControlsRef}
    object={meshRef}
    translationSnap={outlineStore.snapAmount}
    rotationSnap={outlineStore.rotationSnapAmount}
    scaleSnap={outlineStore.scaleSnapAmount}
    space={outlineStore.transformSpace as any}
    mode={outlineStore.transformMode}
    onmouseDown={onTransformStart}
    onmouseUp={onTransformEnd}
    onpointerup={onTransformEnd}
    onobjectChange={onTransform}
  />
{/if}

{#if item && item.isVisible}
  {#if item.type === 'group'}
    <T.Group
      bind:ref={groupMeshRef}
      name={item.name}
      uuid={item.id}
      position={item.position as [number, number, number]}
      rotation={item.rotation as [number, number, number]}
      scale={item.scale as [number, number, number]}
      visible={item.isVisible}
      castShadow={item.isVisible}
      receiveShadow={item.isVisible}
      interactive
    >
      {#each children as child (child.id)}
        <WorkspaceItem id={child.id} />
      {/each}
    </T.Group>
  {/if}

  {#if item.type === 'object' && item.geometry}
    <T.Mesh
      bind:ref={objectMeshRef}
      name={item.name}
      uuid={item.id}
      geometry={item.geometry as ConvexGeometry}
      position={item.position as [number, number, number]}
      rotation={item.rotation as [number, number, number]}
      scale={item.scale as [number, number, number]}
      visible={item.isVisible}
      castShadow={item.isVisible}
      receiveShadow={item.isVisible}
      onpointerup={handlePointerUp}
      onpointerdown={handlePointerDown}
      onpointerenter={handlePointerEnterLeave(true)}
      onpointerleave={handlePointerEnterLeave(false)}
      raycast={hoverRaycast(objectMeshRef)}
      interactive
    >
      <T.MeshStandardMaterial
        color={meshColor}
        polygonOffset
        polygonOffsetFactor={outlineIndex}
        polygonOffsetUnits={outlineIndex}
      />
    </T.Mesh>
  {/if}
{/if}
