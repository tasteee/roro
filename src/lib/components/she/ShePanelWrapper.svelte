<script lang="ts">
  import ShePanel from './ShePanel.svelte'
  const props = $props()
</script>

<ShePanel side="right" title="Item" onCloseClick={props.onCloseClick} isOpen isCollapsible>
  {@render props.children()}
</ShePanel>

<style>
</style>
