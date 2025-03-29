<script lang="ts">
	import Icon from '@iconify/svelte'

	type PropsT = {
		class?: string
		library?: string
		icon: string
		size?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'
		color?: string
		onClick?: (event: MouseEvent) => void
	}

	const props: PropsT = $props()
	let library = $derived(props.library || 'pixelarticons')
</script>

<Icon
	icon="{library}:{props.icon}"
	class="SheIcon {props.class}"
	data-size={props.size || 'medium'}
	color={props.color}
	onclick={props.onClick}
/>

<style>
	:global {
		.SheIcon {
			color: var(--gray10);
		}

		.SheIcon:hover {
			color: var(--gray0);
		}

		.SheIcon[data-size='xxsmall'] {
			width: 12px;
			height: 12px;
		}

		.SheIcon[data-size='xsmall'] {
			width: 16px;
			height: 16px;
		}

		.SheIcon[data-size='small'] {
			width: 20px;
			height: 20px;
		}

		.SheIcon[data-size='medium'] {
			width: 24px;
			height: 24px;
		}

		.SheIcon[data-size='large'] {
			width: 32px;
			height: 32px;
		}

		.SheIcon[data-size='xlarge'] {
			width: 40px;
			height: 40px;
		}
	}
</style>
