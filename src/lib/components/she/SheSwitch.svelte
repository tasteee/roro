<script lang="ts">
  type PropsT = {
    label?: string
    size?: 'small' | 'medium' | 'large'
    isDisabled?: boolean
    value?: boolean
    class?: string
    onChange?: (value: boolean) => void
    hoverClipId?: string
  }

  let props: PropsT = $props()
  let checked = $derived(props.value ?? false)
  let size = $derived(props.size ?? 'medium')

  function handleChange(e: Event) {
    const target = e.target as HTMLInputElement
    props.onChange?.(target.checked)
  }
</script>

<label
  class="SheSwitch {props.class}"
  data-size={size}
  data-checked={checked}
  data-disabled={props.isDisabled}
>
  {#if props.label}
    <span class="label">{props.label}</span>
  {/if}

  <div class="SwitchWrapper {size}">
    <input type="checkbox" {checked} disabled={props.isDisabled} onchange={handleChange} />
    <div class="circle"></div>
  </div>
</label>

<style>
  .SheSwitch {
    margin-bottom: 4px;
    padding: 0px 4px;
  }

  .SwitchWrapper.small {
    width: 32px;
    height: 18px;
  }

  .SwitchWrapper.large {
    width: 48px;
    height: 26px;
  }

  .SwitchWrapper.medium {
    width: 40px;
    height: 22px;
  }

  .SwitchWrapper.small .circle {
    width: 14px;
    height: 14px;
  }

  .SwitchWrapper.large .circle {
    width: 22px;
    height: 22px;
  }

  .SwitchWrapper.medium .circle {
    width: 18px;
    height: 18px;
  }

  .SheSwitch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
    user-select: none;
  }

  .SheSwitch:hover .SwitchWrapper {
    background: var(--gray30);
  }

  .label {
    color: var(--gray15);
    font-size: 14px;
  }

  .SheSwitch[data-checked='true'] .label {
    color: var(--gray0);
  }

  .SwitchWrapper {
    position: relative;
    border-radius: 999px;
    box-shadow: var(--shadowBorder15);
    transition: all 0.2s ease;
  }

  input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    margin: 0;
    padding: 0;
  }

  .circle {
    position: absolute;
    top: 50%;
    left: 3px;
    transform: translateY(-50%);
    background-color: var(--gray15);
    border-radius: 50%;
    width: 18px;
    height: 18px;
  }

  /* Checked state */
  .SheSwitch[data-checked='true'] .SwitchWrapper {
    box-shadow: var(--shadowBorder0);
  }

  .SheSwitch[data-checked='true'] .circle {
    background-color: var(--gray0);
    left: 19px; /* Slight adjustment to ensure the circle stays inside */
  }

  /* Disabled state */
  .SheSwitch[data-disabled='true'] {
    cursor: not-allowed;
  }

  .SheSwitch[data-disabled='true'] .label {
    color: var(--gray25);
  }

  .SheSwitch[data-disabled='true'] .SwitchWrapper {
    box-shadow: var(--shadowBorder25);
  }

  .SheSwitch[data-disabled='true'] .circle {
    background-color: var(--gray25);
  }

  .SheSwitch[data-checked='false'] .SwitchWrapper {
    background-color: var(--gray30); /* Or any other background color for "unchecked" state */
  }

  /* Size specific styles */
  .SheSwitch[data-size='small'] .label {
    font-size: 12px;
  }

  .SheSwitch[data-size='large'] .label {
    font-size: 16px;
  }
</style>
