<!-- src/components/Graph.svelte -->
<script>
  import { onMount } from 'svelte';
  import { initializeGraph } from '$lib/d3';

  let svgElement;
  let nodes = []; // define nodes based on your logic
  let links = []; // define links based on your logic

  onMount(() => {
    initializeGraph(svgElement, nodes, links);
  });
</script>

<svg bind:this={svgElement}></svg>
