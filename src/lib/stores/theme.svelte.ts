import { PersistedState } from 'runed'
import superjson from 'superjson'

const persistOptions = {
  serializer: {
    serialize: superjson.stringify,
    deserialize: superjson.parse
  }
}

export const theme = new PersistedState('theme', 'contrast')

const x = {
  type: 'object',
  id: 12345,
  name: 'string',
  shapeName: 'string',
  points: [
    [1, 2, 3],
    [11, 22, 33],
    [100, 200, 300]
  ],
  position: [
    [1, 2, 3],
    [11, 22, 33],
    [100, 200, 300]
  ],
  rotation: [
    [1, 2, 3],
    [11, 22, 33],
    [100, 200, 300]
  ],
  scale: [
    [1, 2, 3],
    [11, 22, 33],
    [100, 200, 300]
  ],
  pivotPosition: [
    [1, 2, 3],
    [11, 22, 33],
    [100, 200, 300]
  ],
  parentId: 'string',
  isVisible: true,
  isLocked: false
}

export const data = new PersistedState('data', {
  name: 'yolo',
  items: [x, x, x, x, x]
})
