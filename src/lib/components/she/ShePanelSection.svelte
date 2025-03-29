<script lang="ts">
	import SheDivider from './SheDivider.svelte'
	import classcat from 'classcat'

	type PropsT = {
		class?: string
		label: string
		children: any
		isOpen?: boolean
		onClick?: () => void
		noPadding?: boolean
		row?: boolean
		bottomText?: string
	}

	let props: PropsT = $props()
	let isOpen = $state(props.isOpen ?? true)
	let isOpenClass = $derived(isOpen ? 'opened' : 'closed')
	let dirClass = $derived(props.row ? 'row' : 'column')
	let classes = $derived(classcat([props.class, isOpenClass]))

	const onClick = () => {
		isOpen = !isOpen
		props.onClick()
	}
</script>

<div class="ShePanelSection {classes}">
	<SheDivider
		{isOpen}
		label={props.label}
		onClick={() => {
			console.log('CLICKEDDDDD!!!')
			console.log(props.isOpen, props.onClick)
			onClick()
		}}
	/>
	<div class="contentBox {dirClass} gap2">
		{@render props.children()}
	</div>
	{#if props.bottomText}
		<div class="bottomText">
			<small>{props.bottomText}</small>
		</div>
	{/if}
</div>

<style lang="postcss">
	:global {
		.toggleIcon {
			margin-top: 2px;
			cursor: pointer;
		}

		.ShePanelSection {
			display: flex;
			flex-direction: column;
			padding: 0px 16px;
			height: auto;
			margin-bottom: 8px;
			gap: var(--gap);
		}

		.ShePanelSection.closed {
			height: 32px;
			overflow: hidden;
			margin-bottom: 8px;
		}

		.ShePanelSection .contentBox {
			flex-direction: column;
			gap: 8px;
			padding-left: 4px;
			padding-right: 4px;

			&.row {
				flex-direction: row;
			}
		}

		.ShePanelSection .bottomText {
			margin-top: 8px;
			font-size: 14px;
			color: var(--gray10);
		}
	}
</style>
