# AIVOA - AI-Powered Medical CRM

AIVOA is a high-precision CRM assistant designed to streamline interactions between pharmaceutical representatives and Healthcare Professionals (HCPs). It uses advanced AI to extract clinical data, summarize medical discussions, and suggest next clinical steps.

## ✨ Features

- **AI Assistant** — Describe a medical interaction in natural language and the AI extracts structured fields automatically.
- **Smart Field Mapping** — Handles LLM variations (e.g., "doctor" → `hcp_name`, "hospital" → `organization`).
- **16 Interaction Fields** — Comprehensive tracking including HCP name, specialty, product focus, sentiment, follow-up actions, and more.
- **Modern Dark UI** — Premium glassmorphism design with smooth animations.
- **Interaction History** — View all saved interactions with sentiment badges and professional summaries.
- **AI Voice Summary** — Automatically generates professional clinical summaries from interaction notes.

## 🛠 Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React 18 + Vite |
| Backend  | FastAPI + SQLAlchemy |
| Database | SQLite (default) |
| AI/LLM   | Groq (Llama 3.3 70B) |
| State    | Redux Toolkit |

## 📂 Project Structure

```
Pyndatic/
├── Back_end/
│   ├── main.py              # FastAPI app entry point
│   ├── db/
│   │   ├── database.py      # SQLAlchemy engine + session
│   │   └── schemas.py       # Pydantic schemas
│   ├── models/
│   │   └── interaction.py   # SQLAlchemy Interaction model
│   ├── routes/
│   │   ├── ai_routes.py     # /ai-assistant endpoint
│   │   └── interaction_routes.py  # CRUD endpoints
│   ├── services/
│   │   ├── langgraph_agent.py  # Intent routing + agent
│   │   ├── llm_service.py     # Groq LLM wrapper
│   │   └── log_tool.py        # NLP extraction tool
│   └── requirements.txt
├── Front_end/
│   ├── index.html
│   ├── main.jsx
│   ├── app.jsx              # Dashboard layout + key mapping
│   ├── styles.css           # Modern dark theme
│   ├── Components/
│   │   ├── AIAssistant.jsx  # Chat interface
│   │   ├── InteractionForm.jsx  # Form with glassmorphism cards
│   │   └── interactionhistory.jsx  # History list
│   └── package.json
└── start_backend.bat        # Convenience script
```

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API key ([get one free](https://console.groq.com))

### Backend Setup

1.  Navigate to the `Back_end` directory.
2.  Create and activate a virtual environment:
    ```bash
    python -m venv .venv
    .\.venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file and add your key:
    ```bash
    echo GROQ_API_KEY=your_groq_api_key_here > .env
    ```
5.  Run the backend:
    ```bash
    python -m uvicorn main:app --reload --port 8000
    ```

### Frontend Setup

1.  Navigate to the `Front_end` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## 📝 License

MIT
