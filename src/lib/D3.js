import { select, forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, zoom, polygonHull, line, curveBasisClosed } from 'd3';
import { getImageURL } from '$lib/utils/getURL';

export function initializeGraph(svgElement, nodes, links) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const gridSize = 100;
  const padding = 40;
  const hullPadding = 50; // Additional padding for hulls

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
    .force('link', forceLink(links).id(d => d.id).distance(d => {
      if (d.source.type === 'owner' || d.target.type === 'owner') {
        return 500;  // Increase distance to prevent overlap
      } else if (d.source.type === 'category' || d.target.type === 'category') {
        return 200;  // Closer but not overlapping
      }
      return 150;  // Default distance
    }))
    .force('charge', forceManyBody().strength(d => d.type === 'owner' ? -1500 : -300))
    .force('center', forceCenter(width / 2, height / 2))
    .force('collide', forceCollide().radius(d => {
      const { width, height } = getNodeDimensions(d);
      const baseRadius = Math.max(width, height) / 2;
      return d.type === 'owner' ? baseRadius + 200 : d.type === 'category' ? baseRadius + 80 : baseRadius + 50;  // Adjust collision radius
    }).iterations(3))
    .on('tick', ticked);

  const hullGroup = container.append('g')
    .attr('class', 'hulls');

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
    .attr('width', d => getNodeDimensions(d).width)
    .attr('height', d => getNodeDimensions(d).height)
    .attr('x', d => -getNodeDimensions(d).width / 2)
    .attr('y', d => -getNodeDimensions(d).height / 2)
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

  node.filter(d => d.type === 'work' && d.thump)
    .append('image')
    .attr('xlink:href', d => getImageURL('works', d.id, d.thump, '50x50'))
    .attr('x', -25)
    .attr('y', -35)
    .attr('width', 50)
    .attr('height', 50)
    .attr('loading', 'lazy');  // Lazy loading attribute

  function ticked() {
    nodes.forEach(d => {
      d.x = Math.round(d.x / gridSize) * gridSize;
      d.y = Math.round(d.y / gridSize) * gridSize;
    });

    // Update link paths
    link.attr('d', d => {
      const sourceX = d.source.x;
      const sourceY = d.source.y;
      const targetX = d.target.x;
      const targetY = d.target.y;

      let midX, midY;

      if (Math.abs(targetX - sourceX) > Math.abs(targetY - sourceY)) {
        midX = sourceX + (targetX - sourceX) / 2;
        midY = sourceY;
      } else {
        midX = sourceX;
        midY = sourceY + (targetY - sourceY) / 2;
      }

      return `M${sourceX},${sourceY} L${midX},${midY} L${targetX},${targetY}`;
    });

    // Update node positions
    node.attr('transform', d => `translate(${d.x},${d.y})`);

    // Draw convex hulls around categories
    const categories = Array.from(new Set(nodes.filter(d => d.type === 'category').map(d => d.id)));
    const hulls = categories.map(category => {
      const points = nodes.filter(d => d.category === category || d.id === category)
        .flatMap(d => {
          const { width, height } = getNodeDimensions(d);
          return [
            [d.x - width / 2 - padding - hullPadding, d.y - height / 2 - padding - hullPadding],
            [d.x + width / 2 + padding + hullPadding, d.y - height / 2 - padding - hullPadding],
            [d.x + width / 2 + padding + hullPadding, d.y + height / 2 + padding + hullPadding],
            [d.x - width / 2 - padding - hullPadding, d.y + height / 2 + padding + hullPadding],
          ];
        });

      if (points.length > 2) {
        const hull = polygonHull(points);
        return { category, path: hull };
      }
      return null;
    }).filter(d => d !== null);

    const hullPath = line().curve(curveBasisClosed);

    const hullSelection = hullGroup.selectAll('path')
      .data(hulls, d => d.category);

    hullSelection.enter()
      .append('path')
      .attr('fill', 'rgba(255, 255, 255, 0)')
      .attr('stroke', 'white')
      .attr('stroke-dasharray', '5,5')
      .attr('stroke-width', 2)
      .merge(hullSelection)
      .attr('d', d => hullPath(d.path));

    hullSelection.exit().remove();
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

  function getNodeDimensions(node) {
    const textWidth = getTextWidth(node.text, getFontSize(node.type));
    const imageSize = node.type === 'work' && node.thump ? 50 : 0;
    const width = textWidth + 20 + imageSize;
    const height = getFontSize(node.type) + 10 + (node.type === 'work' && node.thump ? 50 : 0);
    return { width, height };
  }
}
