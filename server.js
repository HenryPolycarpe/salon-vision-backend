/*
 * Backend-Proxy für die Friseur-App
 * - NUR serverseitig mit deinem OpenAI-API-Key arbeiten.
 * - Erwartet JSON { prompt, imageBase64 } von der iOS-App.
 * - Baut multipart/form-data für OpenAI Images Edit.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');      // <-- ACHTUNG: v2 im package.json (z. B. ^2.6.7)
const FormData = require('form-data');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' })); // etwas großzügiger

app.post('/generate-hair', async (req, res) => {
  try {
    const { prompt, imageBase64, size = '1024x1024' } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'missing_api_key' });
    }

    // Base64 (ohne Data-URL-Präfix) -> Buffer
    const cleanedBase64 = String(imageBase64).replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    const imageBuffer = Buffer.from(cleanedBase64, 'base64');

    // multipart/form-data korrekt aufbauen
    const form = new FormData();
    form.append('model', 'gpt-image-1');            // <-- WICHTIG!
    form.append('prompt', prompt || 'Hair style preview');
    form.append('size', size);
    // form.append('response_format', 'b64_json');     // <-- App kann Base64 direkt decodieren (entfernt wegen fehlermeldung)
    form.append('image', imageBuffer, {
      filename: 'source.png',
      contentType: 'image/png',
      knownLength: imageBuffer.length
    });
    // Optional: Nur Haare editieren (Maske):
    // form.append('mask', maskBuffer, { filename: 'mask.png', contentType: 'image/png' });

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...form.getHeaders(),                       // multipart boundary Header setzen
      },
      body: form
    });

    const dataText = await response.text();         // zuerst Text lesen
    let data;
    try { data = JSON.parse(dataText); } catch { data = { raw: dataText }; }

    if (!response.ok) {
      console.error('OpenAI error:', response.status, data);
      return res.status(response.status).json(data); // Originalfehler durchreichen
    }

    return res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

// Port aus .env oder Standardwert 3000/Render
const http = require("http");

const port = process.env.PORT || 3000;
const server = http.createServer(app);

// großzügige Limits gegen Timeouts
server.headersTimeout = 120000;   // 120s Header/Response Timeout
server.keepAliveTimeout = 75000;  // 75s
server.requestTimeout = 0;        // kein harter Cutoff auf Request-Ebene

server.listen(port, () => {
  console.log(`✅ Backend läuft auf Port ${port}`);
});
