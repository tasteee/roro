<script lang="ts">
	import SheInput from './SheInput.svelte'
	import classcat from 'classcat'

	type PropsT = {
		id?: string
		class?: string
		label?: string
		value?: string
		options: { label: string; value: string }[]
		onOpen?: () => void
		onClose?: () => void
		onChange: (value: string) => void
	}

	let props: PropsT = $props()
	let isOpen = $state(false)

	function handleOptionSelect(event: Event) {
		props.onChange((event.target as HTMLSelectElement).value)
		isOpen = false
		props.onClose?.()
	}

	function toggleDropdown() {
		isOpen = !isOpen
		if (isOpen) props.onOpen?.()
		else props.onClose?.()
	}

	const classes = $derived(classcat([props.class, isOpen && 'open']))
</script>

<label class="SheSelect {classes}">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<span class="SheSelectLabel" onclick={toggleDropdown}>
		{props.label}
	</span>

	<select class="SheSelectInput" value={props.value} onchange={handleOptionSelect}>
		{#each props.options as option}
			<option class="SheSelectOption" value={option.value}>
				{option.label}
			</option>
		{/each}
	</select>
</label>

<style lang="postcss">
	.SheSelect {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 30px;
		padding: 1px 8px;
		border-radius: 5px;
		background-color: transparent;
		box-shadow: var(--shadowBorder25);
		color: var(--gray0);
		font-size: 14px;
		transition: all 0.1s ease-in-out;
		width: 100%;
		overflow-x: clip;

		.SheSelectLabel {
			color: var(--gray12);
			user-select: none;
		}
	}

	.SheSelectInput {
		background: transparent;
		color: var(--gray12);
		z-index: 10;
		height: 100%;
		padding: 0px 0px 1px;
		width: 100%;
	}

	.SheSelectOption {
		padding: 8px 12px;
		cursor: pointer;
		color: var(--gray12);
		background: var(--gray35);
	}

	.SheSelectInput > *:hover {
		background-color: var(--gray20);
	}
</style>
