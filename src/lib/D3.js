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
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill', 'url(#grid-pattern)');

  svg.call(zoom().on('zoom', (event) => {
    container.attr('transform', event.transform);
  }));

  const defs = svg.append('defs');
  const pattern = defs.append('pattern')
    .attr('id', 'grid-pattern')
    .attr('width', 20)
    .attr('height', 20)
    .attr('patternUnits', 'userSpaceOnUse');
  
  pattern.append('rect')
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', 'black');

  pattern.append('path')
    .attr('d', 'M 20 0 L 0 0 0 20')
    .attr('fill', 'none')
    .attr('stroke', 'rgba(255, 255, 255, 0.1)')
    .attr('stroke-width', '1');

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
    .attr('font-weight', 'normal') // Adjusted font weight
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
    return type === 'owner' ? 42 : type === 'category' ? 36 : 18;
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
