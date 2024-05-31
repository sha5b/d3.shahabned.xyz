<!-- src/components/Node.svelte -->
<script>
	export let node;
</script>

<rect width="50" height="50" fill="white" x={-10} y={-10}>
	<title>{node.name}</title>
</rect>
