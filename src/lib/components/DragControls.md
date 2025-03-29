# DragControls

```svelte
<script>
	import DragControls from '@tasteink/velvet/DragControls'
	let mesh = $state(null)
</script>

<T.Mesh bind:ref={mesh} />
<DragControls target={mesh} />
```
