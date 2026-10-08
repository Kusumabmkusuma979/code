# MAYA V4 — Artificial Self

MAYA is an interactive AI experience built around one idea:

> If memory, emotion, voice and personality can make an AI feel like someone, what is actually there underneath?

## Project structure

```text
MAYA_V4/
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── v3.js
│   └── v4.js
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
├── README.md
└── .gitignore
```

## Run locally

1. Open a terminal in `MAYA_V4`.
2. Create and activate a virtual environment.
3. Install dependencies:

```bash
cd backend
python -m venv .venv
# macOS/Linux:
source .venv/bin/activate
# Windows:
# .venv\Scripts\activate
pip install -r requirements.txt
```

4. Optional: create `backend/.env` from `.env.example` and add `GEMINI_API_KEY`.
5. Start the server:

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

6. Open `http://127.0.0.1:8000`.

Without a Gemini key, MAYA still runs using a built-in demo/fallback response layer.

## Deployment on Render

Use one **Web Service** because FastAPI serves the frontend.

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- Environment variable: `GEMINI_API_KEY`

Important: the current `app.py` expects the repository layout shown above, with `frontend/` next to `backend/`.

## Presentation / Judge Mode

Click **Presentation Mode** in the top-right. It cycles through the narrative:

1. Artificial self
2. Memory
3. Emotional presentation
4. The question of reality
5. Tattva

The shortcut `Ctrl+P` also opens presentation mode.

## Architecture

- **Frontend:** HTML/CSS/vanilla JavaScript.
- **Backend:** FastAPI.
- **Memory:** SQLite on the server plus browser-local state for a resilient demo.
- **Identity:** per-browser UUID stored locally.
- **AI:** Gemini when `GEMINI_API_KEY` is available; deterministic fallback otherwise.
- **Tattva layer:** the UI exposes the underlying layers instead of pretending that interface behavior proves consciousness.

## Notes

Do not commit `.env`, API keys, or `maya.db` to GitHub.
