import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Database Selection ---
# Use SQLite by default for portability. Set DB_TYPE=mysql in .env to use MySQL.
DB_TYPE = os.getenv("DB_TYPE", "sqlite").lower()

if DB_TYPE == "mysql":
    from urllib.parse import quote_plus
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_NAME = os.getenv("DB_NAME", "Hospitalmanagement")
    encoded_password = quote_plus(DB_PASSWORD)
    SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{encoded_password}@{DB_HOST}/{DB_NAME}"
else:
    # SQLite — works out of the box, no external DB needed
    DB_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DB_PATH = os.path.join(DB_DIR, "crm.db")
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# Create engine and session
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True if DB_TYPE == "mysql" else False,
    connect_args={"check_same_thread": False} if DB_TYPE != "mysql" else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()