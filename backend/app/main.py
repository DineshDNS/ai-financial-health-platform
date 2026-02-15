from fastapi import FastAPI

from app.api.routes import health, analysis, upload, dashboard
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

# -----------------------------
# PHASE 1 ROUTES
# -----------------------------
app.include_router(health.router)
app.include_router(analysis.router)

# -----------------------------
# PHASE 2 ROUTES
# -----------------------------
app.include_router(upload.router)

# -----------------------------
# PHASE 4 ROUTES (Dashboard APIs)
# -----------------------------
app.include_router(dashboard.router)


# -----------------------------
# ROOT ENDPOINT
# -----------------------------
@app.get("/")
def root():
    return {
        "message": "AI Financial Health Intelligence System API Running",
        "phases_completed": [
            "Phase 0",
            "Phase 1",
            "Phase 2",
            "Phase 3",
            "Phase 4"
        ],
        "current_module": "Dashboard API Layer"
    }
