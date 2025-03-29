<script lang="ts">
  import classcat from 'classcat'
  import debounce from 'just-debounce'

  type PropsT = {
    id?: string
    label?: string
    type?: 'text' | 'number' | 'color' | 'range' | 'textarea' | 'slider'
    value?: string | number
    placeholder?: string
    min?: string | number
    max?: string | number
    step?: string | number
    decimals?: string | number
    class?: string
    isDisabled?: boolean
    size?: 'small' | 'medium' | 'large'
    onfocus?: (event: any) => void
    onblur?: (event: any) => void
    onChange?: (value: string | number, event: any) => void
    onkeydown?: (value: string | number, event: any) => void
    ref?: any
  }

  let { ref = $bindable(), ...props }: PropsT = $props()

  // Create a bindable inputElement
  // export let inputElement = $bindable<HTMLInputElement | HTMLTextAreaElement | null>(null)

  let size = $derived(props.size ?? 'medium')
  let type = $derived(props.type ?? 'text')
  let isDisabled = $derived(props.isDisabled ? 'isDisabled' : '')
  let shouldShowRangeValue = $derived(type === 'range')

  // Format number according to decimals
  function formatNumber(value: number | string): any {
    const num = parseFloat(value as string)
    if (isNaN(num)) return value
    if (typeof props.decimals !== 'number') return num
    return Number(num.toFixed(props.decimals))
  }

  const handleInput = debounce((event: Event) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement
    let value: string | number = target.value

    if (type === 'number' || type === 'range' || type === 'slider') {
      if (target.value === '') value = ''
      else value = formatNumber(Number(target.value))
    }

    if (type === 'color') value = target.value.toUpperCase()
    props.onChange?.(value, event)
  }, 100)

  let classes = $derived(classcat([props.class, type, size, isDisabled]))
</script>

{#if type === 'slider'}
  <div class="SheInput {classes} SheSlider">
    <input
      type="range"
      value={props.value}
      data-value={props.value}
      min={props.min}
      max={props.max}
      step={props.step}
      disabled={props.isDisabled}
      oninput={handleInput}
      onkeydown={(event: any) => props.onkeydown?.(event.key, event)}
      onfocus={(event: any) => props.onfocus?.(event)}
      onblur={(event: any) => props.onblur?.(event)}
      bind:this={ref}
    />
  </div>
{/if}

{#if type !== 'slider'}
  <!-- svelte-ignore a11y_mouse_events_have_key_events -->
  <label class="SheInput {classes}" data-type={type} data-size={size}>
    {#if props.label}<span class="label">{props.label}</span>{/if}

    {#if type === 'textarea'}
      <textarea
        disabled={props.isDisabled}
        value={props.value}
        placeholder={props.placeholder}
        oninput={handleInput}
        bind:this={ref}
      ></textarea>
    {:else}
      <input
        {type}
        autocomplete="off"
        value={props.value}
        data-value={props.value}
        placeholder={props.placeholder}
        min={props.min}
        max={props.max}
        step={props.step}
        disabled={props.isDisabled}
        oninput={handleInput}
        onchange={handleInput}
        onkeydown={(event: any) => props.onkeydown?.(event.key, event)}
        onfocus={(event: any) => props.onfocus?.(event)}
        onblur={(event: any) => props.onblur?.(event)}
        bind:this={ref}
      />
    {/if}
    {#if shouldShowRangeValue}
      <input
        class="rangeValueInput"
        type="number"
        value={props.value}
        min={props.min}
        max={props.max}
        step={props.step}
        disabled={props.isDisabled}
        oninput={handleInput}
        onkeydown={(event: any) => props.onkeydown?.(event.key, event)}
        onfocus={(event: any) => props.onfocus?.(event)}
        onblur={(event: any) => props.onblur?.(event)}
      />
    {/if}
  </label>
{/if}

<style>
  .SheInput {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    height: 30px;
    padding: 1px 8px;
    border-radius: 5px;
    background-color: transparent;
    box-shadow: var(--shadowBorder25);
    color: var(--gray0);
    font-size: 14px;
    transition: all 0.4s ease-in-out;
    width: 100%;
  }

  .SheInput.slider {
    box-shadow: none;
  }

  .SheInput [type='range'] {
    background: var(--gray20);
    height: 2px !important;
  }

  .SheInput:has([type='range']):not(.slider) {
    margin-bottom: 2px;
  }

  .SheInput.small {
    height: 24px;
    font-size: 12px;
  }

  .SheInput.medium {
    height: 30px;
    font-size: 14px;
  }

  .SheInput.large {
    height: 36px;
    font-size: 16px;
    padding: 0.5px 16px;
  }

  .SheInput input {
    height: calc(100% - 1px) !important;
  }

  .SheInput input,
  .SheInput textarea {
    height: 100%;
    background: var(--gray40);
  }

  .SheInput input:auto-fill {
    background: transparent;
  }

  .SheInput.small input,
  .SheInput.small textarea {
    font-size: 12px;
  }

  .SheInput.medium input,
  .SheInput.medium textarea {
    font-size: 14px;
  }

  .SheInput.large input,
  .SheInput.large textarea {
    font-size: 16px;
  }

  .SheInput:hover {
    box-shadow: var(--hoverShadowBorder);
  }

  .SheInput:active {
    box-shadow: var(--activeShadowBorder);
  }

  .SheInput:hover {
    /* background: var(--gray35); */
  }

  .SheInput:focus-within {
    background: var(--gray35);
    box-shadow: var(--shadowBorder8);

    & .label {
      color: var(--gray0);
    }
  }

  .label {
    color: var(--gray12);
    user-select: none;
  }

  input,
  textarea {
    background: transparent;
    border: none;
    outline: none;
    color: var(--gray12);
    font-size: 14px;
    width: 100%;
    min-width: 0;
    padding: 0;
  }

  /* Remove number input arrows */
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }

  /* Custom range slider styling */
  input {
    appearance: none;
    background: var(--gray20);
    height: 2px;
    border-radius: 1px;
    padding: 0px 0px 1px;
  }

  input + .rangeValueInput {
    width: 30%;
  }

  input::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--gray12);
    cursor: pointer;
  }

  /* Textarea styling */
  .SheInput.textarea {
    height: auto;
    align-items: flex-start;
    padding: 8px;
    flex-direction: column;
  }

  textarea {
    resize: vertical;
    min-height: 60px;
    font-family: inherit;
  }

  /* Range value display */
  .rangeValueInput {
    min-width: 30px;
    text-align: right;
    color: var(--gray12);
  }

  .rangeValueInput::before {
    position: relative;
    left: -10px;
    top: 2px;
    display: flex;
    font-size: 12px;
    color: var(--gray12);
    content: '%';
    width: 20px;
    height: 20px;
  }

  /* Disabled state */
  .SheInput.isDisabled {
    box-shadow: var(--shadowBorder20);
    color: var(--gray20);
    cursor: not-allowed !important;

    & input {
      pointer-events: none;
    }

    & .label {
      color: var(--gray20);
    }
  }

  .SheInput.isDisabled input,
  .SheInput.isDisabled textarea {
    color: var(--gray20);
  }

  .SheSlider {
    height: 32px;
  }
</style>
