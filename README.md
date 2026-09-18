# CivicLens AI 
CivicLens AI is an automated civic intelligence platform that transforms unstructured visual evidence of infrastructure damage (like severe potholes or broken streetlights) into actionable enterprise data. It bridges the gap between citizen observation and municipal action through edge-compressed AI inference, live GIS telemetry, and automated dispatch routing.

## ✨ Key Features

* **AI Technical Assessment:** Upload a photo and Google Gemini Vision instantly generates a B2B report card featuring a 1-10 priority rating, an estimated repair SLA, and a technical damage breakdown.
* **Geospatial Telemetry Dashboard:** All incidents are plotted on a live OpenStreetMap dashboard for city officials to monitor, triage, and manage.
* **Instant Dispatch System:** A single click converts the AI report into a structured, plain-text email ticket (via Gmail) containing GPS coordinates and recommended actions, ready for repair crews.
* **Edge-Client Compression:** A native HTML5 Canvas algorithm compresses 10MB smartphone photos down to ~150KB directly in the browser, ensuring lightning-fast AI processing.
* **Device-Level Security:** Browser `localStorage` acts as a session ledger, locking public visitors into "View Only" mode while allowing original authors to resolve or delete their own reports.
* **Graceful Degradation:** Robust backend error handling catches API rate limits (HTTP 429) and returns professional UI warnings instead of server crashes.

## 🚀 Tech Stack

* **Frontend:** React.js, Vite, React-Router, React-Leaflet (OpenStreetMap)
* **Backend:** Python, FastAPI, SQLite (SQLAlchemy)
* **AI Integration:** Google Generative AI (Gemini 1.5 Flash Vision)

---

## 🛠️ Local Installation & Setup

### Prerequisites

* Node.js (v18+)
* Python (3.9+)
* A Google Gemini API Key

### 1. Backend Setup (FastAPI)

Open a terminal and navigate to the `backend` directory:

```bash
cd backend

```

Create a virtual environment (optional but recommended) and install dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt

```

Create a `.env` file in the root of the `backend` directory and add your API key:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here

```

Start the backend server:

```bash
uvicorn app.main:app --reload

```

*The backend will run on `[http://127.0.0.1:8000](http://127.0.0.1:8000)*`

### 2. Frontend Setup (React/Vite)

Open a new terminal window and navigate to the `frontend` directory:

```bash
cd frontend

```

Install the Node dependencies:

```bash
npm install

```

Start the development server:

```bash
npm run dev

```

*The frontend will run on `http://localhost:5173*`

---

## 💻 Usage Instructions

1. Open `http://localhost:5173` in your browser.
2. Navigate to the **Report Issue** tab.
3. Upload an image of infrastructure damage (e.g., a pothole). The app will automatically compress the image, grab your GPS coordinates, and run the AI inference.
4. Review the generated priority rating, SLA, and technical assessment.
5. Click **Instant Dispatch to Public Works** to generate the email ticket.
6. Navigate to the **Dashboard** to view your report on the live GIS map and test the status toggle/delete functions.
