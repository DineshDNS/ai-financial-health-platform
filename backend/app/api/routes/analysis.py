from fastapi import APIRouter

router = APIRouter(prefix="/analysis", tags=["Analysis"])

@router.get("/test")
def analysis_test():
    return {
        "message": "Analysis route working",
        "phase": 1
    }
