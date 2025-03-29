import * as THREE from 'three'
import CameraControls from 'camera-controls'
import perspectiveCameraConfig from './CameraConfig'

const { fov, aspect, near, far } = perspectiveCameraConfig
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

export class PerspectiveCameraStore {
  camera = camera
  controls = $state<CameraControls>(null!)
  config = perspectiveCameraConfig

  updateProjectionMatrix = () => {
    this.config.aspect = window.innerWidth / window.innerHeight
    this.camera.fov = this.config.fov
    this.camera.aspect = this.config.aspect
    this.camera.near = this.config.near
    this.camera.far = this.config.far
    const aspect = window.innerWidth / window.innerHeight
    const frustumSize = this.config.frustumSize
    this.camera.left = (-frustumSize * aspect) / 2
    this.camera.right = (frustumSize * aspect) / 2
    this.camera.updateProjectionMatrix()
  }

  createCamera = () => {
    // Set the initial position
    const [x, y, z] = this.config.position
    this.camera.position.set(x, y, z)

    // Look at the target
    const { x: tx, y: ty, z: tz } = this.config.target
    this.camera.lookAt(tx, ty, tz)
  }

  createCameraControls = (domElement) => {
    if (!domElement) return
    const controls = new CameraControls(this.camera, domElement)

    // Configure mouse controls
    controls.mouseButtons.left = CameraControls.ACTION.ROTATE
    controls.mouseButtons.middle = CameraControls.ACTION.DOLLY
    controls.mouseButtons.right = CameraControls.ACTION.TRUCK
    controls.touches.one = CameraControls.ACTION.TOUCH_ROTATE
    controls.touches.two = CameraControls.ACTION.TOUCH_DOLLY_TRUCK
    controls.touches.three = CameraControls.ACTION.TOUCH_TRUCK

    // Configure control parameters
    controls.minZoom = this.config.minZoom
    controls.maxZoom = this.config.maxZoom
    // controls.zoom = this.config.zoom
    controls.smoothTime = this.config.smoothTime
    controls.draggingSmoothTime = this.config.smoothTime
    controls.dollySpeed = this.config.dollySpeed
    controls.truckSpeed = this.config.truckSpeed
    controls.dollyToCursor = this.config.dollyToCursor
    controls.verticalDragToForward = this.config.verticalDragToForward
    // controls.verticalDragToForward = false
    controls.minDistance = this.config.minDistance
    controls.maxDistance = this.config.maxDistance
    controls.minPolarAngle = this.config.minPolarAngle
    controls.maxPolarAngle = this.config.maxPolarAngle

    // Enable smooth damping
    controls.smoothTime = this.config.smoothTime

    // Set initial position and target
    const [x, y, z] = this.config.position
    controls.setPosition(x, y, z, true)
    controls.setTarget(this.config.target.x, this.config.target.y, this.config.target.z, true)

    this.controls = controls

    // Only restore state if there's a saved state
    const savedState = localStorage.getItem('cameraState')
    if (savedState) {
      this.restoreState()
    }

    // Ensure controls are updated
    controls.update(0)
  }

  restoreState() {
    const savedState = localStorage.getItem('cameraState')
    if (savedState && this.controls) {
      const state = JSON.parse(savedState)

      // Restore position
      this.controls.setPosition(
        state.position.x,
        state.position.y,
        state.position.z,
        false // Don't animate immediately
      )

      // Restore target
      this.controls.setTarget(state.target.x, state.target.y, state.target.z, false)

      // Restore zoom level
      this.camera.zoom = state.zoom
      this.camera.updateProjectionMatrix()
      this.controls.update()
    }
  }

  calculateWorldSpaceOffset = (screenSpaceOffset: number): number => {
    const viewWidth = this.camera.right - this.camera.left
    const worldSpaceOffset = (screenSpaceOffset * viewWidth) / window.innerWidth
    console.log({
      viewWidth,
      cameraRight: this.camera.right,
      cameraLeft: this.camera.left,
      worldSpaceOffset
    })
    return worldSpaceOffset / 2 / this.camera.zoom
  }

  moveTo = (x: number, y: number, z: number) => {
    console.log('MOVING TO......', x, y, z)
    let targetX = x
    let targetZ = z
    let targetY = y
    this.controls.moveTo(targetX, targetY, targetZ, true)
  }

  // moveToItem = (id: string) => {
  // 	const item = mainStore.space.items[id];
  // 	console.log('MOVING TO ITEM', item);
  // 	this.moveTo(item.positionX, item.positionY, item.positionZ);
  // };

  resetCamera = () => {
    if (!this.controls || !this.camera) return
    const [x, y, z] = this.config.position
    this.controls.setPosition(x, y, z, true)
    // const { x: tx, y: ty, z: tz } = this.config.target
    // this.controls.setTarget(tx, ty, tz, true)
    this.controls.zoomTo(this.config.zoom, true)
    // this.camera.updateProjectionMatrix()
    // this.camera.updateMatrixWorld(true)
  }
}

export default new PerspectiveCameraStore()
