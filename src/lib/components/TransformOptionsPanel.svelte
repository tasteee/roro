<script lang="ts">
  import { Card } from 'svelte-5-ui-lib'
  import outlineStore from '$lib/stores/outline/OutlineStore.svelte'
  import OutlinePanelItem from './OutlinePanelItem.svelte'
  import Icon from '@iconify/svelte'
  import { cube } from '$lib/data/shapes'
  import { Button, Text } from 'kampsy-ui'
  import SheSpacer from './SheSpacer.svelte'
  import SheButton from './she/SheButton.svelte'
  import SheButtonGroup from './she/SheButtonGroup.svelte'
  import SheIcon from './she/SheIcon.svelte'

  const isAnythingSelected = $derived(outlineStore.selectedItemIds.length)
</script>

{#snippet buttonOption(label: string, icon: string, key: string)}
  {@const kind = outlineStore.transformMode !== key ? 'light' : 'dark'}
  <!-- {@const iconColor = kind === 'light' ? 'white' : 'white'} -->

  <SheButton {kind} onclick={() => outlineStore.setTransformMode(key)}>
    {label}
    <!-- <SheIcon {icon} size="small" color={iconColor} /> -->
  </SheButton>
{/snippet}

{#if isAnythingSelected}
  <!-- <Card class="" size="xs" shadow="md" padding="xs" horizontal> -->
  <div class="TransformOptionsPanel">
    <SheButtonGroup class="transformOptionsbuttonGroup">
      {@render buttonOption('Move', 'arrows-horizontal', 'translate')}
      {@render buttonOption('Rotate', 'arrows-vertical', 'rotate')}
      {@render buttonOption('Scale', 'arrows-vertical', 'scale')}
    </SheButtonGroup>
  </div>
{/if}

<!-- </Card> -->

<style>
  .TransformOptionsPanel {
    position: absolute;
    top: 12px;
    left: 184px;
    width: auto;
    margin: 0 auto;
    z-index: 110;
    border: 5px solid var(--grayish3);
    border-radius: 6px;
    overflow: hidden;
    background: var(--grayish3);
  }

  :global {
    .transformOptionsbuttonGroup {
      user-select: none;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .panelHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      /* padding: 0 8px 8px 8px; */
      /* border-bottom: 1px solid #e0e0e0; */
    }

    .transformOptionsbuttonGroup .panelFooter {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0px 0px;
      border-top: 1px solid #e0e0e0;
    }

    .transformOptionsbuttonGroup .panelActions {
      display: flex;
      gap: 8px;
    }

    .transformOptionsbuttonGroup .iconButton {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .transformOptionsbuttonGroup .iconButton:hover {
      background: #f0f0f0;
    }

    .transformOptionsbuttonGroup .itemsList {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow-y: auto;
      max-height: 400px;
      padding: 6px 0;
    }

    .transformOptionsbuttonGroup .emptyState {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
      color: #888;
    }

    .transformOptionsbuttonGroup .emptyState button {
      margin-top: 8px;
      padding: 6px 12px;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }
  }
</style>
