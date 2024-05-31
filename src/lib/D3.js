// src/lib/d3.js
import { select, forceSimulation, forceLink, forceManyBody, forceCenter, drag } from 'd3';

export function initializeGraph(svgElement, nodes, links) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const svg = select(svgElement)
    .attr('width', width)
    .attr('height', height);

  const simulation = forceSimulation(nodes)
    .force('link', forceLink(links).id(d => d.id).distance(100))
    .force('charge', forceManyBody().strength(-400))
    .force('center', forceCenter(width / 2, height / 2));

  const link = svg.append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('stroke-width', 2);

  const node = svg.append('g')
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
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('x', d => -d.width / 2)
    .attr('y', d => -d.height / 2)
    .attr('fill', 'blue');

  node.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('fill', 'white')
    .attr('font-size', '14px')
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
}
