<script lang="ts">
  import { T } from '@threlte/core'
  import { useThrelte, useTask } from '@threlte/core'
  import CameraControls from 'camera-controls'
  import * as THREE from 'three'
  import cameraStore from '../stores/camera/CameraStore.svelte'

  CameraControls.install({ THREE: THREE })

  const { invalidate, renderer } = useThrelte()

  const onCreateed = (camera) => {
    cameraStore.camera = camera
    cameraStore.updateProjectionMatrix()
    if (renderer) {
      cameraStore.createCameraControls(renderer.domElement)
      cameraStore.restoreState()
    }
  }

  const onDestroyed = () => {
    if (cameraStore.controls) {
      cameraStore.controls.dispose()
    }
  }

  useTask((delta) => {
    const updated = cameraStore.controls.update(delta)
    if (updated) invalidate()
  })
</script>

<T.PerspectiveCamera makeDefault oncreate={onCreateed} ondestroy={onDestroyed}
></T.PerspectiveCamera>
