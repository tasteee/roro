<script lang="ts">
  import { T } from '@threlte/core'
  import * as THREE from 'three'
  import threeHelpers from '$lib/helpers/three'

  type PropsT = {
    target: THREE.Mesh
    position: THREE.Vector3
  }

  let props: PropsT = $props()

  let bottomCorners = $state<THREE.Vector3[]>([])

  $effect(() => {
    if (!props.target) return
    const allCorners = threeHelpers.getBoxCornerPoints(props.target)
    bottomCorners = allCorners
      .filter((corner) => corner.y === threeHelpers.getBottomMostPointY(props.target))
      .map((corner) => {
        return new THREE.Vector3(
          corner.x - props.target.position.x + props.position.x,
          corner.y,
          corner.z - props.target.position.z + props.position.z
        )
      })
  })

  const LINE_WIDTH = 0.005
</script>

{#if bottomCorners.length}
  {#each bottomCorners as corner}
    <T.Mesh position={[corner.x, props.position.y / 2, corner.z]}>
      <T.BoxGeometry args={[LINE_WIDTH, props.position.y, LINE_WIDTH]} />
      <T.MeshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
    </T.Mesh>
  {/each}
{/if}
