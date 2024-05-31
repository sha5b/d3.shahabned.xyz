// src/lib/d3.js
import { select, forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, drag, zoom } from 'd3';

export function initializeGraph(svgElement, nodes, links) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const svg = select(svgElement)
    .attr('width', width)
    .attr('height', height);

  const container = svg.append('g'); // Container for grid and nodes

  const grid = container.append('rect')
    .attr('class', 'grid')
    .attr('x', -width * 5) // Start far to the left
    .attr('y', -height * 5) // Start far above
    .attr('width', width * 10) // Extend far to the right
    .attr('height', height * 10) // Extend far below
    .attr('fill', 'url(#grid-pattern)');

  svg.call(zoom().on('zoom', (event) => {
    container.attr('transform', event.transform);
  }));

  const defs = svg.append('defs');
  const pattern = defs.append('pattern')
    .attr('id', 'grid-pattern')
    .attr('width', 40) // Adjust dot spacing
    .attr('height', 40)
    .attr('patternUnits', 'userSpaceOnUse');
  
  pattern.append('rect')
    .attr('width', 40)
    .attr('height', 40)
    .attr('fill', 'black');

  pattern.append('circle')
    .attr('cx', 20)
    .attr('cy', 20)
    .attr('r', 2) // Adjust dot size
    .attr('fill', 'rgba(255, 255, 255, 0.5)');

  const simulation = forceSimulation(nodes)
    .force('link', forceLink(links).id(d => d.id).distance(d => d.type === 'category' ? 200 : 100))
    .force('charge', forceManyBody().strength(-400))
    .force('center', forceCenter(width / 2, height / 2))
    .force('collide', forceCollide().radius(d => {
      const textWidth = getTextWidth(d.text, getFontSize(d.type));
      return Math.max(textWidth + 20, getFontSize(d.type) + 10) / 2 + 10; // Add some padding
    }).iterations(2));

  const link = container.append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('stroke-width', d => d.source.type === 'owner' ? 4 : 2);

  const node = container.append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('g')
    .data(nodes)
    .enter().append('g')
    .call(drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  node.append('rect')
    .attr('width', d => {
      const textWidth = getTextWidth(d.text, getFontSize(d.type));
      return textWidth + 20; // Add some padding
    })
    .attr('height', d => getFontSize(d.type) + 10) // Add some padding
    .attr('x', d => {
      const textWidth = getTextWidth(d.text, getFontSize(d.type));
      return -((textWidth + 20) / 2);
    })
    .attr('y', d => -(getFontSize(d.type) + 10) / 2)
    .attr('fill', 'white'); // Node fill color

  node.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('fill', 'black') // Text color
    .attr('font-family', 'Oxanium')
    .attr('font-size', d => getFontSize(d.type) + 'px')
    .attr('font-weight', d => d.type === 'owner' || d.type === 'category' ? 'bold' : 'normal') // Normal weight for work nodes
    .text(d => d.text);

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  function getFontSize(type) {
    return type === 'owner' ? 48 : type === 'category' ? 42 : 30; // Increased font sizes
  }

  function getTextWidth(text, fontSize) {
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = `${fontSize}px Oxanium`;
      return context.measureText(text).width;
    }
    return 0;
  }
}
