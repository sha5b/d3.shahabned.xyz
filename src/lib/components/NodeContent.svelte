<!-- src/lib/components/NodeContent.svelte -->
<script>
    export let text;
    export let imageUrl;
  </script>
  
  <div class="node-content">
    <img src={imageUrl} alt="Thumbnail" width="50" height="50">
    <span>{text}</span>
  </div>
  
  <style>
    .node-content {
      display: inline-block;
      text-align: center;
    }
  
    .node-content img {
      display: block;
      margin: 0 auto;
    }
  
    .node-content span {
      display: block;
      margin-top: 5px;
    }
  </style>
  