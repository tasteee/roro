<script lang="ts">
  import SheIcon from './SheIcon.svelte'
  import debounce from 'just-debounce'
  import { getContrastingTextColor } from '$lib/modules/colors'

  type PropsT = {
    value: string
    onChange: (value: string) => void
    label?: string
    class?: string
    isDisabled?: boolean
  }

  const props: PropsT = $props()
  // const debouncedValue = useDebounce(props.value.toUpperCase(), 250)
  const textColor = $derived.by(() => getContrastingTextColor(props.value))

  // $effect(() => {
  // 	if (!debouncedValue.value) return
  // 	if (props.value === debouncedValue.value) return
  // 	props.onChange(debouncedValue.value)
  // })

  function copyToClipboard(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    navigator.clipboard.writeText(props.value)
  }

  const handleInput = debounce((event: Event) => {
    const target = event.target as HTMLInputElement
    props.onChange?.(target.value.toUpperCase())
  }, 333)
</script>

<label
  class="SheInput SheColorInput {props.class}"
  data-disabled={props.isDisabled}
  style="--selected-color: {props.value}; --gradient-stop: 20%; --text-color: {textColor};"
>
  <input
    type="color"
    class="ColorPicker"
    value={props.value}
    oninput={handleInput}
    disabled={props.isDisabled}
  />

  {#if props.label}
    <span class="label">{props.label}</span>
  {/if}

  <span class="ColorDisplay" style="color: var(--text-color);">{props.value}</span>
  <button class="copyButton" onclick={copyToClipboard}>
    <SheIcon library="pixelarticons" icon="copy" size="small" color="var(--text-color)" />
  </button>
</label>

<style>
  :global {
    .SheColorInput .copyButton {
      all: unset;
      height: 24px;
      width: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .SheColorInput {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      width: 100%;
      padding: 1px 8px;
      background: linear-gradient(
        to left,
        var(--selected-color, #000) var(--gradient-stop, 20%),
        transparent
      );
      color: var(--gray12);
      font-size: 14px;
      height: 30px;
      border-radius: 5px;
      box-shadow: var(--shadowBorder25);
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      position: relative;
    }

    .SheColorInput[data-disabled='true'] {
      pointer-events: none;
      background: var(--gray25);
      color: var(--gray20);
      box-shadow: var(--shadowBorder20);
    }

    .SheColorInput .ColorPicker {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .SheColorInput .label {
      flex: 1;
      font-weight: 500;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .SheColorInput .ColorDisplay {
      font-size: 14px;
      font-weight: 500;
      margin-left: auto;
      margin-right: 8px;
    }

    .SheColorInput .SheIcon {
      cursor: pointer;
      transition: transform 0.1s ease-in-out;
      z-index: 100;
    }

    .SheColorInput .SheIcon:hover {
      transform: scale(1.1);
    }

    .SheColorInput .SheIcon:active {
      transform: scale(1);
    }
  }
</style>
