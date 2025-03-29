<script lang="ts">
  import SheSpacer from './SheSpacer.svelte'
  import SheIconButton from './SheIconButton.svelte'
  import stores from '~/stores'
  import classcat from 'classcat'

  type PropsT = {
    width?: string
    class?: string
    title: string
    onCloseClick?: () => void
    isOpen: boolean
    children: () => any
    side?: 'left' | 'right'
    headerAccessory?: () => any
    isCollapsible?: boolean
    isCloseable?: boolean
  }

  let props: PropsT = $props()
  let isCollapsed = $state(false)

  const toggleCollapse = () => {
    isCollapsed = !isCollapsed
  }

  const handleCloseClick = () => {
    const close = props.onCloseClick ?? stores.menuBar.closePanel
    close()
  }

  const collapsibleClass = props.isCollapsible ? 'isCollapsible' : ''
  const collapsedClass = $derived(isCollapsed ? 'isCollapsed' : '')
  const sideClass = $derived(props.side ? `${props.side}Side` : '')
  const openClass = $derived(props.isOpen ? 'isOpen' : '')
  const style = `--panelWidth: ${props.width || '320px'}`
  const classes = $derived.by(() =>
    classcat([props.class, collapsibleClass, collapsedClass, sideClass, openClass])
  )
</script>

<div class="ShePanel {classes}" {style}>
  <div class="ShePanelHeader">
    <div class="ShePanelHeaderTopRow">
      <h1 class="ShePanelTitle">{props.title}</h1>
      <div class="ShePanelHeaderIcons">
        {#if props.isCollapsible}
          <SheIconButton
            kind="dark"
            onClick={toggleCollapse}
            library="pixelarticons"
            icon="minus"
          />
        {/if}
        {#if props.isCloseable}
          <SheIconButton
            kind="dark"
            onClick={handleCloseClick}
            library="pixelarticons"
            icon="close"
          />
        {/if}
      </div>
    </div>
    {#if props.headerAccessory}
      <div class="ShePanelHeaderAccessory">{@render props.headerAccessory()}</div>
    {/if}
  </div>
  {#if !isCollapsed}
    <div class="ShePanelContent">
      {@render props.children()}
      <SheSpacer />
    </div>
  {/if}
</div>

<style>
  .ShePanel {
    opacity: 0;
    padding: 1px;
    transition: all 0.2s ease-in-out;
    background: var(--gray40);
    color: var(--gray0);
    border-radius: 5px;
    position: absolute;
    width: var(--panelWidth);
    height: calc(100vh - 256px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 100;
    top: 76px;
    box-shadow:
      -2px 2px 24px 4px rgb(0 0 0 / 85%),
      inset 0px 0px 0px 1px var(--gray20);

    &.leftSide {
      left: -350px;
    }

    &.rightSide {
      right: -350px;
    }

    &.isOpen {
      opacity: 1;

      &.leftSide {
        left: 12px;
      }

      &.rightSide {
        right: 12px;
      }
    }
  }

  .ShePanelHeaderIcons {
    display: flex;
    gap: 8px;
  }

  .ShePanelHeaderTopRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ShePanelHeaderAccessory {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ShePanel {
    --background: var(--gray40);
  }

  .ShePanel.isCollapsible.isCollapsed {
    height: auto;
  }

  .ShePanelHeader {
    border-radius: 5px 5px 0 0;
    border-bottom: 1px solid var(--gray35);
    background-color: var(--gray40);
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ShePanelTitle {
    margin: 0;
    font-weight: bold;
  }

  .ShePanelCloseButton {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--brandColorA0);
    transition: color 0.3s ease;
  }

  .ShePanelCloseButton:hover {
    color: var(--brandColorA20);
  }

  .ShePanelContent {
    flex-grow: 1;
    overflow-y: auto;
    padding: 0px;
    padding-bottom: 12px;
  }

  .ShePanelContent::-webkit-scrollbar {
    width: 8px;
    position: absolute;
    right: 0;
    background: transparent;
  }

  .ShePanelContent::-webkit-scrollbar-thumb {
    background: var(--gray32);
    border-radius: 8px;
  }
</style>
