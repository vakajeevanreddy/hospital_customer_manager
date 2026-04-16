# AIVOA - AI-Powered Medical CRM

AIVOA is a high-precision CRM assistant designed to streamline interactions between pharmaceutical representatives and Healthcare Professionals (HCPs). It uses advanced AI to extract clinical data, summarize medical discussions, and suggest next clinical steps.

## 🚀 Features

-   **AI Voice Summary**: Automatically generates professional clinical summaries from interaction notes.
-   **Next Clinical Steps**: Provides actionable follow-ups focused on medical education and clinical evidence.
-   **Structured Extraction**: Extracts HCP names, specialties, organizations, and product focus from unstructured text.
-   **Real-time Integration**: Frontend React application integrated with a FastAPI backend.
-   **State Management**: Powered by Redux for a seamless user experience.

## 📂 Project Structure

-   `Back_end/`: FastAPI server, database models, and AI tools.
-   `Front_end/`: React components and UI styles.
-   `start_backend.bat`: Convenience script to launch the backend.

## ⚙️ Setup Instructions

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
4.  Ensure your `.env` file has your `GROQ_API_KEY`.
5.  Run the backend:
    ```bash
    ../start_backend.bat
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

## AI Configuration

The AI logic is handled via LangGraph-style tools located in `Back_end/tools/`. Prompts have been refined for clinical excellence and professional reporting.
