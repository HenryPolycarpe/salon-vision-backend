/*
 * Backend-Proxy für die Friseur‑App
 *
 * Diese Datei stellt einen kleinen Node/Express‑Server bereit, der
 * Bilder und Prompts aus der iOS‑App entgegennimmt und die OpenAI
 * Images‑API (Image Edit) aufruft. Durch die Trennung von Client und
 * Key bleibt dein OpenAI‑Schlüssel sicher auf dem Server und wird
 * nicht mit der App ausgeliefert.
 *
 * Hinweise:
 *  - Installiere die benötigten Pakete lokal via npm (siehe README).
 *  - Bewahre deinen OpenAI‑Schlüssel in einer `.env`‑Datei auf und
 *    lade sie mit dotenv.
 *  - Der Container, in dem dieses Beispiel ausgeführt wird, hat
 *    keinen Zugriff auf das Internet und kann die API nicht aufrufen.
 *    Für den Einsatz musst du das Projekt lokal ausführen.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Umgebungsvariablen laden (OPENAI_API_KEY, PORT)
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

/*
 * POST /generate-hair
 *
 * Erwartet:
 *  {
 *    "prompt": "deutscher Text zur Frisur", 
 *    "imageBase64": "data:image/png;base64,iVBORw..."
 *  }
 *
 * Antwort:
 *  - Die OpenAI‑API antwortet mit einem JSON‑Objekt, das ein generiertes
 *    Bild (als URL oder base64) enthält. Dieses wird an den Client
 *    zurückgesendet.
 */
app.post('/generate-hair', async (req, res) => {
  const { prompt, imageBase64 } = req.body;
  if (!prompt || !imageBase64) {
    return res.status(400).json({ error: 'Prompt und Bild sind erforderlich.' });
  }

  // Base64‑Header entfernen (z. B. "data:image/png;base64,")
  const cleanedBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(cleanedBase64, 'base64');

  // FormData für die Images API (Edit)
  const form = new FormData();
  form.append('prompt', prompt);
  form.append('n', 1);
  form.append('size', '1024x1024');
  form.append('image', imageBuffer, {
    filename: 'source.png',
    contentType: 'image/png',
  });
  // Hinweis: Für bessere Ergebnisse sollte eine Haarsegmentierungsmaske
  // hinzugefügt werden (form.append('mask', ...)). Dies ist optional.

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY nicht gesetzt.' });
    }

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// Port aus .env oder Standardwert 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Backend läuft auf Port ${port}`);
});