// src/lib/d3.js
import { select, forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, zoom } from 'd3';

export function initializeGraph(svgElement, nodes, links) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const gridSize = 100;

  const svg = select(svgElement)
    .attr('width', width)
    .attr('height', height);

  const container = svg.append('g');

  const grid = container.append('rect')
    .attr('class', 'grid')
    .attr('x', -width * 5)
    .attr('y', -height * 5)
    .attr('width', width * 10)
    .attr('height', height * 10)
    .attr('fill', 'url(#grid-pattern)');

  svg.call(zoom().on('zoom', (event) => {
    container.attr('transform', event.transform);
  }));

  const defs = svg.append('defs');
  const pattern = defs.append('pattern')
    .attr('id', 'grid-pattern')
    .attr('width', gridSize)
    .attr('height', gridSize)
    .attr('patternUnits', 'userSpaceOnUse');
  
  pattern.append('rect')
    .attr('width', gridSize)
    .attr('height', gridSize)
    .attr('fill', 'black');

  pattern.append('circle')
    .attr('cx', gridSize / 2)
    .attr('cy', gridSize / 2)
    .attr('r', 2)
    .attr('fill', 'rgba(255, 255, 255, 0.5)');

  const simulation = forceSimulation(nodes)
    .force('link', forceLink(links).id(d => d.id).distance(d => d.source.type === 'owner' ? 300 : 150))
    .force('charge', forceManyBody().strength(-400))
    .force('center', forceCenter(width / 2, height / 2))
    .force('collide', forceCollide().radius(d => {
      const textWidth = getTextWidth(d.text, getFontSize(d.type));
      return Math.max(textWidth + 20, getFontSize(d.type) + 10) / 2 + 20;
    }).iterations(2))
    .on('tick', ticked);

  const link = container.append('g')
    .attr('stroke-opacity', 0.6)
    .selectAll('path')
    .data(links)
    .enter().append('path')
    .attr('stroke', '#999')
    .attr('stroke-width', d => d.source.type === 'owner' ? 4 : 2)
    .attr('stroke-dasharray', d => d.source.type === 'category' ? '5,5' : 'none')
    .attr('fill', 'none');

  const node = container.append('g')
    .attr('stroke', 'none')
    .attr('stroke-width', 0)
    .selectAll('g')
    .data(nodes)
    .enter().append('g');

  node.append('rect')
    .attr('width', d => {
      const textWidth = getTextWidth(d.text, getFontSize(d.type));
      return textWidth + 20;
    })
    .attr('height', d => getFontSize(d.type) + 10)
    .attr('x', d => {
      const textWidth = getTextWidth(d.text, getFontSize(d.type));
      return -((textWidth + 20) / 2);
    })
    .attr('y', d => -(getFontSize(d.type) + 10) / 2)
    .attr('fill', 'white');

  node.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('fill', 'black')
    .attr('font-family', 'Oxanium')
    .attr('font-size', d => getFontSize(d.type) + 'px')
    .attr('font-weight', d => d.type === 'owner' || d.type === 'category' ? 'bold' : 'normal')
    .text(d => d.text);

  function ticked() {
    nodes.forEach(d => {
      d.x = Math.round(d.x / gridSize) * gridSize;
      d.y = Math.round(d.y / gridSize) * gridSize;
    });

    link.attr('d', d => {
      const sourceX = d.source.x;
      const sourceY = d.source.y;
      const targetX = d.target.x;
      const targetY = d.target.y;
      const midX = (sourceX + targetX) / 2;
      return `M${sourceX},${sourceY} L${midX},${sourceY} L${midX},${targetY} L${targetX},${targetY}`;
    });

    node.attr('transform', d => `translate(${d.x},${d.y})`);
  }

  function getFontSize(type) {
    return type === 'owner' ? 48 : type === 'category' ? 42 : 36;
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
