<script lang="ts">
  import SheIcon from './SheIcon.svelte'
  import classcat from 'classcat'

  type PropsT = {
    class?: string
    kind?: 'dark' | 'light' | 'mid' | string
    size?: 'small' | 'medium' | 'large' | string
    isDisabled?: boolean
    isActive?: boolean
    onclick?: () => void
    children?: () => any
    iconSide?: 'left' | 'right' | string
    iconLibrary?: string
    icon?: string
    fillWidth?: boolean
    style?: string
    hoverClipId?: string
    gap?: string
    bottomPadding?: number
    textAlign?: string
  }

  let props: PropsT = $props()
  let iconSide = $derived(props.iconSide || 'left')
  let activeClass = props.isActive ? 'isActive' : ''
  let hasIconClass = props.icon ? 'hasIcon' : ''
  let hasChildrenClass = props.children ? 'hasChildren' : ''
  let sizeClass = props.size || 'medium'
  let fillWidthClass = props.fillWidth ? 'fillWidth' : ''
  let textAlign = $derived(props.textAlign ?? 'center')

  let classes = $derived(
    classcat([
      props.class,
      props.kind,
      sizeClass,
      activeClass,
      hasIconClass,
      hasChildrenClass,
      fillWidthClass
    ])
  )

  const style = $derived(props.style || '')
  const gap = $derived(props.gap ? `gap: ${props.gap};` : '')
  const finalStyle = $derived(`${style} ${gap}`)
  const textPaddingStyle = $derived(`padding-bottom: ${props.bottomPadding ?? 0}px;`)
  const textAlignStyle = $derived(`text-align: ${textAlign};`)
  const textWidthStyle = $derived(`width: ${textAlign !== 'center' ? '100%' : 'auto'};`)
  const textStyle = $derived(`${textPaddingStyle} ${textAlignStyle} ${textWidthStyle}`)
</script>

{#snippet icon()}
  {#if props.icon && props.iconLibrary}
    <SheIcon library={props.iconLibrary} icon={props.icon} class="SheButtonIcon" />
  {/if}
{/snippet}

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<button
  class="SheButton {classes}"
  style={finalStyle}
  disabled={props.isDisabled}
  onclick={props.onclick}
>
  {#if iconSide === 'left'}
    {@render icon()}
  {/if}
  {#if props.children}
    <p style={textStyle}>{@render props.children?.()}</p>
  {/if}

  {#if iconSide === 'right'}
    {@render icon()}
  {/if}
</button>

<style>
  :global {
    .fillWidth {
      width: 100%;
    }

    .textAlignStart {
      text-align: start;
    }

    .SheButton {
      font-family: var(--font-family);
      user-select: none;
      font-size: 14px;
      font-weight: 400;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.1s ease-in-out;
      outline: none;
      border: none;
      text-align: center;
      gap: 2px;
      padding: 1px 8px 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      background-color: transparent;
      box-shadow: var(--shadowBorder10);
      color: var(--gray10);

      &.small {
        height: 24px;
      }

      &.medium {
        height: 30px;
      }

      &.large {
        height: 40px;
        padding: 0px 8px 0px;
      }

      &.light {
        background: var(--gray5);
        color: var(--gray40);
        box-shadow: none;

        .SheButtonIcon {
          color: var(--gray20);
        }

        &:hover {
          background: var(--gray0);
          color: var(--gray40);

          .SheButtonIcon {
            color: var(--gray40);
          }
        }
      }

      &.mid {
        background-color: var(--gray30);
        color: var(--gray12);
        box-shadow: var(--shadowBorder40);

        .SheButtonIcon {
          color: var(--gray12);
        }

        &:hover {
          background-color: var(--gray35);
          color: var(--gray0);

          .SheButtonIcon {
            color: var(--gray0);
          }
        }

        &.isActive {
          background: var(--gray35);
          box-shadow:
            inset 0 0 0 1px var(--gray0),
            0 0 2px 2px #ffffff44;
        }
      }

      &.dark {
        background-color: var(--gray40);
        color: var(--gray10);
        box-shadow: var(--shadowBorder25);

        &:hover {
          background-color: var(--gray35);
          color: var(--gray0);
          box-shadow: var(--shadowBorder20);

          .SheButtonIcon {
            color: var(--gray0);
          }
        }

        &.isActive {
          background: var(--gray25);
          box-shadow: var(--shadowBorder10);
        }
      }

      &.hasChildren.hasIcon {
        padding-right: 10px;
      }

      &.hasIcon:not(.hasChildren) {
        padding-right: 0px;
      }
    }

    .SheButton:hover {
      background: var(--gray35);
      box-shadow: inset 0 0 0 1px var(--gray0);
    }

    .SheButton:active {
      box-shadow: inset 0 0 0 1px var(--gray0);
    }

    .SheButton:disabled {
      box-shadow: var(--shadowBorder20);
      color: var(--gray20);
      cursor: not-allowed;
      pointer-events: none;
    }
  }
</style>
