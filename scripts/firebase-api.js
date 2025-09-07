// firebase-api.js
// =======================
// Obsługa Firebase dla ChoreoPlanner
// - zapis i wczytywanie biblioteki układów
// - zapis i wczytywanie własnych figur
// =======================

import { state } from './state.js';
import { updateLibraryList } from './ui-updates.js';

// Firebase SDK import z CDN (modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// =======================
// KONFIGURACJA FIREBASE
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyCZeabe0Iq3keLAMzxGw_StUK67anxaceA",
  authDomain: "choreoplanner-4b439.firebaseapp.com",
  databaseURL: "https://choreoplanner-4b439-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "choreoplanner-4b439",
  storageBucket: "choreoplanner-4b439.firebasestorage.app",
  messagingSenderId: "531148386896",
  appId: "1:531148386896:web:377305862033a0f34dd755"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =======================
// FUNKCJE BIBLIOTEKI UKŁADÓW
// =======================

// Wczytanie biblioteki i subskrypcja zmian w czasie rzeczywistym
export function loadLibrary() {
  const libRef = ref(db, 'library');
  onValue(libRef, snapshot => {
    const data = snapshot.val();
    state.library = data ? Object.values(data) : [];
    updateLibraryList();
  });
}

// Zapis bieżącej biblioteki do Firebase
export async function saveCurrentLibrary() {
  if (!state.library || state.library.length === 0) {
    alert("Brak układów do zapisania");
    return;
  }

  let name = prompt("Podaj nazwę układu:", state.name || "Nowy układ");
  if (!name) return;

  const copy = { ...state, name };

  // Sprawdzenie, czy już istnieje
  const existing = state.library.find(l => l.name === name);
  if (existing && !confirm(`Układ "${name}" już istnieje. Nadpisać go?`)) return;

  try {
    await set(ref(db, `library/${name}`), copy);
    console.log("✅ Zapisano bibliotekę do Firebase:", name);
    state.name = name;

    // Odświeżenie listy
    loadLibrary();
  } catch (err) {
    console.error("❌ Błąd zapisu biblioteki:", err);
    alert("Nie udało się zapisać biblioteki do Firebase.");
  }
}

// =======================
// FUNKCJE WŁASNYCH FIGUR
// =======================

// Wczytanie wszystkich własnych figur
export async function loadCustomFigures() {
  const figsRef = ref(db, 'customFigures');
  try {
    const snapshot = await get(figsRef);
    const data = snapshot.val();
    return data ? Object.values(data) : [];
  } catch (err) {
    console.error("❌ Błąd wczytywania własnych figur:", err);
    return [];
  }
}

// Zapis pojedynczej figury
export async function saveFigureToCustom(figData) {
  if (!figData.name) {
    alert("Figura musi mieć nazwę!");
    return;
  }

  try {
    await set(ref(db, `customFigures/${figData.name}`), figData);
    console.log("✅ Zapisano figurę w Firebase:", figData.name);
  } catch (err) {
    console.error("❌ Błąd zapisu figury:", err);
    alert("Nie udało się zapisać figury do Firebase");
  }
}

// Usunięcie figury z Firebase
export async function deleteCustomFigure(name) {
  try {
    await set(ref(db, `customFigures/${name}`), null);
    console.log("✅ Usunięto figurę z Firebase:", name);
  } catch (err) {
    console.error("❌ Błąd przy usuwaniu figury:", err);
    alert("Nie udało się usunąć figury z Firebase");
  }
}
