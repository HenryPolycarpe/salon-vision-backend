# salon-vision-backend
The backend for The salon App
Kein Problem — ich kopiere dir den kompletten Inhalt der README.md hier rein,
dann kannst du ihn einfach als Datei speichern.

⸻

README.md – Inhalt:

# Salon-Vision Backend

Dieses Verzeichnis enthält einen kleinen Node/Express-Server als **Proxy** für die Friseur-App.  
Der Server nimmt Bilder und Prompts aus der iOS-App entgegen und ruft damit die **OpenAI Images-API** auf.  
Dadurch bleibt dein OpenAI-API-Key sicher auf dem Server und wird nicht in der App ausgeliefert.

## 📦 Was ist enthalten?

* **`server.js`** – Der Express-Server, der Requests von der App entgegennimmt und an die OpenAI API weiterleitet.
* **`.env.example`** – Beispiel für die Umgebungsvariable mit dem API-Key (niemals den echten Key ins Repo pushen).
* **`package.json`** – Paketdefinition mit den benötigten Node-Modulen.
* **Diese README.md** – Anleitung.

---

## 🚀 Installation (lokal)

1. **Repo klonen**  
   ```bash
   git clone https://github.com/DEINUSERNAME/salon-vision-backend.git
   cd salon-vision-backend

	2.	Abhängigkeiten installieren

npm install


	3.	.env erstellen

cp .env.example .env

In .env deinen OPENAI_API_KEY eintragen:

OPENAI_API_KEY=sk-...


	4.	Server starten

node server.js

Standard-Port: 3000 (oder Port aus PORT-Variable).

⸻

🌐 Deployment auf Render
	1.	Neues Web Service auf render.com anlegen.
	2.	Repo von GitHub verbinden.
	3.	Build Command: npm install
	4.	Start Command: npm start
	5.	Unter Environment Variables OPENAI_API_KEY setzen.
	6.	Deploy starten → öffentliche HTTPS-URL kopieren und in der iOS-App (BackendConfig.baseURL) eintragen.

⸻

🔒 Sicherheit
	•	API-Keys niemals in der App oder im öffentlichen Code speichern.
	•	Schlüssel nur im Backend (z. B. .env auf Render) aufbewahren.
	•	Optional: Authentifizierung im Backend hinzufügen, um fremde Zugriffe zu verhindern.
	•	Bei Bildbearbeitung nur relevante Bereiche (Haare) mit einer Maske bearbeiten, um bessere Ergebnisse zu erzielen.

⸻

📄 Lizenz

Dieses Backend-Beispiel ist frei verwendbar und kann an eigene Bedürfnisse angepasst werden.

---
