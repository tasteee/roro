<script lang="ts">
  import SheFlex from './SheFlex.svelte'
  import classcat from 'classcat'

  type PropsT = {
    children: () => any
    style?: string
    class?: string
    // activeColor?: string
    // inactiveColor?: string
  }

  const props: PropsT = $props()
  let classes = $derived(classcat([props.class]))
</script>

<SheFlex class="SheButtonGroup noselect {classes}" style={props.style}>
  {@render props.children()}
</SheFlex>

<style lang="postcss">
  :global {
    .SheButtonGroup {
      overflow: hidden;
      border-radius: 5px;
      box-shadow: var(--shadowBorder15);
      /* background: var(--gray35); */

      .SheButton {
        margin: 0;
        border-radius: 0;
        padding: 0px 16px;
        /* box-shadow: var(--shadowBorder15); */
        box-shadow: none;
        transition: all 0s ease;

        &:first-of-type {
          border-radius: 5px 0 0 5px;
        }

        &:last-of-type {
          border-radius: 0 5px 5px 0;
        }
      }
    }
  }
</style>
