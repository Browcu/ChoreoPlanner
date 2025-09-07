// scripts/state.js
import { figures } from './figures.js';

export let state = {
  name: 'bez nazwy',
  points: [],
  closed: false,

  // Tryby główne
  svgEdit: false,      // edycja układu w SVG
  figureEdit: false,   // edycja danych figur (formularz)
  addPoints: false,    // dodawanie punktów
  drag: false,         // przesuwanie punktów
  snap: false,         // przyciąganie kątów

  // Bieżące zaznaczenie
  selected: -1,
  dragging: null,

  // Inne
  figureSearchTerm: '',
  figureSortAsc: true,
  library: []
};

// ===== OSTATNIO UŻYTE FIGURY – z localStorage =====
export let recentFigures = JSON.parse(localStorage.getItem('recentFigures') || '[]');

export function addToRecent(figureName) {
  console.log('✅ DODAJĘ DO OSTATNICH:', figureName);
  
  const index = recentFigures.indexOf(figureName);
  if (index !== -1) recentFigures.splice(index, 1);
  recentFigures.unshift(figureName);
  if (recentFigures.length > 10) recentFigures.pop();
  
  localStorage.setItem('recentFigures', JSON.stringify(recentFigures));
  
  console.log('📋 AKTUALNE OSTATNIE:', recentFigures);
  console.log('💾 ZAPISANO W LOCALSTORAGE:', JSON.parse(localStorage.getItem('recentFigures')));
}


export let currentTab = 'recent';
export const stateTabs = { current: 'recent' };

// Eksportujemy też figures dla innych modułów
export { figures };
