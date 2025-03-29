<script lang="ts">
  import outlineStore from '../stores/outline/OutlineStore.svelte'
  import WorkspaceItem from './WorkspaceItem.svelte'
  const topLevelItems = $derived(outlineStore.getChildreByParentId(''))
</script>

{#each topLevelItems as item (item.id)}
  <WorkspaceItem id={item.id} />
{/each}
