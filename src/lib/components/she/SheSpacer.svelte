<script lang="ts">
	type PropsT = {
		size?: number | string
	}

	let props: PropsT = $props()
</script>

<div class="SheSpacer" style:height={props.size} style:width={props.size}></div>
