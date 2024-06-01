<script>
	export let data;

	let nodes = [];
	let links = [];

	// Prepare nodes and links
	const ownerNode = {
		id: data.owner.id,
		text: data.owner.name,
		type: 'owner'
	};
	nodes.push(ownerNode);

	// Create category nodes
	data.categories.forEach((category) => {
		const categoryNode = {
			id: category.id,
			text: category.title,
			type: 'category'
		};
		nodes.push(categoryNode);

		// Create links from owner to categories
		links.push({
			source: ownerNode.id,
			target: categoryNode.id
		});
	});

	// Create work nodes and links to categories
	data.works.forEach((work) => {
		const workNode = {
			id: work.id,
			text: work.title,
			type: 'work',
			category: work.category,
			thump: work.thump
		};
		nodes.push(workNode);

		// Create links from works to categories
		links.push({
			source: work.category,
			target: work.id
		});
	});

	let svgElement;

	import { onMount } from 'svelte';
	import { initializeGraph } from '$lib/d3.js';

	onMount(() => {
		initializeGraph(svgElement, nodes, links);
	});
</script>

<svg bind:this={svgElement}></svg>
