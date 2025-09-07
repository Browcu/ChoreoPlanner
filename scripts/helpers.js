export function ensureSvgSize(svg) { 
  svg.style.height = Math.round(svg.clientWidth * 2 / 3) + 'px'; 
}

export function svgCoords(svg, x, y) { 
  const r = svg.getBoundingClientRect(); 
  return { x: x - r.left, y: y - r.top }; 
}

export function lerp(a, b, t) { 
  return a + (b - a) * t; 
}

export function sanitizePoint(p) {
  return {  
    x: p.x, 
    y: p.y, 
    name: p.name||'', 
    lead: p.lead||'', 
    follow: p.follow||'', 
    both: p.both||'', 
    link: p.link||'',
    bend: Number(p.bend||0), 
    bendPos: Number(p.bendPos ?? 50), 
    color: p.color||'#7dd3fc', 
    description: p.description||'' 
  };
}