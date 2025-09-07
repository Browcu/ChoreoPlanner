// scripts/events.js
import { state, recentFigures, currentTab, figures, stateTabs, addToRecent } from './state.js';

import { customFigures } from './main.js';
import { svgCoords, sanitizePoint } from './helpers.js';
import { render } from './render.js';
import { updateFigureList, updateLibraryList } from './ui-updates.js';
import { loadCustomFigures, saveFigureToCustom, loadLibrary, saveCurrentLibrary } from './firebase-api.js';

export function setupEventListeners() {
  // ===== ELEMENTY DOM =====
  const svg = document.getElementById('stageSvg');
  const descModal = document.getElementById('descModal');
  const closeDescBtn = document.getElementById('closeDescBtn');
  const selIndex = document.getElementById('selIndex');
  const selName = document.getElementById('selName');
  const selLead = document.getElementById('selLead');
  const selFollow = document.getElementById('selFollow');
  const selBoth = document.getElementById('selBoth');
  const selDesc = document.getElementById('selDesc');
  const selLink = document.getElementById('selLink');
  const selLinkRead = document.getElementById('selLinkRead');
  const selColor = document.getElementById('selColor');
  const bendRange = document.getElementById('bendRange');
  const bendPosRange = document.getElementById('bendPosRange');
  const resetBendBtn = document.getElementById('resetBendBtn');
  const resetBendPosBtn = document.getElementById('resetBendPosBtn');
  const updatePointBtn = document.getElementById('updatePointBtn');
  const newFigModeCheckbox = document.getElementById('newFigMode');
  const editModeCheckbox = document.getElementById('editMode');

  // TOOLBAR
  const newBtn = document.getElementById('newBtn');
  const saveBtn = document.getElementById('saveBtn');
  const openBtn = document.getElementById('openBtn');
  const editBtn = document.getElementById('editBtn');
  const clearBtn = document.getElementById('clearBtn');
  const closeBtn = document.getElementById('closeBtn');
  const toggleAddBtn = document.getElementById('toggleAddBtn');
  const toggleDragBtn = document.getElementById('toggleDragBtn');
  const toggleSnapBtn = document.getElementById('toggleSnapBtn');
  const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
  const figureListEl = document.getElementById('figureList');
  const libraryModal = document.getElementById('libraryModal');
  const libraryList = document.getElementById('libraryList');
  const libraryEmpty = document.getElementById('libraryEmpty');
  const closeLibBtn = document.getElementById('closeLibBtn');
  const saveCurrentBtn = document.getElementById('saveCurrentBtn');
  const copyShareBtn = document.getElementById('copyShareBtn');
  const searchFigureEl = document.getElementById('searchFigure');
  const sortFigureBtn = document.getElementById('sortFigureBtn');

  // ===== PANEL FIGURE EDIT =====
  function setFigureEditMode(isEdit) {
  state.figureEdit = isEdit;
  editModeCheckbox.checked = isEdit;

  const inputs = [selName, selLead, selFollow, selBoth, selDesc, selColor];
  inputs.forEach(el => {
    el.readOnly = !isEdit;
    el.disabled = !isEdit;
    el.style.background = isEdit ? '#fff' : '#2a2a3a';
    el.style.color = isEdit ? '#000' : '#bbb';
    el.style.border = isEdit ? '1px solid rgba(0,0,0,0.2)' : '1px solid #555';
  });

  bendRange.parentElement.style.display = isEdit ? 'flex' : 'none';
  bendPosRange.parentElement.style.display = isEdit ? 'flex' : 'none';

  const bendLabel = bendRange.parentElement.previousElementSibling;
  const bendPosLabel = bendPosRange.parentElement.previousElementSibling;
  if (bendLabel) bendLabel.style.display = isEdit ? 'block' : 'none';
  if (bendPosLabel) bendPosLabel.style.display = isEdit ? 'block' : 'none';

  if (isEdit) {
    selLink.style.display = 'block';
    selLinkRead.style.display = 'none';
  } else {
    selLink.style.display = 'none';
    selLinkRead.style.display = 'inline-block';
    selLinkRead.href = selLink.value.trim() || '#';
    selLinkRead.textContent = selLink.value.trim() || 'Brak linku';
  }
}


  // ===== INICJALIZACJA =====
 // inicjalizacja stanu po załadowaniu strony
window.addEventListener('DOMContentLoaded', () => {
  setFigureEditMode(false); // start OFF
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === stateTabs.current);
  });
  updateFigureList(); // teraz pokaże tylko ostatnie figury
});

editModeCheckbox.addEventListener('change', () => {
  setFigureEditMode(editModeCheckbox.checked);
});
setFigureEditMode(false);
  // ===== SVG EVENTS =====
  svg.addEventListener('pointerdown', e => {
    if (!state.svgEdit) return;
    const t = e.target.tagName;
    if (t === 'circle' || t === 'polygon') {
      const idx = parseInt(e.target.dataset.index, 10);
      state.selected = idx;
      render();
      if (state.drag) state.dragging = idx;
    } else if (t === 'svg' && state.addPoints) {
      const p = svgCoords(svg, e.clientX, e.clientY);
      addPointAt(p.x, p.y);
    }
  });

  svg.addEventListener('pointermove', e => {
    if (state.dragging == null || !state.svgEdit || !state.drag) return;
    const p = svgCoords(svg, e.clientX, e.clientY);
    const pt = state.points[state.dragging];
    pt.x = p.x;
    pt.y = p.y;
    render();
  });

  svg.addEventListener('pointerup', () => { state.dragging = null; });

  // ===== PANEL INPUT HANDLERS =====
  [selName, selLead, selFollow, selBoth, selDesc, selLink].forEach(el => {
    el.addEventListener('input', () => {
      if (!state.figureEdit) return;
      if (state.selected >= 0) {
        const p = state.points[state.selected];
        p.name = selName.value;
        p.lead = selLead.value;
        p.follow = selFollow.value;
        p.both = selBoth.value;
        p.description = selDesc.value;
        p.link = selLink.value;
        p.color = selColor.value;
        render();
      }
      selLinkRead.href = selLink.value.trim() || '#';
      selLinkRead.textContent = selLink.value.trim() || 'Brak linku';
    });
  });

  selColor.addEventListener('input', () => { if (state.selected >= 0 && state.figureEdit) { state.points[state.selected].color = selColor.value; render(); } });
  bendRange.addEventListener('input', () => { if (state.selected >= 0 && state.figureEdit) { state.points[state.selected].bend = Number(bendRange.value); render(); } });
  bendPosRange.addEventListener('input', () => { if (state.selected >= 0 && state.figureEdit) { state.points[state.selected].bendPos = Number(bendPosRange.value); render(); } });

  resetBendBtn.addEventListener('click', () => { if (state.selected >= 0 && state.figureEdit) { state.points[state.selected].bend = 0; bendRange.value = 0; render(); } });
  resetBendPosBtn.addEventListener('click', () => { if (state.selected >= 0 && state.figureEdit) { state.points[state.selected].bendPos = 50; bendPosRange.value = 50; render(); } });

  // ===== FIGURE SAVE =====
  updatePointBtn.onclick = async () => {
    const isNewFig = newFigModeCheckbox.checked;
    if (!state.figureEdit) { alert("Jesteś w trybie odczytu – zmiany nie zostaną zapisane."); return; }

    const data = {
      name: selName.value,
      color: selColor.value,
      description: selDesc.value,
      lead: selLead.value,
      follow: selFollow.value,
      both: selBoth.value,
      link: selLink.value
    };

    if (isNewFig) {
      const existingIdx = customFigures.findIndex(f => f.name === data.name);
      if (existingIdx >= 0) customFigures[existingIdx] = data;
      else customFigures.unshift(data);
      await saveFigureToCustom(data);
    } else {
      if (state.selected < 0) { alert("Wybierz punkt na SVG, żeby go edytować!"); return; }
      Object.assign(state.points[state.selected], data);
    }
addToRecent(data.name);
    render();
    updateFigureList();
    
  };

  // ===== TOOLBAR =====
  closeDescBtn.onclick = () => { descModal.style.display = 'none'; };

  newBtn.onclick = () => {
    state.name = 'Nowy układ';
    state.points = [];
    state.closed = false;
    state.selected = -1;
    state.svgEdit = true;
    state.addPoints = true;
    state.drag = true;
    state.dragging = null;

    editBtn.classList.add('toggled');
    toggleAddBtn.textContent = 'Dodawanie punktów: ON';
    toggleDragBtn.classList.add('toggled');
    toggleDragBtn.textContent = 'Przesuwanie punktów: ON';

    render();
    setFigureEditMode(false);
  };

  clearBtn.onclick = () => { 
    if(confirm('Wyczyścić bieżący układ?')){
      state.points = [];
      state.selected = -1;
      render(); 
    } 
  };

  closeBtn.onclick = () => { 
    state.closed = !state.closed; 
    closeBtn.textContent = state.closed ? 'Otwórz ścieżkę' : 'Zamknij ścieżkę'; 
    render(); 
  };

  editBtn.onclick = () => { 
    state.svgEdit = !state.svgEdit; 
    editBtn.classList.toggle('toggled', state.svgEdit); 
    if (state.svgEdit) {
    // przy włączeniu trybu edycji SVG włączamy dodawanie i przesuwanie
    state.addPoints = true;
    state.drag = true;

    toggleAddBtn.textContent = 'Dodawanie punktów: ON';
    toggleDragBtn.classList.add('toggled');
    toggleDragBtn.textContent = 'Przesuwanie punktów: ON';
  }
  };

  toggleAddBtn.onclick = () => { 
    state.addPoints = !state.addPoints; 
    toggleAddBtn.textContent = 'Dodawanie punktów: ' + (state.addPoints ? 'ON' : 'OFF'); 
  };

  toggleDragBtn.onclick = () => { 
    state.drag = !state.drag; 
    toggleDragBtn.classList.toggle('toggled', state.drag); 
    toggleDragBtn.textContent = 'Przesuwanie punktów: ' + (state.drag ? 'ON' : 'OFF'); 
  };

  toggleSnapBtn.onclick = () => { 
    state.snap = !state.snap; 
    toggleSnapBtn.textContent = 'Przyciąganie kątów: ' + (state.snap ? 'ON' : 'OFF'); 
  };

  deleteSelectedBtn.onclick = () => { 
    if(state.selected < 0) return; 
    if(confirm('Na pewno chcesz usunąć wybrany punkt?')) { 
      state.points.splice(state.selected,1); 
      state.selected = -1; 
      render(); 
    } 
  };

  // ===== FIGURE LIST TABS =====
  document.querySelectorAll('.tab').forEach(tab => {
    tab.onclick = () => {
      stateTabs.current = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
      updateFigureList();
    };
  });

  // ===== MODALS / LIBRARY =====
  openBtn.onclick = async () => { await loadLibrary(); libraryModal.style.display = 'flex'; };
  closeLibBtn.onclick = () => { libraryModal.style.display = 'none'; };
  saveCurrentBtn.onclick = saveCurrentLibrary;
  saveBtn.onclick = saveCurrentLibrary;
  copyShareBtn.onclick = () => { navigator.clipboard.writeText(JSON.stringify(state)); alert('Skopiowano stan do schowka.'); };

  // ===== SEARCH & SORT =====
  searchFigureEl.addEventListener('input', () => { state.figureSearchTerm=searchFigureEl.value.toLowerCase(); updateFigureList(); });
  sortFigureBtn.addEventListener('click', () => { state.figureSortAsc=!state.figureSortAsc; sortFigureBtn.textContent=state.figureSortAsc?'Sort A→Z':'Sort Z→A'; updateFigureList(); });

  // ===== OKNO / RESIZE =====
  window.addEventListener('resize', render);

  // ===== DODAWANIE PUNKTU =====
  function addPointAt(x, y) {
    const pt = sanitizePoint({ x, y });
    state.points.push(pt);
    state.selected = state.points.length - 1;
    render();
  }

  // ===== WYBIERANIE FIGURY =====
  function selectFigure(figureData) {
    selName.value = figureData.name;
    selLead.value = figureData.lead;
    selFollow.value = figureData.follow;
    selBoth.value = figureData.both;
    selDesc.value = figureData.description;
    selLink.value = figureData.link;
    selColor.value = figureData.color;

    state.selected = -1;
    setFigureEditMode(false);
    render();
  }

  window.selectFigure = function(figureData) {
  selName.value = figureData.name;
  selLead.value = figureData.lead;
  selFollow.value = figureData.follow;
  selBoth.value = figureData.both;
  selDesc.value = figureData.description;
  selLink.value = figureData.link;
  selColor.value = figureData.color;

  state.selected = -1;
  setFigureEditMode(false);
  render();

  // dodaj do ostatnich
  addToRecent(figureData.name);
  updateFigureList();
};
}
