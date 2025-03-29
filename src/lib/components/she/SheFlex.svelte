<script lang="ts">
	import classcat from 'classcat'

	type PropsT = {
		gap?: number | string
		children: any
		style?: string
		isColumn?: boolean
		class?: string
		id?: string
		reverse?: boolean
		wrap?: boolean
		padding?: number | string
		alignX?: 'start' | 'center' | 'between' | 'around' | 'end'
		alignY?: 'start' | 'center' | 'between' | 'around' | 'end'
		'data-testid'?: string
		onClick?: () => void
		style?: string
	}

	let props: PropsT = $props()

	const classes = classcat([
		props.class,
		props.wrap && 'wrap',
		props.reverse && 'reverse',
		props.isColumn && 'column',
		!props.isColumn && 'row',
		props.alignY && `alignY-${props.alignY}`,
		props.alignX && `alignX-${props.alignX}`,
		props.isColumn && props.alignY && `alignX-${props.alignY}`,
		props.isColumn && props.alignX && `alignY-${props.alignX}`
	])

	let padding = props.padding ? `padding: ${props.padding};` : ''
	let gap = props.gap ? `gap: ${props.gap};` : ''
	const style = `${gap}; ${padding}; ${props.style || ''}`
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="SheFlex {classes}" {style} onclick={props.onClick}>
	{@render props.children()}
</div>

<style lang="postcss">
	:global {
		.SheFlex {
			display: flex;

			&.wrap {
				flex-wrap: wrap;
			}

			&.row {
				flex-direction: row;

				&.reverse {
					flex-direction: row-reverse;
				}

				&.alignX-start {
					justify-content: flex-start;
				}

				&.alignX-center {
					justify-content: center;
				}

				&.alignX-end {
					justify-content: flex-end;
				}

				&.alignX-between {
					justify-content: space-between;
				}

				&.alignX-around {
					justify-content: space-around;
				}

				&.alignX-evenly {
					justify-content: space-evenly;
				}

				&.alignY-start {
					align-items: flex-start;
				}

				&.alignY-center {
					align-items: center;
				}

				&.alignY-end {
					align-items: flex-end;
				}

				&.alignY-between {
					align-items: space-between;
				}

				&.alignY-around {
					align-items: space-around;
				}

				&.alignY-evenly {
					align-items: space-evenly;
				}
			}

			&.column {
				flex-direction: column;

				&.reverse {
					flex-direction: column-reverse;
				}

				&.alignX-start {
					align-items: flex-start;
				}

				&.alignX-center {
					align-items: center;
				}

				&.alignX-end {
					align-items: flex-end;
				}

				&.alignX-between {
					align-items: space-between;
				}

				&.alignX-around {
					align-items: space-around;
				}

				&.alignX-evenly {
					align-items: space-evenly;
				}
			}
		}
	}
</style>
