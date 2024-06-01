<script>
	export let link;
</script>

<line
	class={link.source.type === 'owner' ? 'owner-category' : 'category-work'}
	x1={link.source.x}
	y1={link.source.y}
	x2={link.target.x}
	y2={link.target.y}
/>

<style>
	line {
		stroke: #999;
		stroke-opacity: 0.6;
	}

	line.owner-category {
		stroke-width: 4;
	}

	line.category-work {
		stroke-width: 2;
	}
</style>
