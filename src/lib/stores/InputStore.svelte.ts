import u from '$lib/helpers/utilities'
import throttle from 'just-throttle'
import { KEYS } from '$lib/constants/keys'

class InputStore {
  mouseX = $state(0)
  mouseY = $state(0)
  hasMouseClicked = $state(false)
  pressedKeys = $state<string[]>([])
  isActive = $state(false)
  isCapsLocked = $state(false)
  isMouseDown = $state(false)
  mouseDownTime = 0
  mouseUpTime = 0
  wasLastClickLong = false

  isPressedW = $derived(this.pressedKeys.includes('w'))
  isPressedS = $derived(this.pressedKeys.includes('s'))
  isPressedA = $derived(this.pressedKeys.includes('a'))
  isPressedD = $derived(this.pressedKeys.includes('d'))
  isPressedQ = $derived(this.pressedKeys.includes('q'))
  isPressedE = $derived(this.pressedKeys.includes('e'))
  isPressedV = $derived(this.pressedKeys.includes('v'))
  isPressedJ = $derived(this.pressedKeys.includes('j'))

  isPressedSpace = $derived(this.pressedKeys.includes('space'))
  isPressedShift = $derived(this.pressedKeys.includes('shift'))
  isPressedControl = $derived(this.pressedKeys.includes('control'))
  isPressedAlt = $derived(this.pressedKeys.includes('alt'))
  isPressedCapsLock = $derived(this.pressedKeys.includes('capslock'))
  isPressedDelete = $derived(this.pressedKeys.includes('delete'))
  isPressedBackspace = $derived(this.pressedKeys.includes('backspace'))
  isPressedEscape = $derived(this.pressedKeys.includes('escape'))

  isPressedArrowUp = $derived(this.pressedKeys.includes('arrowup'))
  isPressedArrowDown = $derived(this.pressedKeys.includes('arrowdown'))
  isPressedArrowLeft = $derived(this.pressedKeys.includes('arrowleft'))
  isPressedArrowRight = $derived(this.pressedKeys.includes('arrowright'))

  isPressedDigit1 = $derived(this.pressedKeys.includes('1'))
  isPressedDigit2 = $derived(this.pressedKeys.includes('2'))
  isPressedDigit3 = $derived(this.pressedKeys.includes('3'))
  isPressedDigit4 = $derived(this.pressedKeys.includes('4'))
  isPressedDigit5 = $derived(this.pressedKeys.includes('5'))
  isPressedDigit6 = $derived(this.pressedKeys.includes('6'))
  isPressedDigit7 = $derived(this.pressedKeys.includes('7'))
  isPressedDigit8 = $derived(this.pressedKeys.includes('8'))
  isPressedDigit9 = $derived(this.pressedKeys.includes('9'))
  isPressedDigit0 = $derived(this.pressedKeys.includes('0'))

  isPressedF1 = $derived(this.pressedKeys.includes('f1'))
  isPressedF2 = $derived(this.pressedKeys.includes('f2'))
  isPressedF3 = $derived(this.pressedKeys.includes('f3'))
  isPressedF4 = $derived(this.pressedKeys.includes('f4'))
  isPressedF5 = $derived(this.pressedKeys.includes('f5'))
  isPressedF6 = $derived(this.pressedKeys.includes('f6'))
  isPressedF7 = $derived(this.pressedKeys.includes('f7'))
  isPressedF8 = $derived(this.pressedKeys.includes('f8'))
  isPressedF9 = $derived(this.pressedKeys.includes('f9'))
  isPressedF10 = $derived(this.pressedKeys.includes('f10'))
  isPressedF11 = $derived(this.pressedKeys.includes('f11'))
  isPressedF12 = $derived(this.pressedKeys.includes('f12'))
  isPressedTilde = $derived(this.pressedKeys.includes('`'))
  isPressedTab = $derived(this.pressedKeys.includes('tab'))

  isArrowPressed = $derived(u.array.includesSome(this.pressedKeys, KEYS.ARROWS))
  isModifierPressed = $derived(u.array.includesSome(this.pressedKeys, KEYS.MODIFIERS))
  isDigitPressed = $derived(u.array.includesSome(this.pressedKeys, KEYS.DIGITS))
  isWASDPressed = $derived(u.array.includesSome(this.pressedKeys, KEYS.WASD))
  isRotatorPressed = $derived(u.array.includesSome(this.pressedKeys, KEYS.ROTATORS))

  handleKey = (isPressing: boolean) => (event: KeyboardEvent) => {
    event.preventDefault()
    if (event.repeat) return
    const key = u.event.getKey(event)
    const isAlreadyPressed = this.pressedKeys.includes(key)
    this.isCapsLocked = event.getModifierState('CapsLock')
    if (isPressing && isAlreadyPressed) return
    if (isPressing && !isAlreadyPressed) this.pressedKeys = [...this.pressedKeys, key]
    if (!isPressing && isAlreadyPressed) this.pressedKeys = u.array.without(this.pressedKeys, key)
  }

  handleKeyDown = this.handleKey(true)
  handleKeyUp = this.handleKey(false)

  handleMouseMove = (event: MouseEvent) => {
    this.mouseX = event.clientX
    this.mouseY = event.clientY
  }

  handleMouseDown = throttle(() => {
    this.isMouseDown = true
    this.mouseDownTime = Date.now()
  }, 65)

  handleMouseUp = throttle(() => {
    this.isMouseDown = false
    this.mouseUpTime = Date.now()
    const difference = this.mouseUpTime - this.mouseDownTime
    this.wasLastClickLong = difference > 200
  }, 65)

  handleFirstClick = () => {
    document.removeEventListener('click', this.handleFirstClick)
    this.hasMouseClicked = true
    console.log('handleFirstClic\n\n')
  }

  start = () => {
    if (this.isActive) return
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('click', this.handleFirstClick)
    document.addEventListener('pointerdown', this.handleMouseDown)
    document.addEventListener('pointerup', this.handleMouseUp)
    this.isActive = true
  }

  stop = () => {
    if (!this.isActive) return
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('pointerdown', this.handleMouseDown)
    document.removeEventListener('pointerup', this.handleMouseUp)
    this.isActive = false
  }
}

const inputStore = new InputStore()
export default inputStore
