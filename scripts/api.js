/* // scripts/api.js
import { state } from './state.js';
import { updateLibraryList } from './ui-updates.js';

export async function loadCustomFigures() {
  try {
    const res = await fetch('/customFigures');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch(err) {
    console.error(err);
    return [];
  }
}

export async function saveFigureToCustom(figure) {
  try {
    const res = await fetch('/customFigures', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(figure)
    });
    const result = await res.json();
    if(!result.ok) {
      alert('Nie udało się zapisać figury do Własnych');
    } else {
      await loadCustomFigures();
    }
  } catch(err) { console.error(err); }
}

export async function loadLibrary() {
  try {
    const res = await fetch('/library');
    const data = await res.json();
    state.library = Array.isArray(data) ? data : [];
    updateLibraryList();
  } catch (err) {
    console.error('Błąd wczytywania biblioteki:', err);
    state.library = [];
    updateLibraryList();
  }
}

export async function saveCurrentLibrary(e) {
  if (e) e.preventDefault();
  if (state.points.length === 0) return alert('Brak punktów do zapisania.');

  let name = state.name && state.name !== 'bez nazwy' ? state.name : '';
  name = prompt('Podaj nazwę układu:', name);
  if (!name) return;

  const copy = { ...state, name };

  const existing = state.library.find(l => l.name === name);
  if (existing) {
    if (!confirm(`Układ "${name}" już istnieje. Nadpisać go?`)) return;
  }

  try {
    const res = await fetch('/library', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(copy)
    });
    const result = await res.json();
    if (result.ok) {
      alert(existing ? 'Układ został zaktualizowany.' : 'Zapisano układ w bibliotece.');
      state.name = name;
      document.getElementById('danceName').textContent = name;
      await loadLibrary();
    } else {
      alert('Błąd zapisu układu.');
    }
  } catch (err) {
    console.error('Błąd zapisu układu:', err);
    alert('Błąd zapisu układu.');
  }
} */