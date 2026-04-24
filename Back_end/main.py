from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine, Base
from routes import ai_routes, interaction_routes

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AIVOA Backend API",
    description="AI-powered CRM for Healthcare Professional interactions",
    version="1.0.0",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
        "https://vakajeevanreddy.github.io", # Allow GitHub Pages
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(ai_routes.router, tags=["AI Assistant"])
app.include_router(interaction_routes.router, tags=["Interactions"])


@app.get("/")
def read_root():
    return {"status": "online", "message": "AIVOA Backend API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
