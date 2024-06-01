<script>
  export let node;
  import { getImageURL } from '$lib/utils/getURL';
</script>

<style>
  .node-container {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    border-radius: 5px;
    padding: 10px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
</style>

<div class="node-container">
  {#if node.thump}
    <img src={getImageURL('works', node.id, node.thump, '50x50')} alt={node.text} width="50" height="50">
  {/if}
  <div>
    <h3>{node.text}</h3>
    <h2>hi</h2>
  </div>
</div>
