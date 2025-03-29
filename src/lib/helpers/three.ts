import * as THREE from 'three'

const getBottomMostPointY = (mesh: THREE.Mesh) => {
  const boundingBox = new THREE.Box3().setFromObject(mesh)
  const bottomY = boundingBox.min.y
  return bottomY
}

const getBottomFourCorners = (mesh: THREE.Mesh) => {
  const boundingBox = new THREE.Box3().setFromObject(mesh)
  const bottom = boundingBox.min
  const bottomFourCorners = [
    new THREE.Vector3(bottom.x, bottom.y, bottom.z),
    new THREE.Vector3(bottom.x, bottom.y, bottom.z + boundingBox.max.z),
    new THREE.Vector3(bottom.x + boundingBox.max.x, bottom.y, bottom.z),
    new THREE.Vector3(bottom.x + boundingBox.max.x, bottom.y, bottom.z + boundingBox.max.z)
  ]
  return bottomFourCorners
}

const getBoxCornerPoints = (mesh: THREE.Mesh) => {
  const boundingBox = new THREE.Box3().setFromObject(mesh)
  const low = boundingBox.min
  const high = boundingBox.max

  const corner1 = new THREE.Vector3(low.x, low.y, low.z)
  const corner2 = new THREE.Vector3(high.x, low.y, low.z)
  const corner3 = new THREE.Vector3(low.x, high.y, low.z)
  const corner4 = new THREE.Vector3(low.x, low.y, high.z)

  const corner5 = new THREE.Vector3(high.x, high.y, low.z)
  const corner6 = new THREE.Vector3(high.x, low.y, high.z)
  const corner7 = new THREE.Vector3(low.x, high.y, high.z)
  const corner8 = new THREE.Vector3(high.x, high.y, high.z)

  return [corner1, corner2, corner3, corner4, corner5, corner6, corner7, corner8]
}

const getNegativeAdjustmentToZeroY = (mesh: THREE.Mesh) => {
  const bottomY = getBottomMostPointY(mesh)
  const adjustment = -bottomY
  return adjustment
}

const moveMeshToZeroY = (mesh: THREE.Mesh) => {
  const adjustment = getNegativeAdjustmentToZeroY(mesh)
  mesh.position.y += adjustment
}

const checkMeshAlignedAxis = (rotationDegrees: number) => {
  const THRESHOLD = 5
  const alignmentCase0 = rotationDegrees % 90 < THRESHOLD
  const alignmentCase1 = 90 - (rotationDegrees % 90) < THRESHOLD
  const isAligned = alignmentCase0 || alignmentCase1
  return isAligned
}

const getRotationYDegrees = (mesh: THREE.Mesh) => {
  const rotation = mesh.rotation.y
  const rotationDegrees = THREE.MathUtils.radToDeg(rotation)
  return rotationDegrees
}

const getCorrectedAlignmentRotationY = (rotationDegrees: number) => {
  const nearestRightAngle = Math.round(rotationDegrees / 90) * 90
  const correctedRotation = THREE.MathUtils.degToRad(nearestRightAngle)
  return correctedRotation
}

export {
  getBottomMostPointY,
  getNegativeAdjustmentToZeroY,
  moveMeshToZeroY,
  checkMeshAlignedAxis,
  getRotationYDegrees,
  getCorrectedAlignmentRotationY,
  getBoxCornerPoints,
  getBottomFourCorners
}

export default {
  getBottomMostPointY,
  getNegativeAdjustmentToZeroY,
  moveMeshToZeroY,
  checkMeshAlignedAxis,
  getRotationYDegrees,
  getCorrectedAlignmentRotationY,
  getBoxCornerPoints,
  getBottomFourCorners
}
