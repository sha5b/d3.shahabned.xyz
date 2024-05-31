<script context="module">
	export { load } from './+page.js';
</script>

<script>
	import Graph from '$lib/components/Graph.svelte';

	export let data;

	// Create the owner node
	let nodes = [{ id: 'owner', text: data.owner?.name || 'Owner', type: 'owner' }];

	let links = [];

	if (Array.isArray(data.categories)) {
		data.categories.forEach((category) => {
			// Create a node for each category
			nodes.push({
				id: category.id,
				text: category.title,
				type: 'category'
			});
			// Link the category to the owner
			links.push({ source: 'owner', target: category.id, type: 'owner-category' });

			// Filter works belonging to the current category
			const categoryWorks = data.works.filter((work) => work.category === category.id);

			categoryWorks.forEach((work) => {
				// Create a node for each work
				nodes.push({
					id: work.id,
					text: work.title,
					type: 'work'
				});
				// Link the work to the category
				links.push({ source: category.id, target: work.id, type: 'category-work' });
			});
		});
	}
</script>

<Graph {nodes} {links} />
