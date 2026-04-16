from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine, Base
from routes import interaction_routes, ai_routes

# Create the database tables
# This works for both SQLite and MySQL if the user/password/host are correct
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")
except Exception as e:
    print(f"Error creating database tables: {e}")

app = FastAPI(title="AIVOA Backend API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(interaction_routes.router, tags=["Interactions"])
app.include_router(ai_routes.router, tags=["AI"])

@app.get("/")
def read_root():
    return {"status": "online", "message": "AIVOA Backend API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
