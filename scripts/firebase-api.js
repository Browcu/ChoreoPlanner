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

// Zapis bieżącej biblioteki do Firebase
export async function saveCurrentLibrary() {
  try {
    await set(ref(db, 'library'), state.library);
    console.log("✅ Zapisano bibliotekę do Firebase");
  } catch (err) {
    console.error("❌ Błąd zapisu biblioteki:", err);
    alert("Nie udało się zapisać biblioteki do Firebase");
  }
}

// Wczytanie biblioteki i subskrypcja zmian w czasie rzeczywistym
export function loadLibrary() {
  const libRef = ref(db, 'library');
  onValue(libRef, (snapshot) => {
    const data = snapshot.val();
    state.library = Array.isArray(data) ? data : [];
    updateLibraryList();
  });
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
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ Błąd wczytywania własnych figur:", err);
    return [];
  }
}

// Zapis pojedynczej figury
export async function saveFigureToCustom(figData) {
  const figsRef = ref(db, 'customFigures');
  try {
    // Wczytaj wszystkie figury
    const snapshot = await get(figsRef);
    const arr = Array.isArray(snapshot.val()) ? snapshot.val() : [];

    const idx = arr.findIndex(f => f.name === figData.name);
    if (idx >= 0) arr[idx] = figData;
    else arr.push(figData);

    await set(figsRef, arr);
    console.log("✅ Zapisano figurę w Firebase:", figData.name);
  } catch (err) {
    console.error("❌ Błąd zapisu figury:", err);
    alert("Nie udało się zapisać figury do Firebase");
  }
}

// Usunięcie figury z Firebase
export async function deleteCustomFigure(name) {
  const figsRef = ref(db, 'customFigures');
  try {
    const snapshot = await get(figsRef);
    let arr = Array.isArray(snapshot.val()) ? snapshot.val() : [];
    arr = arr.filter(f => f.name !== name);
    await set(figsRef, arr);
    console.log("✅ Usunięto figurę z Firebase:", name);
  } catch (err) {
    console.error("❌ Błąd przy usuwaniu figury:", err);
    alert("Nie udało się usunąć figury z Firebase");
  }
}
