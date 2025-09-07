// scripts/ui-updates.js
import { state, recentFigures, figures, stateTabs, addToRecent } from './state.js';
import { customFigures } from './main.js';
import { render } from './render.js';
import { loadLibrary } from './api.js';

export function updateFigureList() {
  let listData;

  console.log('=== DEBUG OSTATNIO UŻYWANE ===');
  console.log('Aktywna zakładka:', stateTabs.current);
  console.log('Recent figures (nazwy):', recentFigures);
  console.log('Wszystkie figury (oficjalne):', figures.map(f => f.name));
  console.log('Własne figury:', customFigures.map(f => f.name));

  if (stateTabs.current === 'recent') {
    const allFigures = [...figures, ...customFigures];
    console.log('Połączone wszystkie figury:', allFigures.map(f => f.name));
    
    listData = recentFigures
      .map(name => {
        const found = allFigures.find(f => f.name === name);
        console.log(`Szukam "${name}":`, found ? 'ZNALEZIONO' : 'NIE ZNALEZIONO');
        return found;
      })
      .filter(Boolean);
      
    console.log('Wynikowa lista ostatnich:', listData.map(f => f.name));
    
  } else if (stateTabs.current === 'custom') {
    listData = customFigures.slice();
  } else {
    listData = figures.slice();
  }

  // Reszta kodu pozostaje bez zmian...
  if (state.figureSearchTerm) {
    listData = listData.filter(f => f.name.toLowerCase().includes(state.figureSearchTerm));
  }

  listData.sort((a, b) => {
    if (a.name < b.name) return state.figureSortAsc ? -1 : 1;
    if (a.name > b.name) return state.figureSortAsc ? 1 : -1;
    return 0;
  });

  const figureListEl = document.getElementById('figureList');
  figureListEl.innerHTML = '';

  listData.forEach(f => {
    const li = document.createElement('li');
    li.className = 'item';
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.justifyContent = 'space-between';

    const leftSpan = document.createElement('span');
    leftSpan.style.display = 'flex';
    leftSpan.style.alignItems = 'center';
    leftSpan.style.gap = '6px';
    leftSpan.innerHTML = `
      <span style="display:inline-block; width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${f.name}</span>
      <span class="badge" style="width:16px; height:16px; border-radius:50%; background:${f.color}; display:inline-block;"></span>
    `;
    leftSpan.style.cursor = 'pointer';
    leftSpan.onclick = () => {
      if (state.selected >= 0) {
        Object.assign(state.points[state.selected], {
          name: f.name,
          color: f.color,
          description: f.description || '',
          lead: f.lead || '',
          follow: f.follow || '',
          both: f.both || '',
          link: f.link || ''
        });
        render();
        updateFigureList();
         addToRecent(f.name);
      } else {
        alert('Wybierz punkt na parkiecie, aby zastosować figurę.');
      }
    };
    li.appendChild(leftSpan);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';

    // Opis figury
    const showDescBtn = document.createElement('button');
    showDescBtn.className = 'btn tiny';
    showDescBtn.textContent = 'Opis';
    showDescBtn.onclick = () => {
      document.getElementById('descTitle').textContent = f.name;
      document.getElementById('descContent').textContent = f.description || 'Brak opisu dla tej figury.';
      document.getElementById('descModal').style.display = 'flex';
    };
    actionsDiv.appendChild(showDescBtn);

    // Edytuj figurę
    const editBtn = document.createElement('button');
    editBtn.className = 'btn tiny';
    editBtn.textContent = 'Edytuj';
    editBtn.onclick = (e) => {
      e.stopPropagation();
      if (state.selected >= 0) {
        Object.assign(state.points[state.selected], {
          name: f.name,
          color: f.color,
          description: f.description || '',
          lead: f.lead || '',
          follow: f.follow || '',
          both: f.both || '',
          link: f.link || ''
        });
        render();
        updateFigureList();
      } else {
        alert('Wybierz punkt na parkiecie, aby zastosować figurę.');
      }
    };
    actionsDiv.appendChild(editBtn);

    // Usuń figurę
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn tiny';
    deleteBtn.style.background = '#ef4444';
    deleteBtn.style.color = '#fff';
    deleteBtn.textContent = 'Usuń';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm(`Na pewno chcesz usunąć figurę "${f.name}"?`)) {
        if (stateTabs.current === 'custom') {
          const index = customFigures.findIndex(c => c.name === f.name);
          if (index !== -1) customFigures.splice(index, 1);

          fetch('/customFigures/delete', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({name:f.name})
          });
        }
        updateFigureList();
      }
    };
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(actionsDiv);
    figureListEl.appendChild(li);
  });
}

// Lista biblioteki układów
export function updateLibraryList() {
  const libraryList = document.getElementById('libraryList');
  const libraryEmpty = document.getElementById('libraryEmpty');
  
  libraryList.innerHTML = '';
  if (state.library.length === 0) {
    libraryEmpty.style.display = 'block';
    return;
  } else {
    libraryEmpty.style.display = 'none';
  }

  state.library.forEach((d, i) => {
    const div = document.createElement('div');
    div.className = 'lib-row';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    div.style.cursor = 'pointer';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = d.name;
    nameSpan.style.flex = '1';
    nameSpan.onclick = () => {
      const saved = state.library[i];
      Object.assign(state, JSON.parse(JSON.stringify(saved)));
      render();
      document.getElementById('libraryModal').style.display = 'none';
    };
    div.appendChild(nameSpan);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn tiny';
    deleteBtn.style.background = '#ef4444';
    deleteBtn.style.color = '#fff';
    deleteBtn.textContent = 'Usuń';
    deleteBtn.onclick = async (e) => {
      e.stopPropagation();
      if (!confirm(`Na pewno chcesz usunąć układ "${d.name}" z biblioteki?`)) return;
      try {
        const res = await fetch('/library/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: d.name })
        });
        const result = await res.json();
        if (result.ok) {
          alert('Usunięto układ z biblioteki.');
          await loadLibrary();
        } else {
          alert('Błąd przy usuwaniu układu.');
        }
      } catch (err) {
        console.error(err);
        alert('Błąd przy usuwaniu układu.');
      }
    };
    div.appendChild(deleteBtn);

    libraryList.appendChild(div);
  });
}
