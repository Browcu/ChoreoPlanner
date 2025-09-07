// scripts/render.js
import { ensureSvgSize, lerp, sanitizePoint } from './helpers.js';
import { state } from './state.js'; 

export function render(){
  const svg = document.getElementById('stageSvg');
  const danceNameEl = document.getElementById('danceName');
  const selIndex = document.getElementById('selIndex');
  const selName = document.getElementById('selName');
  const selLead = document.getElementById('selLead');
  const selFollow = document.getElementById('selFollow');
  const selBoth = document.getElementById('selBoth');
  const selLink = document.getElementById('selLink');
  const selColor = document.getElementById('selColor');
  const bendRange = document.getElementById('bendRange');
  const bendPosRange = document.getElementById('bendPosRange');

  ensureSvgSize(svg);
  while(svg.firstChild) svg.removeChild(svg.firstChild);

  // Grid
  const g = document.createElementNS('http://www.w3.org/2000/svg','g'); g.setAttribute('class','grid');
  for(let x=0; x<svg.clientWidth; x+=50){ const l = document.createElementNS('http://www.w3.org/2000/svg','line'); l.setAttribute('x1',x); l.setAttribute('y1',0); l.setAttribute('x2',x); l.setAttribute('y2',svg.clientHeight); g.appendChild(l);}
  for(let y=0; y<svg.clientHeight; y+=50){ const l = document.createElementNS('http://www.w3.org/2000/svg','line'); l.setAttribute('x1',0); l.setAttribute('y1',y); l.setAttribute('x2',svg.clientWidth); l.setAttribute('y2',y); g.appendChild(l);}
  svg.appendChild(g);

  // ====== DANCE FLOOR (2:1) i środkowa linia (środkowa 1/3 szerokości) ======
  (function drawFloor() {
    const padding = 20;
    const availableW = svg.clientWidth - padding * 2;
    const availableH = svg.clientHeight - padding * 2;

    let floorW = availableW;
    let floorH = Math.round(floorW / 2);
    if (floorH > availableH) {
      floorH = availableH;
      floorW = Math.round(floorH * 2);
    }

    const floorX = Math.round((svg.clientWidth - floorW) / 2);
    const floorY = Math.round((svg.clientHeight - floorH) / 2);

    const floorRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    floorRect.setAttribute('x', floorX);
    floorRect.setAttribute('y', floorY);
    floorRect.setAttribute('width', floorW);
    floorRect.setAttribute('height', floorH);
    floorRect.setAttribute('class', 'dance-floor');
    svg.appendChild(floorRect);

    const centerX = floorX + Math.round(floorW / 2);
    const centerY = floorY + Math.round(floorH / 2);

    // LEWY ODCINEK
    const leftLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    leftLine.setAttribute("x1", centerX - Math.round(floorW / 3.5));
    leftLine.setAttribute("y1", centerY);
    leftLine.setAttribute("x2", centerX);
    leftLine.setAttribute("y2", centerY);
    leftLine.setAttribute("stroke", "#38bdf8");
    leftLine.setAttribute("stroke-width", "2");
    leftLine.setAttribute("stroke-dasharray", "6,4");
    svg.appendChild(leftLine);

    // PRAWY ODCINEK
    const rightLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    rightLine.setAttribute("x1", centerX);
    rightLine.setAttribute("y1", centerY);
    rightLine.setAttribute("x2", centerX + Math.round(floorW / 3.5));
    rightLine.setAttribute("y2", centerY);
    rightLine.setAttribute("stroke", "#38bdf8");
    rightLine.setAttribute("stroke-width", "2");
    rightLine.setAttribute("stroke-dasharray", "6,4");
    svg.appendChild(rightLine);
  })();

  // Paths
  for(let i=0; i<state.points.length; i++){
    const p1=state.points[i]; const p2=state.points[(i+1)%state.points.length];
    if(i===state.points.length-1 && !state.closed) break;

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg','path');
    const bend=p1.bend||0; const bendPos=p1.bendPos||50;
    const dx=p2.x-p1.x, dy=p2.y-p1.y;
    const cx=lerp(p1.x,p2.x,bendPos/100)-dy/200*bend;
    const cy=lerp(p1.y,p2.y,bendPos/100)+dx/200*bend;
    pathEl.setAttribute('d',`M${p1.x},${p1.y} Q${cx},${cy} ${p2.x},${p2.y}`);
    pathEl.setAttribute('class','path');
    pathEl.addEventListener('click', e=>{
      if(!(state.edit && state.addPointsEnabled)) return;
      const rect=svg.getBoundingClientRect();
      const x=e.clientX-rect.left, y=e.clientY-rect.top;
      state.points.splice(i+1,0,sanitizePoint({x,y}));
      state.selected=i+1; render(); e.stopPropagation();
    });
    svg.appendChild(pathEl);

    if(state.selected===i){
      const h=document.createElementNS('http://www.w3.org/2000/svg','circle');
      h.setAttribute('cx',cx); h.setAttribute('cy',cy); h.setAttribute('r',6); h.setAttribute('class','helper-dot');
      svg.appendChild(h);
    }
  }

 // Points
state.points.forEach((pt,i)=>{
  const nodeTag=(i===0)?'polygon':'circle';
  const c=document.createElementNS('http://www.w3.org/2000/svg',nodeTag);
  if(i===0){
    const size=14; 
    const points=`${pt.x},${pt.y-size/2} ${pt.x-size/2},${pt.y+size/2} ${pt.x+size/2},${pt.y+size/2}`;
    c.setAttribute('points',points); 
    c.setAttribute('class','first-dot'+(state.selected===i?' sel':''));
  } else { 
    c.setAttribute('cx',pt.x); 
    c.setAttribute('cy',pt.y); 
    c.setAttribute('r',10); 
    c.setAttribute('class','dot'+(state.selected===i?' sel':'')); 
  }
  c.dataset.index=i; 
  c.style.fill=pt.color; 
  svg.appendChild(c);

  // Tooltip – pokazuje tylko przy hover
  const tooltip = document.getElementById('tooltip');
  c.addEventListener('pointerover', e=>{
    if(!tooltip) return;
    tooltip.textContent = pt.name || `(punkt ${i+1})`;
    tooltip.style.display='block';
    tooltip.style.left = (e.pageX + 10) + 'px';
    tooltip.style.top = (e.pageY + 10) + 'px';
  });
  c.addEventListener('pointermove', e=>{
    if(!tooltip) return;
    tooltip.style.left = (e.pageX + 10) + 'px';
    tooltip.style.top = (e.pageY + 10) + 'px';
  });
  c.addEventListener('pointerout', ()=>{
    if(!tooltip) return;
    tooltip.style.display='none';
  });
});

  


  // Panel detali
  if(state.selected>=0){
    const p=state.points[state.selected];
    selIndex.value=state.selected+1; selName.value=p.name||''; selLead.value=p.lead||''; selFollow.value=p.follow||''; selBoth.value=p.both||''; selLink.value=p.videoLink||''; selColor.value=p.color; bendRange.value=p.bend||0; bendPosRange.value=p.bendPos||50;
  }else{
    selIndex.value=selName.value=selLead.value=selFollow.value=selBoth.value=selLink.value=''; selColor.value='#7dd3fc'; bendRange.value=0; bendPosRange.value=50;
  }
  danceNameEl.textContent=state.name||'(bez nazwy)';
}