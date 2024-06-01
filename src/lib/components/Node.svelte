<!-- src/components/Node.svelte -->
<script>
  export let text;
  export let type;
  export let x;
  export let y;
  export let thump;

  // additional props and logic if necessary
</script>

<g transform="translate({x}, {y})">
  <rect width={getNodeWidth()} height={getNodeHeight()} x={-getNodeWidth() / 2} y={-getNodeHeight() / 2} fill="white" />
  <text x="0" y="0" text-anchor="middle" alignment-baseline="middle" fill="black">
    {text}
  </text>
  {#if thump}
    <image href={thump} x={-25} y={-35} width="50" height="50" />
  {/if}
</g>
