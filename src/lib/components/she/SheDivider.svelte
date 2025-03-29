<script lang="ts">
	import SheIcon from './SheIcon.svelte'
	import classcat from 'classcat'

	type PropsT = {
		label?: string
		labelPosition?: 'start' | 'center' | 'end'
		class?: string
		children?: any
		isOpen?: boolean
		nested?: boolean
		size?: 'small' | 'medium'
		onClick?: () => void
	}

	let props: PropsT = $props()
	let label = props.label ?? ''
	let isLabelStart = !props.labelPosition || props.labelPosition === 'start'
	let classes = classcat([props.class, props.nested && 'nested'])
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="SheDivider noselect {classes}" style:gap={8} data-label-position={props.labelPosition}>
	<!-- Before line -->
	{#if props.nested && isLabelStart}
		<!-- <span class="NestedDividerLine"></span> -->
		<SheIcon class="folderIcon" library="pixelarticons" size="small" color="var(--gray15)" icon="folder" />
	{/if}

	<!-- Label -->
	{#if label}
		<span class="SheDividerLabel" onclick={props.onClick}>{label}</span>
	{/if}

	<!-- After line -->
	<div class="DividerLine"></div>

	<!-- Chevron icon -->
	{#if props.onClick}
		<SheIcon
			class="toggleIcon"
			library="pixelarticons"
			size="small"
			color="var(--gray15)"
			icon={props.isOpen ? 'chevron-down' : 'chevron-up'}
			onClick={() => {
				console.log('CLICKED!')
				props.onClick()
			}}
		/>
	{/if}
</div>

<style lang="postcss">
	:global {
		.SheDivider {
			display: flex;
			align-items: center;
			width: 100%;
			gap: 12px;
			margin: 14px 0 12px;
		}

		.SheDivider.nested .SheDividerLabel {
			font-size: 12px;
		}

		.SheDivider.size-small {
			font-size: 12px;
		}

		.SheDivider.size-medium {
			font-size: 16px;
		}

		.SheDividerLabel {
			color: var(--gray5);
			font-size: 16px;
			white-space: nowrap;
		}

		.ShePanelInnerSection .SheDividerLabel {
			color: var(--gray15);
		}

		.DividerLine {
			flex: 1;
			height: 1px;
			background-color: var(--gray25);
		}

		.NestedDividerLine {
			display: inline-block;
			height: 1px;
			width: 12px;
			background-color: var(--gray25);
		}

		.SheDivider[data-label-position='start'] .SheDividerLabel {
			order: -1;
		}

		.SheDivider[data-label-position='center'] .SheDividerLabel {
			order: 0;
		}

		.SheDivider[data-label-position='end'] .SheDividerLabel {
			order: 1;
		}

		.toggleIcon {
			order: 2; /* Always on the right */
		}
	}
</style>
