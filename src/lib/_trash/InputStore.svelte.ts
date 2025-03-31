// import u from '$lib/helpers/utilities'
// import throttle from 'just-throttle'
// import { PressedKeys } from 'runed';

// const keys = new PressedKeys();

// class KeyboardStore {
//   isActive = $state(true)
//   isCapsLocked = $state(false)

//   isPressedW = $derived(keys.has("w"))
//   isPressedS = $derived(keys.has("s"))
//   isPressedA = $derived(keys.has("a"))
//   isPressedD = $derived(keys.has("d"))
//   isPressedQ = $derived(keys.has("q"))
//   isPressedE = $derived(keys.has("e"))
//   isPressedV = $derived(keys.has("v"))
//   isPressedJ = $derived(keys.has("j"))

//   isPressedSpace = $derived(keys.has(" "))
//   isPressedShift =$derived(keys.has("Shift"))
//   isPressedControl =$derived(keys.has("Control"))
//   isPressedAlt =$derived(keys.has("Alt"))
//   isPressedCapsLock =$derived(keys.has("Capslock"))
//   isPressedDelete =$derived(keys.has("Delete"))
//   isPressedBackspace =$derived(keys.has("Backspace"))
//   isPressedEscape =$derived(keys.has("Escape"))

//   isPressedArrowUp = $derived(keys.has("ArrowUp"))
//   isPressedArrowDown = $derived(keys.has("ArrowDown"))
//   isPressedArrowLeft = $derived(keys.has("ArrowLeft"))
//   isPressedArrowRight = $derived(keys.has("ArrowRight"))

//   isPressedDigit1 = $derived(keys.has("1"))
//   isPressedDigit2 = $derived(keys.has("2"))
//   isPressedDigit3 = $derived(keys.has("3"))
//   isPressedDigit4 = $derived(keys.has("4"))
//   isPressedDigit5 = $derived(keys.has("5"))
//   isPressedDigit6 = $derived(keys.has("6"))
//   isPressedDigit7 = $derived(keys.has("7"))
//   isPressedDigit8 = $derived(keys.has("8"))
//   isPressedDigit9 = $derived(keys.has("9"))
//   isPressedDigit0 = $derived(keys.has("0"))

//   isPressedF1 = $derived(keys.has("F1"))
//   isPressedF2 = $derived(keys.has("F2"))
//   isPressedF3 = $derived(keys.has("F3"))
//   isPressedF4 = $derived(keys.has("F4"))
//   isPressedF5 = $derived(keys.has("F5"))
//   isPressedF6 = $derived(keys.has("F6"))
//   isPressedF7 = $derived(keys.has("F7"))
//   isPressedF8 = $derived(keys.has("F8"))
//   isPressedF9 = $derived(keys.has("F9"))
//   isPressedF10 = $derived(keys.has("F10"))
//   isPressedF11 = $derived(keys.has("F11"))
//   isPressedF12 = $derived(keys.has("F12"))
//   isPressedTab = $derived(keys.has("Tab"))
//   isPressedTilde = $derived(keys.has("`"))

//   isArrowPressed = $derived(keys.has("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"))
//   isModifierPressed = $derived(keys.has('Shift', 'Control', 'Alt'))
//   isDigitPressed = $derived(keys.has('1', '2', '3', '4', '5', '6', '7', '8', '9', '0'))
//   isWASDPressed = $derived(keys.has('w', 'a', 's', 'd'))
// }

// class MouseStore {
//   hasMouseClicked = $state(false)

//   mouseX = $state(0)
//   mouseY = $state(0)

//   mouseDownTime = 0
//   mouseUpTime = 0
//   wasLastClickLong = false
//   isMouseDown = $state(false)

//   handleMouseMove = (event: MouseEvent) => {
//     this.mouseX = event.clientX
//     this.mouseY = event.clientY
//   }

//   handleMouseDown = throttle(() => {
//     this.isMouseDown = true
//     this.mouseDownTime = Date.now()
//   }, 65)

//   handleMouseUp = throttle(() => {
//     this.isMouseDown = false
//     this.mouseUpTime = Date.now()
//     const difference = this.mouseUpTime - this.mouseDownTime
//     this.wasLastClickLong = difference > 200
//   }, 65)

//   handleFirstClick = () => {
//     document.removeEventListener('click', this.handleFirstClick)
//     this.hasMouseClicked = true
//     console.log('handleFirstClic\n\n')
//   }
// }

// class InputStore {
//   start = () => {
//     if (this.isActive) return
//     document.addEventListener('mousemove', this.handleMouseMove)
//     document.addEventListener('click', this.handleFirstClick)
//     document.addEventListener('pointerdown', this.handleMouseDown)
//     document.addEventListener('pointerup', this.handleMouseUp)
//     this.isActive = true
//   }

//   stop = () => {
//     if (!this.isActive) return
//     document.removeEventListener('mousemove', this.handleMouseMove)
//     document.removeEventListener('pointerdown', this.handleMouseDown)
//     document.removeEventListener('pointerup', this.handleMouseUp)
//     this.isActive = false
//   }
// }

// const inputStore = new InputStore()
// export default inputStore

// $effect(() => {
//   inputStore.isCapsLocked = keys.has('CapsLock') ? true : false
// })
