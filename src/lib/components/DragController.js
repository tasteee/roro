import { Controls, Matrix4, Plane, Raycaster, Vector2, Vector3, MOUSE, TOUCH } from 'three'

const _plane = new Plane()
const _pointer = new Vector2()
const _offset = new Vector3()
const _diff = new Vector2()
const _previousPointer = new Vector2()
const _intersection = new Vector3()
const _worldPosition = new Vector3()
const _inverseMatrix = new Matrix4()
const _up = new Vector3()
const _right = new Vector3()
let _selected = null
let _hovered = null
const _intersections = []

const STATE = {
  NONE: -1,
  PAN: 0,
  ROTATE: 1
}

class DragControls extends Controls {
  dispatchRightClick = (event) => {
    this.dispatchEvent({ event, type: 'rightclick' })
  }

  constructor(objects, camera, domElement) {
    super(camera, domElement)
    this.objects = objects
    this.recursive = true
    this.transformGroup = false
    this.rotateSpeed = 1
    this.raycaster = new Raycaster()
    this.mouseButtons = { LEFT: MOUSE.PAN, MIDDLE: MOUSE.PAN, RIGHT: MOUSE.RIGHT }
    this.touches = { ONE: TOUCH.PAN }
    this._onPointerMove = onPointerMove.bind(this)
    this._onPointerDown = onPointerDown.bind(this)
    this._onPointerCancel = onPointerCancel.bind(this)
    this._onContextMenu = onContextMenu.bind(this)
    if (domElement !== null) this.connect()
  }

  connect() {
    this.domElement.addEventListener('pointermove', this._onPointerMove)
    this.domElement.addEventListener('pointerdown', this._onPointerDown)
    this.domElement.addEventListener('pointerup', this._onPointerCancel)
    this.domElement.addEventListener('pointerleave', this._onPointerCancel)
    this.domElement.addEventListener('contextmenu', this._onContextMenu)
    this.domElement.style.touchAction = 'none' // disable touch scroll
  }

  disconnect() {
    this.domElement.removeEventListener('pointermove', this._onPointerMove)
    this.domElement.removeEventListener('pointerdown', this._onPointerDown)
    this.domElement.removeEventListener('pointerup', this._onPointerCancel)
    this.domElement.removeEventListener('pointerleave', this._onPointerCancel)
    this.domElement.removeEventListener('contextmenu', this._onContextMenu)
    this.domElement.style.touchAction = 'auto'
    this.domElement.style.cursor = ''
  }

  dispose = this.disconnect

  _updatePointer(event) {
    const rect = this.domElement.getBoundingClientRect()
    _pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    _pointer.y = (-(event.clientY - rect.top) / rect.height) * 2 + 1
  }

  _updateState(event) {
    let action

    if (event.pointerType === 'touch') {
      action = this.touches.ONE
    } else {
      switch (event.button) {
        case 0:
          action = this.mouseButtons.LEFT
          break

        case 1:
          action = this.mouseButtons.MIDDLE
          break

        case 2:
          // action = this.mouseButtons.RIGHT
          break

        default:
          action = null
      }
    }

    switch (action) {
      case MOUSE.PAN:
      case TOUCH.PAN:
        this.state = STATE.PAN
        break

      case MOUSE.ROTATE:
      case TOUCH.ROTATE:
        this.state = STATE.ROTATE
        break

      default:
        this.state = STATE.NONE
    }
  }
}

function onPointerMove(event) {
  if (event.button === 2) return
  if (!this.enabled) return

  const camera = this.object
  const domElement = this.domElement
  const raycaster = this.raycaster

  this._updatePointer(event)
  raycaster.setFromCamera(_pointer, camera)

  const isPan = this.state === STATE.PAN
  const isRotate = this.state === STATE.ROTATE

  if (_selected) {
    if (isPan) {
      if (raycaster.ray.intersectPlane(_plane, _intersection)) {
        _selected.position.copy(_intersection.sub(_offset).applyMatrix4(_inverseMatrix))
        // _selected.position.divideScalar(0.1).floor().multiplyScalar(0.25).addScalar(0.05)
        // _selected.position.x = Math.floor(_selected.position.x / 0.1) * 0.1 + 0.05
        // _selected.position.z = Math.floor(_selected.position.z / 0.1) * 0.1 + 0.05
        // _selected.position.y = 0.05
      }
    }

    if (isRotate) {
      // _diff.subVectors(_pointer, _previousPointer).multiplyScalar(this.rotateSpeed)
      // console.log({ _diff, _previousPointer, _pointer })
      // if (event.altKey) {
      // 	// When Alt is pressed, rotate around X axis only
      // 	_selected.rotateOnWorldAxis(_right, -_diff.y)
      // } else {
      // 	// Default behavior: rotate around Y axis only
      // 	_selected.rotateOnWorldAxis(_up, _diff.x)
      // }
    }

    this.dispatchEvent({ event, type: 'drag', object: _selected })
    _previousPointer.copy(_pointer)
  } else {
    // hover support

    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      _intersections.length = 0

      raycaster.setFromCamera(_pointer, camera)
      raycaster.intersectObjects(this.objects, this.recursive, _intersections)

      if (_intersections.length > 0) {
        const object = _intersections[0].object

        _plane.setFromNormalAndCoplanarPoint(
          camera.getWorldDirection(_plane.normal),
          _worldPosition.setFromMatrixPosition(object.matrixWorld)
        )

        if (_hovered !== object && _hovered !== null) {
          this.dispatchEvent({ type: 'hoveroff', object: _hovered })

          domElement.style.cursor = 'auto'
          _hovered = null
        }

        if (_hovered !== object) {
          this.dispatchEvent({ type: 'hoveron', object: object })

          domElement.style.cursor = 'pointer'
          _hovered = object
        }
      } else {
        if (_hovered !== null) {
          this.dispatchEvent({ type: 'hoveroff', object: _hovered })

          domElement.style.cursor = 'auto'
          _hovered = null
        }
      }
    }
  }

  _previousPointer.copy(_pointer)
}

function onPointerDown(event) {
  if (event.button === 2) {
    return this.dispatchRightClick(event, this.dispatchEvent)
  }

  const camera = this.object
  const domElement = this.domElement
  const raycaster = this.raycaster

  if (this.enabled === false) return

  this._updatePointer(event)
  this._updateState(event)

  _intersections.length = 0

  raycaster.setFromCamera(_pointer, camera)
  raycaster.intersectObjects(this.objects, this.recursive, _intersections)

  if (_intersections.length > 0) {
    if (this.transformGroup === true) {
      // look for the outermost group in the object's upper hier = findGroup(_intersections[0].object)
    } else {
      _selected = _intersections[0].object
    }

    _plane.setFromNormalAndCoplanarPoint(
      camera.getWorldDirection(_plane.normal),
      _worldPosition.setFromMatrixPosition(_selected.matrixWorld)
    )

    if (raycaster.ray.intersectPlane(_plane, _intersection)) {
      if (this.state === STATE.PAN) {
        _inverseMatrix.copy(_selected.parent.matrixWorld).invert()
        _offset.copy(_intersection).sub(_worldPosition.setFromMatrixPosition(_selected.matrixWorld))
      } else if (this.state === STATE.ROTATE) {
        // the controls only support Y+ up
        _up.set(0, 1, 0).applyQuaternion(camera.quaternion).normalize()
        _right.set(1, 0, 0).applyQuaternion(camera.quaternion).normalize()
      }
    }

    domElement.style.cursor = 'move'

    this.dispatchEvent({ event, type: 'dragstart', object: _selected })
  }

  _previousPointer.copy(_pointer)
}

function onPointerCancel() {
  if (this.enabled === false) return

  if (_selected) {
    this.dispatchEvent({ type: 'dragend', object: _selected })
    _selected = null
  }

  this.domElement.style.cursor = _hovered ? 'pointer' : 'auto'
  this.state = STATE.NONE
}

function onContextMenu(event) {
  if (this.enabled === false) return
  event.preventDefault()
}

function findGroup(obj, group = null) {
  if (obj.isGroup) group = obj
  if (obj.parent === null) return group
  return findGroup(obj.parent, group)
}

export { DragControls }
