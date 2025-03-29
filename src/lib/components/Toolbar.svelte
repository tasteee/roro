<script lang="ts">
  import { T, Canvas } from '@threlte/core'
  import { Vector3, AmbientLight, DirectionalLight, GridHelper } from 'three'
  import outlineStore from '../stores/outline/OutlineStore.svelte'
  import { onMount } from 'svelte'
  import { Button } from 'kampsy-ui'
  import { Tabs } from 'kampsy-ui'

  let selected = $state('github')

  // Keyboard mode switching
  function handleKeyDown(event) {
    if (event.key === '1') {
      outlineStore.updateGizmoMode('select')
    }

    if (event.key === '2') {
      outlineStore.updateGizmoMode('translate')
    }

    if (event.key === '3') {
      outlineStore.updateGizmoMode('rotate')
    }

    if (event.key === '4') {
      outlineStore.updateGizmoMode('scale')
    }

    if (event.key === '`') {
    }

    if (event.key === ' ') {
      outlineStore.clearSelection()
    }

    if (event.key === 'a' && event.ctrlKey) {
      const allSelectableIds = outlineStore.items
        .filter((item) => !item.isLocked)
        .map((item) => item.id)
      outlineStore.selectedItemIds = allSelectableIds
      event.preventDefault()
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })
</script>

<div class="toolbar">
  <Tabs
    bind:selected={outlineStore.gizmoMode}
    tabs={[
      { title: 'Select', value: 'select' },
      { title: 'Move', value: 'move' },
      { title: 'Rotate', value: 'rotate' },
      { title: 'Scale', value: 'scale' }
    ]}
    type="secondary"
  />
</div>

<style>
  .toolbar {
    position: absolute;
    top: 12px;
    width: 100vw;
    height: 100px;
    left: 12px;
    z-index: 101;
    display: flex;
    gap: 8px;
    padding: 8px;
    border-radius: 4px;
  }

  .toolbar button {
    padding: 6px 12px;
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
  }

  .toolbar button.active {
    background: #4dabf7;
    color: white;
    border-color: #3b8ae4;
  }
</style>
