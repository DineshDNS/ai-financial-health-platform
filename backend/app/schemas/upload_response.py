from pydantic import BaseModel

class FileIngestionResult(BaseModel):
    file_name: str
    detected_type: str | None
    confidence: float
    status: str
    rows_extracted: int
