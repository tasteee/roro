<script lang="ts">
  type PropsT = {
    min: number | string
    max: number | string
    decimals?: number | string
    isDisabled?: boolean
    value: number
    onChange?: (value: number) => void
    class?: string
    style?: string
  }

  let props: PropsT = $props()

  // Reactive state for the slider value
  let sliderValue = $state(props.value)

  // Function to format numbers based on decimals
  function formatNumber(value: number): number {
    const decimals = Number(props.decimals ?? 2)
    return Number(value.toFixed(decimals))
  }

  // Handle slider input and propagate changes
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    sliderValue = formatNumber(Number(target.value))
    props.onChange?.(sliderValue)
  }
</script>

<div class={`SheSlider ${props.class || ''}`} style={props.style}>
  <input
    type="range"
    min={props.min}
    max={props.max}
    step={1 / Math.pow(10, Number(props.decimals))}
    disabled={props.isDisabled}
    value={sliderValue}
    oninput={handleInput}
  />
</div>

<style>
  .SheSlider {
    display: flex;
    align-items: center;
    width: 100%;
    height: 32px;
  }

  .SheSlider input[type='range'] {
    -webkit-appearance: none;
    width: 100%;
    height: 2px;
    background: var(--gray20);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
  }

  .SheSlider input[type='range']::-webkit-slider-runnable-track {
    /* height: 2px;
		background: var(--gray20);
		width: 100%;
		position: absolute; */
    /* display: none; */
  }

  .SheSlider input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .SheSlider input[type='range']:disabled {
    cursor: not-allowed;
    background: #ccc;
  }

  .SheSlider input[type='range']:disabled::-webkit-slider-thumb {
    background: #bbb;
  }
</style>
