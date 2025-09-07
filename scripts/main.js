// scripts/main.js
import { state, recentFigures, currentTab, figures, stateTabs } from './state.js';
import { setupEventListeners } from './events.js';
import { render } from './render.js';
import { loadCustomFigures } from './firebase-api.js'; // zmienione na Firebase
import { updateFigureList } from './ui-updates.js';
import { saveCurrentLibrary, loadLibrary } from './firebase-api.js';

// =======================
// EKSPORT STANÓW GLOBALNYCH
// =======================
export { state, recentFigures, currentTab, figures };

// =======================
// Własne figury (Custom Figures)
// =======================
let customFigures = [];
export { customFigures };

// =======================
// INICJALIZACJA PO ZAŁADOWANIU STRONY
// =======================
document.addEventListener('DOMContentLoaded', async () => {
  // ===== INICJALIZACJA STANU =====
  state.edit = false;           // tryb edycji parkietu
  state.figureEdit = false;     // tryb edycji panelu figur
  state.addPointsEnabled = false;
  state.dragEnabled = false;
  state.selected = -1;

  // ===== ŁADOWANIE WŁASNYCH FIGUR Z FIREBASE =====
  const figs = await loadCustomFigures();
  customFigures.length = 0;       // czyścimy starą tablicę
  customFigures.push(...figs);    // dodajemy wszystkie figury

  // ===== USTAWIENIE EVENT LISTENERÓW =====
  setupEventListeners();

  // ===== USTAWIENIE BIEŻĄCEJ ZAKŁADKI =====
  stateTabs.current = 'official';

  // ===== PIERWSZY RENDER =====
  render();
  updateFigureList();

  // ===== DEBUG =====
  console.log('Official figures:', figures.map(f => f.name));
  console.log('Custom figures:', customFigures.map(f => f.name));
});
