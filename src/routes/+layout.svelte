<script>
	import { onMount } from 'svelte';
</script>

<main>
	<slot></slot>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;700&display=swap');

	html,
	body {
		margin: 0;
		padding: 0;
		overflow: hidden;
		width: 100%;
		height: 100%;
		background: black;
	}

	main {
		position: fixed;
		width: 100%;
		height: 100%;
		z-index: -1;
		background: black;
	}
</style>
