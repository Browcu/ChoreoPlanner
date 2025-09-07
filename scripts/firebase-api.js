// scripts/firebase-api.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { state } from './state.js';
import { updateLibraryList } from './ui-updates.js';

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

// Zapis biblioteki do Firebase
export async function saveCurrentLibrary() {
  try {
    await set(ref(db, 'library'), state.library);
    console.log("Zapisano bibliotekę do Firebase");
  } catch (err) {
    console.error("Błąd zapisu biblioteki:", err);
  }
}

// Wczytanie biblioteki i subskrypcja zmian
export function loadLibrary() {
  const libRef = ref(db, 'library');
  onValue(libRef, (snapshot) => {
    const data = snapshot.val();
    state.library = data || [];
    updateLibraryList(); // aktualizacja UI
  });
}
