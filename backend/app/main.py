from fastapi import FastAPI
from app.api.routes import health

app = FastAPI(title="AI Financial Health Platform")

app.include_router(health.router)

@app.get("/")
def root():
    return {"message": "Backend Running"}
