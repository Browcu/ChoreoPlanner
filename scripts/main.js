import { state, recentFigures, currentTab, figures, stateTabs } from './state.js';
import { setupEventListeners } from './events.js';
import { render } from './render.js';
import { loadCustomFigures } from './api.js';
import { updateFigureList } from './ui-updates.js';

// Eksportujemy zmienne, które mogą być używane w innych modułach
export { state, recentFigures, currentTab, figures };

let customFigures = [];

document.addEventListener('DOMContentLoaded', async () => {
   // INICJALIZACJA STANU - jedna wspólna
  state.edit = false;           // tryb edycji parkietu
  state.figureEdit = false;     // tryb edycji panelu figur
  state.addPointsEnabled = false;
  state.dragEnabled = false;
  state.selected = -1;
  
  // Ładujemy własne figury z serwera
  const figs = await loadCustomFigures();
  customFigures.length = 0;      // czyścimy starą tablicę
  customFigures.push(...figs);   // dodajemy wszystkie figury

  // Setup event listeners
  setupEventListeners();

  // Ustawiamy bieżącą zakładkę na "oficjalne" figury
  stateTabs.current = 'official';

  // Pierwszy render i odświeżenie listy figur
  render();
  updateFigureList();

  // Konsola do debugowania
  console.log('Official figures:', figures);
  console.log('Custom figures:', customFigures);
});

export { customFigures };
