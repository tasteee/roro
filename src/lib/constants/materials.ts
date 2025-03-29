import { DoubleSide, MeshStandardMaterial } from 'three'
import colors from './colors'

// Create materials
const standardMaterial = new MeshStandardMaterial({
  color: colors.pale,
  roughness: 1,
  metalness: 0,
  side: DoubleSide,
  transparent: false,
  opacity: 1
})

const selectedMaterial = new MeshStandardMaterial({
  color: colors.pale,
  roughness: 1,
  metalness: 0,
  side: DoubleSide,
  transparent: false,
  opacity: 1
})

const hiddenMaterial = new MeshStandardMaterial({
  color: colors.midnight,
  roughness: 1,
  metalness: 0,
  side: DoubleSide,
  transparent: true,
  opacity: 1,
  wireframe: true
})

export default {
  standard: standardMaterial,
  selected: selectedMaterial,
  hidden: hiddenMaterial
}
