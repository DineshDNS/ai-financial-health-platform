from fastapi import FastAPI

# -----------------------------
# CORE ROUTES (PHASE 1–4)
# -----------------------------
from app.api.routes import health, analysis, upload, dashboard

# -----------------------------
# PHASE 5 — ML ROUTES
# -----------------------------
from app.api.routes.ai_analysis import router as ai_router

# -----------------------------
# PHASE 6 — FORECAST ROUTES
# -----------------------------
from app.api.routes import forecast

# -----------------------------
# PHASE 7 — OLLAMA AI EXPLANATION ROUTES
# -----------------------------
from app.ai_engine.routes.ai_explain_routes import router as ai_explain_router

# -----------------------------
# DATABASE
# -----------------------------
from app.core.database import Base, engine

# Import models so SQLAlchemy registers tables
from app.models import revenue, expenses, loans, inventory, bank


app = FastAPI(
    title="AI Financial Health Intelligence API",
    description="AI-Powered Financial Health Intelligence & Risk Assessment System",
    version="1.0.0"
)

# -----------------------------
# CREATE TABLES
# -----------------------------
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
# PHASE 5 ROUTES (AI / ML)
# -----------------------------
app.include_router(ai_router)

# -----------------------------
# PHASE 6 ROUTES (Forecast)
# Prefix added to keep under /ai
# -----------------------------
app.include_router(forecast.router, prefix="/ai", tags=["Forecast"])

# -----------------------------
# PHASE 7 ROUTES (Ollama AI Layer)
# -----------------------------
app.include_router(ai_explain_router)

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
            "Phase 4",
            "Phase 5 (ML Core)",
            "Phase 6 (Forecast Engine)",
            "Phase 7 (AI Explanation Layer)"
        ],
        "current_module": "Ollama AI Narrative Intelligence"
    }
