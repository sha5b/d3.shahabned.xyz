<script>
    import { onMount } from 'svelte';
  </script>
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;700&display=swap');
  
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      width: 100%;
      height: 100%;
      background: black;
    }
  
    .background {
      background: black;
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  </style>
  
  <main>
    <div class="background"></div>
    <slot></slot>
  </main>
  