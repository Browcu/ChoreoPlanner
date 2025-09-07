const express = require('express');
const fs = require('fs').promises; // używamy fs.promises dla async/await
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const libraryPath = path.join(__dirname, 'library.json');

// Funkcja pomocnicza do wczytania biblioteki
async function readLibrary() {
  try {
    const data = await fs.readFile(libraryPath, 'utf8');
    const library = JSON.parse(data);
    return Array.isArray(library) ? library : [];
  } catch {
    return [];
  }
}

// Funkcja pomocnicza do zapisu biblioteki
async function writeLibrary(library) {
  await fs.writeFile(libraryPath, JSON.stringify(library, null, 2), 'utf8');
}

// GET - pobranie biblioteki
app.get('/library', async (req, res) => {
  const library = await readLibrary();
  res.json(library);
});

// POST - zapis pojedynczego układu
app.post('/library', async (req, res) => {
  const newEntry = req.body;
  if (!newEntry.name) return res.status(400).json({ error: 'Brak nazwy układu' });

  const library = await readLibrary();
  const idx = library.findIndex(d => d.name === newEntry.name);

  if (idx >= 0) library[idx] = newEntry; // nadpisanie istniejącego
  else library.push(newEntry);           // dodanie nowego

  try {
    await writeLibrary(library);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Nie udało się zapisać biblioteki' });
  }
});

// POST - usuwanie układu
app.post('/library/delete', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Brak nazwy układu do usunięcia' });

  const library = await readLibrary();
  const newLibrary = library.filter(d => d.name !== name);

  try {
    await writeLibrary(newLibrary);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Nie udało się usunąć układu' });
  }
});



const customFiguresPath = path.join(__dirname, 'customFigures.json');

async function readCustomFigures() {
  try {
    const data = await fs.readFile(customFiguresPath, 'utf8');
    const arr = JSON.parse(data);
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

async function writeCustomFigures(figs) {
  try {
    await fs.writeFile(customFiguresPath, JSON.stringify(figs, null, 2), 'utf8');
    console.log('✅ customFigures.json zapisany:', figs);
  } catch (err) {
    console.error('❌ Błąd zapisu customFigures.json:', err);
  }
}



// GET własne figury
app.get('/customFigures', async (req, res) => {
  const figs = await readCustomFigures();
  res.json(figs);
});

// POST zapis własnej figury
app.post('/customFigures', async (req, res) => {
  const newFig = req.body;
  if(!newFig.name) return res.status(400).json({error:'Brak nazwy figury'});

  const figs = await readCustomFigures();
  const idx = figs.findIndex(f => f.name === newFig.name);
  if(idx >= 0) figs[idx] = newFig; else figs.push(newFig);

  try {
    await writeCustomFigures(figs);
    res.json({ok:true});
  } catch {
    res.status(500).json({error:'Nie udało się zapisać figury'});
  }
});

// POST usuwanie własnej figury
app.post('/customFigures/delete', async (req, res) => {
  const { name } = req.body;
  if(!name) return res.status(400).json({error:'Brak nazwy figury do usunięcia'});

  const figs = await readCustomFigures();
  const newFigs = figs.filter(f => f.name !== name);

  try {
    await writeCustomFigures(newFigs);
    res.json({ok:true});
  } catch {
    res.status(500).json({error:'Nie udało się usunąć figury'});
  }
});


// Uruchom serwer
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
