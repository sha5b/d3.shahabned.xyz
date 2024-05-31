<script context="module">
    export { load } from './+page.js';
  </script>
  
  <script>
    import Graph from '$lib/components/Graph.svelte';
  
    export let data;
  
    // Create the owner node
    let nodes = [
      { id: 'owner', text: data.owner?.name || 'Owner', width: (data.owner?.name?.length || 5) * 8, height: 30 }
    ];
  
    let links = [];
  
    if (Array.isArray(data.categories)) {
      data.categories.forEach(category => {
        // Create a node for each category
        nodes.push({
          id: category.id,
          text: category.title,
          width: category.title.length * 8,
          height: 30
        });
        // Link the category to the owner
        links.push({ source: 'owner', target: category.id });
  
        // Filter works belonging to the current category
        const categoryWorks = data.works.filter(work => work.category === category.id);
        
        categoryWorks.forEach(work => {
          // Create a node for each work
          nodes.push({
            id: work.id,
            text: work.title,
            width: work.title.length * 8,
            height: 30
          });
          // Link the work to the category
          links.push({ source: category.id, target: work.id });
        });
      });
    }
  </script>
  
  <Graph {nodes} {links} />
  