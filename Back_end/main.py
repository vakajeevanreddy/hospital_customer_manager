from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from services.langgraph_agent import run_agent
from db.database import engine, Base, get_db
from db import models

# Create database tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AIVOA CRM Backend")

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ai-chat")
async def ai_chat(request: Request):
    """Main AI chat endpoint — routes to LangGraph agent."""
    try:
        data = await request.json()
        print(f"DEBUG: Received chat request: {data.get('message')}")
        result = run_agent(data.get("message"), context_data=data.get("context"))
        return result
    except Exception as e:
        print(f"ERROR in /ai-chat: {str(e)}")
        return {"error": str(e), "ai_response": f"The backend encountered an error: {str(e)}"}

@app.get("/interactions")
def get_interactions(db: Session = Depends(get_db)):
    """List all saved interactions from the database."""
    interactions = db.query(models.Interaction).order_by(models.Interaction.created_at.desc()).all()
    return {"interactions": interactions}

@app.post("/interactions")
async def save_interaction(data: dict, db: Session = Depends(get_db)):
    """Save a completed interaction to the database."""
    try:
        new_interaction = models.Interaction(**data)
        db.add(new_interaction)
        db.commit()
        db.refresh(new_interaction)
        return {"status": "saved", "id": new_interaction.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
def health():
    return {"status": "ok"}