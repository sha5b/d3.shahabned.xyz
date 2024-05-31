<script context="module">
	export { load } from './+page.js';
</script>

<script>
	import Graph from '$lib/components/Graph.svelte';

	export let data;

	let nodes = [{ id: 'owner', name: data.owner?.name || 'Owner' }];

	let links = [];

	if (Array.isArray(data.categories)) {
		data.categories.forEach((category) => {
			nodes.push({ id: category.id, name: category.name });
			links.push({ source: 'owner', target: category.id });

			if (Array.isArray(category.expand?.works)) {
				category.expand.works.forEach((work) => {
					nodes.push({ id: work.id, name: work.title });
					links.push({ source: category.id, target: work.id });
				});
			}
		});
	}
</script>

<Graph {nodes} {links} />
