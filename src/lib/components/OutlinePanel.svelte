<script lang="ts">
  import { Card } from 'svelte-5-ui-lib'
  import outlineStore from '$lib/stores/outline/OutlineStore.svelte'
  import OutlinePanelItem from './OutlinePanelItem.svelte'
  import Icon from '@iconify/svelte'
  import { cube } from '$lib/data/shapes'
  import { Button, Text } from 'kampsy-ui'
  import SheSpacer from './SheSpacer.svelte'

  const topLevelItems = $derived(outlineStore.getChildreByParentId(''))

  // Panel action handlers
  function addNewShape() {
    outlineStore.addObject(cube)
  }

  function addNewGroup() {
    outlineStore.addGroup()
  }

  function deleteSelected() {
    outlineStore.deleteSelected()
  }

  function duplicateSelected() {
    outlineStore.duplicateSelected()
  }
</script>

<Card class="OutlinePanel" size="xs" shadow="md" padding="xs" horizontal>
  <div class="panelHeader">
    <p>Outline</p>
    <div class="panelActions">
      <button class="iconButton" onclick={addNewShape} title="Add New Shape">
        <Icon icon="mingcute:add-line" />
      </button>
      <button class="iconButton" onclick={addNewGroup} title="Add New Group">
        <Icon icon="mingcute:new-folder-line" />
      </button>
      <button class="iconButton" onclick={duplicateSelected} title="Duplicate Selected">
        <Icon icon="mingcute:copy-line" />
      </button>
      <button class="iconButton" onclick={deleteSelected} title="Delete Selected">
        <Icon icon="mingcute:delete-line" />
      </button>
    </div>
  </div>

  <div class="itemsList" onclick={() => outlineStore.clearSelection()} role="presentation">
    {#each topLevelItems as item (item.id)}
      <OutlinePanelItem id={item.id} />
    {/each}

    {#if topLevelItems.length === 0}
      <div class="emptyState">
        <p>No layers yet</p>
        <button onclick={addNewShape}>Add a Cube</button>
      </div>
    {/if}
  </div>

  <div class="panelFooter">
    <div class="panelActions">
      <Button
        variant="secondary"
        size="tiny"
        aria-label="deselect all items"
        onclick={outlineStore.clearSelection}>Deselect</Button
      >
      <Button
        variant="secondary"
        size="tiny"
        aria-label="deselect all items"
        onclick={outlineStore.selectAll}>Select All</Button
      >
      <SheSpacer size="4px" />
      <Button variant="secondary" size="tiny" aria-label="deselect all items">
        <Icon icon="mingcute:back-2-line" />
      </Button>
      <Button variant="secondary" size="tiny" aria-label="deselect all items">
        <Icon icon="mingcute:forward-2-line" />
      </Button>
    </div>
  </div>
</Card>

<style>
  :global {
    .OutlinePanel {
      user-select: none;
      z-index: 100;
      position: absolute;
      right: 12px;
      top: 64px;
      max-width: 320px;
      width: 320px;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .OutlinePanel .panelHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px 8px 8px;
      border-bottom: 1px solid #e0e0e0;
    }

    .OutlinePanel .panelFooter {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0px 0px;
      border-top: 1px solid #e0e0e0;
    }

    .OutlinePanel .panelActions {
      display: flex;
      gap: 8px;
    }

    .OutlinePanel .iconButton {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .OutlinePanel .iconButton:hover {
      background: #f0f0f0;
    }

    .OutlinePanel .itemsList {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow-y: auto;
      max-height: 400px;
      padding: 6px 0;
    }

    .OutlinePanel .emptyState {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
      color: #888;
    }

    .OutlinePanel .emptyState button {
      margin-top: 8px;
      padding: 6px 12px;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }
  }
</style>
