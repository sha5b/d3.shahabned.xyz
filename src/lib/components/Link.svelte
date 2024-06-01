<!-- src/components/Link.svelte -->
<script>
  export let source;
  export let target;
  export let stroke;
  export let strokeWidth;
  export let strokeDasharray;

  // additional props and logic if necessary
</script>

<path 
  {source} 
  {target} 
  {stroke} 
  {strokeWidth} 
  {strokeDasharray} 
  fill="none" 
/>
