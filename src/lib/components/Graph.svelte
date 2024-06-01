<!-- src/lib/components/Graph.svelte -->
<script>
  import { onMount } from 'svelte';
  import { initializeGraph } from '$lib/d3';

  export let nodes = [];
  export let links = [];

  let svgElement;

  onMount(() => {
    initializeGraph(svgElement, nodes, links);
  });
</script>

<svg bind:this={svgElement}></svg>

<style>
  .node-content {
    display: inline-block;
    text-align: center;
  }

  .node-content img {
    display: block;
    margin: 0 auto;
  }

  .node-content span {
    display: block;
    margin-top: 5px;
  }
</style>
