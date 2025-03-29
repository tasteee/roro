<script lang="ts">
  import * as THREE from 'three'
  import { T } from '@threlte/core'
  import { Grid } from '@threlte/extras'
  import colors from '$lib/constants/colors'
  import outlineStore from '$lib/stores/outline/OutlineStore.svelte'

  const handleGroundDoubleClick = (event: MouseEvent) => {
    if (outlineStore.hoveredItemId) return
    event.stopPropagation()
    outlineStore.clearSelection()
  }

  let grid = $state<THREE.Mesh>(null!)
  let group = $state<THREE.Group>(null!)
  let floor = $state<THREE.Mesh>(null!)
  let floorGroup = $state<THREE.Group>(null!)

  $effect(() => {
    if (!grid) return
    window.grid = grid
    if (!space.isGridVisible) return
    const opacity = space.gridOpacity / 100
    grid.material.transparent = true
    grid.material.opacity = opacity

    grid.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = true
        child.material.opacity = opacity
      }
    })
  })

  const space = {
    sizeX: 128,
    sizeY: 64,
    sizeZ: 128,
    hdr: 'sunflowers_puresky_2k.hdr',
    hdrBlur: 0.8,
    backgroundColor: colors.black,
    backgroundMode: 'color',
    gridOpacity: 50,
    gridCellLineColor: colors.gray2,
    gridCellSize: 0.1,
    gridCellLineThickness: 1,
    gridSectionLineColor: colors.gray0,
    gridSectionSize: 1,
    gridSectionLineThickness: 1,
    gridFadeAmount: 0.75,
    gridFadeDistance: 35,
    showGridSectionDividers: true,
    showGridCellDividers: true,
    isGridVisible: true,
    isFloorVisible: true,
    isHdrEnabled: true,
    gridPaneColor: colors.black,
    gridPaneOpacity: 55,
    floorColor: colors.black,
    floorOpacity: 55
  }
</script>

<T.Group position={[0.5, -0.5025, 0.5]} bind:ref={group}>
  {#if space.isGridVisible}
    <Grid
      type="grid"
      name="GRIDDY"
      gridSize={[space.sizeX, space.sizeZ]}
      cellSize={space.gridCellSize}
      cellThickness={space.gridCellLineThickness}
      cellColor={space.gridCellLineColor}
      sectionColor={space.gridSectionLineColor}
      sectionThickness={space.gridSectionLineThickness}
      sectionSize={space.gridSectionSize}
      fadeStrength={space.gridFadeAmount}
      fadeDistance={space.gridFadeDistance}
      backgroundColor={space.gridPaneColor}
      backgroundOpacity={space.gridPaneOpacity / 100}
      ondblclick={handleGroundDoubleClick}
      onpointerenter={() => (outlineStore.hoveredItemId = '')}
      transparent={true}
      followCamera={false}
      renderOrder={0}
      bind:ref={grid}
    />
  {/if}

  {#if space.isFloorVisible}
    <T.Group position={[0, -0.54, 0]} receiveShadow castShadow bind:ref={floorGroup}>
      <T.Mesh bind:ref={floor}>
        <T.BoxGeometry args={[space.sizeX, 0.05, space.sizeZ]} />
        <T.MeshStandardMaterial
          color={space.floorColor}
          opacity={space.floorOpacity / 100}
          transparent
        />
      </T.Mesh>
    </T.Group>
  {/if}
</T.Group>
