<script>
  import { Canvas } from '@threlte/core'
  import Scene from '../lib/components/Scene.svelte'
  import OutlinePanel from '$lib/components/OutlinePanel.svelte'
  import outlineStore from '$lib/stores/outline/OutlineStore.svelte'
  import ShapesBrowser from '$lib/components/ShapesBrowser.svelte'
  import inputStore from '$lib/stores/InputStore.svelte'
  import TransformOptionsPanel from '$lib/components/TransformOptionsPanel.svelte'

  function handleKeyDown(event) {
    if (event.target instanceof HTMLInputElement) return
    event.preventDefault()
    if (inputStore.isPressedDelete || inputStore.isPressedBackspace) outlineStore.deleteSelected()
    if (inputStore.isPressedControl && inputStore.isPressedD) outlineStore.duplicateSelected()
    if (inputStore.isPressedEscape) outlineStore.clearSelection()
    if (inputStore.isPressedDigit1) outlineStore.transformMode = 'translate'
    if (inputStore.isPressedDigit2) outlineStore.transformMode = 'rotate'
    if (inputStore.isPressedDigit3) outlineStore.transformMode = 'scale'
    if (inputStore.isPressedTilde) outlineStore.toggleTransformSpace()
    if (inputStore.isPressedShift && inputStore.isPressedTab) outlineStore.toggleSnappingEnabled()
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<Canvas>
  <Scene />
</Canvas>

<ShapesBrowser />
<TransformOptionsPanel />
<OutlinePanel />
