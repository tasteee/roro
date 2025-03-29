<script lang="ts">
	import SheDivider from './SheDivider.svelte'
	import classcat from 'classcat'

	type PropsT = {
		classes?: string
		label: string
		children: any
		row?: boolean
		isOpen?: boolean
		onClick?: () => void
	}

	const props: PropsT = $props()
	let isOpen = $state(props.isOpen ?? true)
	let classes = $derived(classcat([props.classes, isOpen ? '' : 'closed']))
	let innerClasses = $derived(classcat([props.row ? 'row' : 'column']))

	let onClick = () => {
		isOpen = !isOpen
		props.onClick?.()
	}
</script>

<div class="ShePanelInnerSection {classes}">
	<SheDivider nested label={props.label} {isOpen} {onClick} />
	<div class="contentBox {innerClasses}">
		{@render props.children()}
	</div>
</div>

<style lang="postcss">
	:global {
		.ShePanelInnerSection {
			display: flex;
			flex-direction: column;
			padding: 0px;
			margin: 0px 0px 8px;
		}

		.ShePanelInnerSection .contentBox {
			flex-direction: column;
			gap: 8px;

			&.row {
				flex-direction: row;
			}
		}

		.ShePanelInnerSection.closed {
			height: 32px;
			overflow: hidden;
			margin-bottom: 0px;
		}

		.ShePanelInnerSection .SheDivider {
			margin-top: 4px;
		}
	}
</style>
