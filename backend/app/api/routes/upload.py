from fastapi import APIRouter, UploadFile, File, Depends
from typing import List
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.services.file_saver import save_raw_file
from app.services.parsers.csv_excel_parser import parse_csv_excel
from app.services.parsers.pdf_parser import parse_pdf
from app.services.type_detector import detect_file_type
from app.services.column_mapper import normalize_columns
from app.services.data_cleaner import clean_dataframe
from app.schemas.upload_response import FileIngestionResult

# DB Models
from app.models.revenue import Revenue
from app.models.expenses import Expense
from app.models.loans import Loan
from app.models.inventory import Inventory
from app.models.bank import BankTransaction

router = APIRouter(prefix="/upload", tags=["Data Ingestion"])


@router.post("/financials", response_model=List[FileIngestionResult])
async def upload_financial_files(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    results = []

    for file in files:
        path = save_raw_file(file)

        rows = 0
        detected_type = None
        confidence = 0
        status = "unsupported_format"

        # ===== CSV / EXCEL =====
        if file.filename.endswith((".csv", ".xlsx")):
            df = parse_csv_excel(path)
            df = normalize_columns(df)
            df = clean_dataframe(df)

            detected_type, confidence, status = detect_file_type(df.columns)
            rows = len(df)

            # ===== STORE INTO DATABASE =====
            if detected_type == "revenue":
                for _, row in df.iterrows():
                    record = Revenue(
                        date=str(row.get("date", "")),
                        amount=float(row.get("amount", 0)),
                        gst_amount=float(row.get("gst", 0)),
                        source=str(row.get("source", ""))
                    )
                    db.add(record)

            elif detected_type == "expenses":
                for _, row in df.iterrows():
                    record = Expense(
                        date=str(row.get("date", "")),
                        amount=float(row.get("amount", 0)),
                        gst_amount=float(row.get("gst", 0)),
                        category=str(row.get("category", ""))
                    )
                    db.add(record)

            elif detected_type == "loans":
                for _, row in df.iterrows():
                    record = Loan(
                        loan_id=str(row.get("loan_id", "")),
                        amount=float(row.get("amount", 0)),
                        interest_rate=float(row.get("interest_rate", 0)),
                        start_date=str(row.get("start_date", "")),
                        end_date=str(row.get("end_date", ""))
                    )
                    db.add(record)

            elif detected_type == "inventory":
                for _, row in df.iterrows():
                    record = Inventory(
                        item_name=str(row.get("item_name", "")),
                        quantity=int(row.get("quantity", 0)),
                        unit_price=float(row.get("unit_price", 0)),
                        last_updated=str(row.get("last_updated", ""))
                    )
                    db.add(record)

            elif detected_type == "bank":
                for _, row in df.iterrows():
                    record = BankTransaction(
                        date=str(row.get("date", "")),
                        debit=float(row.get("debit", 0)),
                        credit=float(row.get("credit", 0)),
                        balance=float(row.get("balance", 0))
                    )
                    db.add(record)

            db.commit()

        # ===== PDF =====
        elif file.filename.endswith(".pdf"):
            text = parse_pdf(path)
            detected_type, confidence, status = detect_file_type([], text)
            rows = 0

        # ===== RESPONSE =====
        results.append(
            FileIngestionResult(
                file_name=file.filename,
                detected_type=detected_type,
                confidence=confidence,
                status=status,
                rows_extracted=rows
            )
        )

    return results
