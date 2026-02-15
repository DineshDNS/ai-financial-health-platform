from fastapi import FastAPI

from app.api.routes import health, analysis, upload

from app.core.database import Base, engine

# Import all models so SQLAlchemy can register them
from app.models import revenue, expenses, loans, inventory, bank


app = FastAPI(
    title="AI Financial Health Intelligence API",
    description="AI-Powered Financial Health Intelligence & Risk Assessment System",
    version="1.0.0"
)

# Create database tables automatically
Base.metadata.create_all(bind=engine)

# Phase 1 Routes
app.include_router(health.router)
app.include_router(analysis.router)

# Phase 2 Routes
app.include_router(upload.router)


@app.get("/")
def root():
    return {
        "message": "AI Financial Health Intelligence System API Running",
        "phases_completed": ["Phase 0", "Phase 1", "Phase 2"],
        "current_module": "Data Ingestion Engine"
    }
