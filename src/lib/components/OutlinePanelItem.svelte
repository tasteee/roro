<script lang="ts">
  import outlineStore from '$lib/stores/outline/OutlineStore.svelte'
  import Icon from '@iconify/svelte'
  import { Text } from 'kampsy-ui'
  import OutlinePanelItem from './OutlinePanelItem.svelte'
  import inputStore from '$lib/stores/InputStore.svelte'
  import SheInput from './she/SheInput.svelte'

  type PropsT = {
    id: string
  }

  const props: PropsT = $props()
  const item = outlineStore.getItemById(props.id)
  const isGroup = $derived(item?.type === 'group')
  const children = $derived(outlineStore.getChildreByParentId(item?.id))
  const isSelected = $derived(outlineStore.selectedItemIds.includes(item?.id))
  let isEditing = $state(false)
  let nameInput = $state<HTMLInputElement>()

  const rootClass = $derived.by(() => {
    const classes = ['OutlinePanelItem']
    if (isSelected) classes.push('isSelected')
    if (item?.isLocked) classes.push('isLocked')
    if (!item?.isVisible) classes.push('isHidden')
    return classes.join(' ')
  })

  const onArrowClick = (e: MouseEvent) => {
    e.stopPropagation()
    outlineStore.toggleGroupOpen(item.id)
  }

  const onLockClick = (e: MouseEvent) => {
    e.stopPropagation()
    outlineStore.toggleItemLocked(item.id)
  }

  const onEyeClick = (e: MouseEvent) => {
    e.stopPropagation()
    outlineStore.toggleItemVisible(item.id)
  }

  const onSelect = (e: MouseEvent) => {
    e.stopPropagation()
    if (item.isLocked) return

    if (e.shiftKey) {
      // Range selection (Photoshop-like)
      if (outlineStore.selectedItemIds.length > 0) {
        const lastSelectedId = outlineStore.selectedItemIds[outlineStore.selectedItemIds.length - 1]
        const lastSelectedItem = outlineStore.getItemById(lastSelectedId)
        const currentItemIndex = outlineStore.items.indexOf(item)
        const lastSelectedIndex = outlineStore.items.indexOf(lastSelectedItem)

        // Select all items in the range that have the same parent
        const startIdx = Math.min(currentItemIndex, lastSelectedIndex)
        const endIdx = Math.max(currentItemIndex, lastSelectedIndex)

        outlineStore.clearSelection()
        for (let i = startIdx; i <= endIdx; i++) {
          if (outlineStore.items[i].parentId === item.parentId) {
            outlineStore.addToSelection(outlineStore.items[i].id)
          }
        }
      } else {
        outlineStore.selectItem(item.id)
      }
    } else if (e.ctrlKey || e.metaKey) {
      // Add/remove from selection
      if (isSelected) {
        outlineStore.removeFromSelection(item.id)
      } else {
        outlineStore.addToSelection(item.id)
      }
    } else {
      // Normal selection
      outlineStore.selectItem(item.id)
    }
  }

  $effect(() => {
    if (nameInput) {
      nameInput.focus()
      nameInput.select()
    }
  })

  const onDoubleClick = (e: MouseEvent) => {
    e.stopPropagation()
    isEditing = true
    inputStore.stop()
  }

  const onNameInputBlur = () => {
    finishEditing()
  }

  const onNameInputKeyDown = (key: string | number, e: KeyboardEvent) => {
    if (key === 'Enter') {
      finishEditing()
      e.preventDefault()
    } else if (key === 'Escape') {
      isEditing = false
      e.preventDefault()
    }
  }

  const finishEditing = () => {
    if (isEditing && nameInput?.value) outlineStore.renameItem(item.id, nameInput.value)
    isEditing = false
    inputStore.start()
  }

  // Handle drag & drop
  let isDragging = $state(false)
  let dragCounter = $state(0)

  function handleDragStart(e: DragEvent) {
    if (item.isLocked) {
      e.preventDefault()
      return
    }

    e.dataTransfer.setData('text/plain', item.id)
    isDragging = true

    // Select the item if not already selected
    if (!isSelected) {
      outlineStore.selectItem(item.id)
    }
  }

  function handleDragEnd() {
    isDragging = false
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDragEnter(e: DragEvent) {
    e.preventDefault()
    dragCounter++
  }

  function handleDragLeave() {
    dragCounter--
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    dragCounter = 0

    const draggedItemId = e.dataTransfer.getData('text/plain')
    if (!draggedItemId || draggedItemId === item.id) return

    const draggedItem = outlineStore.getItemById(draggedItemId)
    if (!draggedItem) return

    // Handle dropping into a group
    if (isGroup) {
      // Move the dragged item into this group
      const newItems = [...outlineStore.items]
      const draggedIndex = newItems.indexOf(draggedItem)

      // Remove from current position
      newItems.splice(draggedIndex, 1)

      // Update parent ID
      draggedItem.parentId = item.id

      // Find where to insert - at the top of the group's contents
      const insertIndex = newItems.indexOf(item) + 1
      newItems.splice(insertIndex, 0, draggedItem)

      outlineStore.items = newItems
    } else {
      // Handle dropping next to another item (above it)
      const newItems = [...outlineStore.items]
      const draggedIndex = newItems.indexOf(draggedItem)
      const targetIndex = newItems.indexOf(item)

      // Remove from current position
      newItems.splice(draggedIndex, 1)

      // Update parent ID to match the target's parent
      draggedItem.parentId = item.parentId

      // Insert before the target item
      newItems.splice(targetIndex, 0, draggedItem)

      outlineStore.items = newItems
    }
  }
</script>

<div class="OutlinePanelItemBox">
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class={rootClass}
    onclick={onSelect}
    draggable={!item.isLocked}
    ondragstart={handleDragStart}
    ondragend={handleDragEnd}
    ondragover={handleDragOver}
    ondragenter={handleDragEnter}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    onpointerenter={() => (outlineStore.hoveredItemId = item.id)}
    onpointerleave={() => (outlineStore.hoveredItemId = '')}
    class:isDragging
    class:isDragOver={dragCounter > 0 && isGroup}
  >
    <div class="itemPrefix">
      {#if isGroup}
        {#if item.isOpen}
          <button class={'arrowButton isOpen'} onclick={onArrowClick}>
            <Icon class="openGroupIcon" color="#000000" icon="mingcute:down-line" />
          </button>
        {:else}
          <button class={'arrowButton'} onclick={onArrowClick}>
            <Icon class="openGroupIcon" color="#000000" icon="mingcute:right-line" />
          </button>
        {/if}
      {:else}
        <div class="typeIcon">
          <Icon icon="mingcute:shape-line" />
        </div>
      {/if}
    </div>

    <div class="itemContent" ondblclick={onDoubleClick}>
      {#if isEditing}
        <SheInput
          type="text"
          bind:ref={nameInput}
          value={item.name}
          onblur={onNameInputBlur}
          onkeydown={onNameInputKeyDown}
          class="nameInput"
        />
      {:else}
        <Text class="itemName" size={14}>{item.name}</Text>
      {/if}
    </div>

    <div class="iconsBox">
      <button class="iconButton" onclick={onLockClick} title={item.isLocked ? 'Unlock' : 'Lock'}>
        <Icon
          class={'lockIcon ' + item.isLocked ? 'isLocked' : ''}
          color="#000000"
          icon={item.isLocked ? 'mingcute:lock-fill' : 'mingcute:lock-line'}
        />
      </button>

      <button class="iconButton" onclick={onEyeClick} title={item.isVisible ? 'Hide' : 'Show'}>
        <Icon
          class={'eyeIcon ' + item.isVisible ? 'itemIsHidden' : ''}
          color="#000000"
          icon={item.isVisible ? 'mingcute:eye-2-fill' : 'mingcute:eye-close-fill'}
        />
      </button>
    </div>
  </div>

  {#if isGroup && item.isOpen && children.length}
    <div class="childrenBox">
      {#each children as child (child.id)}
        <OutlinePanelItem id={child.id} />
      {/each}
    </div>
  {/if}
</div>

<style>
  :global {
    .OutlinePanelItemBox {
      display: flex;
      flex-direction: column;
    }

    .childrenBox {
      padding-left: 20px;
      border-left: 1px dotted #9fadaa;
      margin-left: 10px;
    }

    .OutlinePanelItem {
      padding: 6px 8px;
      display: flex;
      gap: 8px;
      width: 100%;
      align-items: center;
      height: 42px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.1s;
    }

    .OutlinePanelItem:hover {
      background: #f5f5f5;
    }

    .OutlinePanelItem.isSelected {
      background: #e6e6e6;
    }

    .OutlinePanelItem.isDragging {
      opacity: 0.5;
    }

    .OutlinePanelItem.isDragOver {
      background: #eaf5ff;
      box-shadow: 0 0 0 2px #4dabf7;
    }

    .OutlinePanelItem.isLocked {
      opacity: 0.7;
    }

    .OutlinePanelItem.isHidden {
      opacity: 0.5;
    }

    .OutlinePanelItem .itemPrefix {
      display: flex;
      align-items: center;
      width: 20px;
    }

    .OutlinePanelItem .itemContent {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }

    .OutlinePanelItem .nameInput {
      width: 100%;
      padding: 2px 4px;
      border: 1px solid #aaa;
      border-radius: 3px;
      font-size: 14px;
    }

    .OutlinePanelItem .itemName {
      position: relative;
      bottom: 1px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .OutlinePanelItem .arrowButton {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(0deg);
      transition: transform 0.2s ease-in-out;
    }

    .OutlinePanelItem .iconButton {
      background: none;
      border: none;
      padding: 2px;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .OutlinePanelItem .iconButton:hover {
      opacity: 1;
    }

    .OutlinePanelItem .iconsBox {
      display: flex;
      gap: 8px;
      opacity: 0.8;
    }

    .OutlinePanelItem:hover .iconsBox {
      opacity: 1;
    }
  }
</style>
