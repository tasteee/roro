<script>
  import { T } from '@threlte/core'
  import { interactivity } from '@threlte/extras'
  import Camera from './Camera.svelte'
  import Ground from './Ground.svelte'
  import Workspace from './Workspace.svelte'
  import inputStore from '$lib/stores/InputStore.svelte'
  import { onDestroy, onMount } from 'svelte'
  import { betterRaycaster } from '$lib/helpers/betterRaycaster.svelte'
  import outlineStore from '$lib/stores/outline/OutlineStore.svelte'

  onMount(() => inputStore.start())
  onDestroy(() => inputStore.stop())

  interactivity({
    filter: (intersects) => {
      intersects.sort((a, b) => a.distance - b.distance)
      return intersects
    }
  })

  betterRaycaster()
</script>

<T.Group>
  <Workspace />
  <Ground />
  <Camera />
</T.Group>

<T.AmbientLight intensity={0.9} />
<T.DirectionalLight position={[-10, 10, 10]} intensity={0.9} castShadow />
<T.DirectionalLight position={[8, 8, -8]} intensity={0.7} castShadow />
