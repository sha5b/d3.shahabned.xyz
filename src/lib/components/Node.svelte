<!-- src/components/Node.svelte -->
<script>
	export let node;
</script>

<rect width="20" height="20" fill="blue" x={-10} y={-10}>
	<title>{node.name}</title>
</rect>
