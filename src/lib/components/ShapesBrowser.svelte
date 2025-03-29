<script lang="ts">
  import Icon from '@iconify/svelte'
  import { Text } from 'kampsy-ui'
  import { Card } from 'svelte-5-ui-lib'
  import { shapes, categories } from '$lib/data/shapes'
  import outlineStore from '$lib/stores/outline/OutlineStore.svelte'
  import SheButton from './she/SheButton.svelte'
  import SheIcon from './she/SheIcon.svelte'
</script>

<Card class="ShapesBrowser" size="xs" shadow="md" padding="xs" horizontal>
  <div class="panelHeader">
    <p>Shapes</p>
    <!-- <div class="panelActions">
      <button class="iconButton" title="Add New Group">
        <Icon icon="mingcute:new-folder-line" />
      </button>
      <button class="iconButton" title="Duplicate Selected">
        <Icon icon="mingcute:copy-line" />
      </button>
    </div> -->
  </div>

  <div class="shapesList">
    {#each shapes as shape}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="shapeBox">
        <SheButton
          bottomPadding={3}
          textAlign="start"
          kind="light"
          iconLibrary="mingcute"
          iconSide="left"
          icon="add-square-line"
          onclick={() => outlineStore.addObject(shape)}
        >
          {shape.name}
        </SheButton>
      </div>
    {/each}
  </div>

  <!-- <div class="categoriesList">
    {#each categories as category}
      <div class="categoryBox">
        <Text class="categoryName" size={14}>{category.name}</Text>
        <div class="lowerBox">
          <img src="https://i.imgur.com/eVEyEAn.jpeg" class="categoryImage" alt={category.name} />
        </div>
      </div>
    {/each}
  </div> -->
</Card>

<style>
  :global {
    .ShapesBrowser > div {
      height: 100%;
    }

    .ShapesBrowser .shapeImage {
      max-width: 80%;
      margin: 0 auto;
    }

    .ShapesBrowser .shapesList {
      padding-top: 8px;
      height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-bottom: 48px;
    }

    .ShapesBrowser .shapeBox {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
    }

    .ShapesBrowser .shapeBox .shapeName {
      font-size: 14px;
      font-weight: bold;
      padding-left: 12px;
    }

    .ShapesBrowser .shapeBox .lowerBox {
      display: flex;
      gap: 4px;
      width: 100%;
    }

    .ShapesBrowser .categoriesList {
      padding-top: 8px;
    }

    .ShapesBrowser .categoryBox {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
      height: 120px;
    }

    .ShapesBrowser .categoryBox .lowerBox {
      display: flex;
      gap: 4px;
      width: 100%;
    }

    .ShapesBrowser {
      user-select: none;
      z-index: 100;
      position: absolute;
      left: 12px;
      top: 12px;
      max-width: 160px;
      width: 160px;
      height: calc(100% - 24px);
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .ShapesBrowser .panelHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px 8px 8px;
      border-bottom: 1px solid #e0e0e0;
    }

    .ShapesBrowser .panelActions {
      display: flex;
      gap: 8px;
    }

    .ShapesBrowser .iconButton {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ShapesBrowser .iconButton:hover {
      background: #f0f0f0;
    }

    .ShapesBrowser .itemsList {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow-y: auto;
      max-height: 400px;
      padding: 6px 0;
    }

    .ShapesBrowser .emptyState {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
      color: #888;
    }

    .ShapesBrowser .emptyState button {
      margin-top: 8px;
      padding: 6px 12px;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }
  }
</style>
