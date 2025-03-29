<script lang="ts">
	import classcat from 'classcat'

	type PropsT = {
		class?: string
		children: any
		shouldWrap?: boolean
		xAlign?: 'start' | 'center' | 'end' | 'between' | 'around'
	}

	const props: PropsT = $props()
	const xAlignClass = 'xAlign-' + props.xAlign || 'start'
	const classes = classcat([props.class, props.shouldWrap ? 'flexWrap' : 'flexNoWrap', xAlignClass])
</script>

<div class="ShePanelRow {classes}">
	{@render props.children?.()}
</div>

<style>
	:global {
		.ShePanelRow {
			display: flex;
			gap: 8px;
		}

		.flexWrap {
			flex-wrap: wrap;
		}

		.flexNoWrap {
			flex-wrap: nowrap;
		}

		.xAlign-start {
			justify-content: flex-start;
		}

		.xAlign-end {
			justify-content: flex-end;
		}

		.xAlign-center {
			justify-content: center;
		}

		.xAlign-between {
			justify-content: space-between;
		}

		.xAlign-around {
			justify-content: space-around;
		}
	}
</style>
