<script lang="ts">
  import SheIcon from './SheIcon.svelte'
  import classcat from 'classcat'

  type PropsT = {
    class?: string
    kind?: 'dark' | 'light' | 'mid' | string
    size?: 'small' | 'medium' | 'large' | string
    isDisabled?: boolean
    isActive?: boolean
    onClick?: () => void
    iconSide?: 'left' | 'right' | string
    library?: string
    icon?: string
    hoverClipId?: string
  }

  let props: PropsT = $props()
  let hoverClipId = $derived(props.hoverClipId || 'buttonHover')

  let activeClass = props.isActive ? 'isActive' : ''
  let sizeClass = props.size || 'medium'
  let library = $derived(props.library || 'pixelarticons')
  let classes = $derived(classcat([props.class, props.kind, sizeClass, activeClass]))
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<button class="SheIconButton {classes}" disabled={props.isDisabled} onclick={props.onClick}>
  <SheIcon size={props.size} {library} icon={props.icon} class="SheIconButtonIcon" />
</button>

<style>
  :global {
    .SheIconButton {
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
      padding: 0px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      background-color: transparent;
      box-shadow: var(--shadowBorder10);
      color: var(--gray10);

      &.small {
        height: 24px;
        width: 24px;
        min-width: 24px;
      }

      &.medium {
        height: 30px;
        width: 30px;
        min-width: 30px;
      }

      &.large {
        height: 40px;
        width: 40px;
        min-width: 40px;
        padding: 0px;
      }

      &.light {
        background: var(--gray10);
        color: var(--gray40);
        box-shadow: none;

        .SheIconButtonIcon {
          color: var(--gray30);
        }

        &:hover {
          background: var(--gray0);
          color: var(--gray40);

          .SheIconButtonIcon {
            color: var(--gray40);
          }
        }

        &:active {
          background: var(--gray15);
          box-shadow: inset 0 0 0 0px var(--gray0);
        }
      }

      &.mid {
        background-color: var(--gray30);
        color: var(--gray15);
        box-shadow: none;

        .SheIconButtonIcon {
          color: var(--gray15);
        }

        &:hover {
          background-color: var(--gray28);
          color: var(--gray0);
          box-shadow: none;

          .SheIconButtonIcon {
            color: var(--gray0);
          }
        }

        &:active {
          background: var(--gray25);
          box-shadow: inset 0 0 0 0px var(--gray0);
        }
      }

      &.dark {
        background-color: var(--gray40);
        color: var(--gray5);
        box-shadow: var(--shadowBorder25);

        &:hover {
          background-color: var(--gray30);
          color: var(--gray0);

          .SheIconButtonIcon {
            color: var(--gray0);
          }
        }

        &:active {
          background: var(--gray25);
          box-shadow: inset 0 0 0 1px var(--gray0);
        }
      }
    }

    .SheIconButtonIcon {
      transition: all 0.1s ease-in-out;
    }
    .SheIconButton:hover {
      background: var(--gray35);
      box-shadow:
        inset 0 0 0 1px var(--gray0),
        0 0 2px 2px #ffffff11,
        inset 0 0 2px 2px #ffffff11;
    }

    .SheIconButton:active {
      box-shadow:
        inset 0 0 0 1px var(--gray0),
        0 0 12px 2px #ffffff22,
        inset 0 0 12px 2px #ffffff22;
    }

    .SheIconButton:disabled {
      box-shadow: var(--shadowBorder20);
      color: var(--gray20);
      cursor: not-allowed;
      pointer-events: none;
    }
  }
</style>
