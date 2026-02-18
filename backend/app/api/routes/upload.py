from fastapi import APIRouter, UploadFile, File, Depends
from typing import List
from sqlalchemy.orm import Session
from pydantic import BaseModel
import threading

from app.core.database import get_db

from app.services.file_saver import save_raw_file
from app.services.parsers.csv_excel_parser import parse_csv_excel
from app.services.parsers.pdf_parser import parse_pdf
from app.services.type_detector import detect_file_type
from app.services.column_mapper import normalize_columns
from app.services.data_cleaner import clean_dataframe
from app.services.ai_cache_manager import clear_ai_cache
from app.services.ai_precompute_service import precompute_ai_after_upload

from app.schemas.upload_response import FileIngestionResult

# DB Models
from app.models.revenue import Revenue
from app.models.expenses import Expense
from app.models.loans import Loan
from app.models.inventory import Inventory
from app.models.bank import BankTransaction
from app.models.uploaded_file import UploadedFile

router = APIRouter(prefix="/upload", tags=["Data Ingestion"])


# ======================================================
# UPLOAD FINANCIAL FILES
# ======================================================
@router.post("/financials", response_model=List[FileIngestionResult])
async def upload_financial_files(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    results = []
    current_user_id = 1  # TEMP until JWT Phase

    for file in files:

        # ---------- DUPLICATE CHECK ----------
        existing = db.query(UploadedFile).filter(
            UploadedFile.file_name == file.filename,
            UploadedFile.user_id == current_user_id,
            UploadedFile.status == "active"
        ).first()

        if existing:
            results.append(
                FileIngestionResult(
                    file_name=file.filename,
                    detected_type=None,
                    confidence=0,
                    status="duplicate",
                    rows_extracted=0
                )
            )
            continue

        path = save_raw_file(file)

        detected_type = None
        confidence = 0
        rows = 0
        status = "unsupported_format"

        # ---------- CSV / EXCEL ----------
        if file.filename.endswith((".csv", ".xlsx")):
            df = parse_csv_excel(path)
            df = normalize_columns(df)
            df = clean_dataframe(df)

            detected_type, confidence, status = detect_file_type(df.columns)
            rows = len(df)

            if detected_type == "revenue":
                for _, row in df.iterrows():
                    db.add(Revenue(
                        date=str(row.get("date", "")),
                        amount=float(row.get("amount", 0)),
                        gst_amount=float(row.get("gst", 0)),
                        source=str(row.get("source", "")),
                        source_file=file.filename,
                        user_id=current_user_id
                    ))

            elif detected_type == "expenses":
                for _, row in df.iterrows():
                    db.add(Expense(
                        date=str(row.get("date", "")),
                        amount=float(row.get("amount", 0)),
                        gst_amount=float(row.get("gst", 0)),
                        category=str(row.get("category", "")),
                        source_file=file.filename,
                        user_id=current_user_id
                    ))

            elif detected_type == "loans":
                for _, row in df.iterrows():
                    db.add(Loan(
                        loan_id=str(row.get("loan_id", "")),
                        amount=float(row.get("amount", 0)),
                        interest_rate=float(row.get("interest_rate", 0)),
                        start_date=str(row.get("start_date", "")),
                        end_date=str(row.get("end_date", "")),
                        source_file=file.filename,
                        user_id=current_user_id
                    ))

            elif detected_type == "inventory":
                for _, row in df.iterrows():
                    db.add(Inventory(
                        item_name=str(row.get("item_name", "")),
                        quantity=int(row.get("quantity", 0)),
                        unit_price=float(row.get("unit_price", 0)),
                        last_updated=str(row.get("last_updated", "")),
                        source_file=file.filename,
                        user_id=current_user_id
                    ))

            elif detected_type == "bank":
                for _, row in df.iterrows():
                    db.add(BankTransaction(
                        date=str(row.get("date", "")),
                        debit=float(row.get("debit", 0)),
                        credit=float(row.get("credit", 0)),
                        balance=float(row.get("balance", 0)),
                        source_file=file.filename,
                        user_id=current_user_id
                    ))

        # ---------- PDF ----------
        elif file.filename.endswith(".pdf"):
            text = parse_pdf(path)
            detected_type, confidence, status = detect_file_type([], text)
            rows = 0

        # ---------- STORE FILE METADATA ----------
        db.add(UploadedFile(
            file_name=file.filename,
            detected_type=detected_type,
            rows_extracted=rows,
            status="active",
            user_id=current_user_id
        ))

        db.commit()

        # ---------- FAST RESPONSE OPTIMIZATION ----------
        clear_ai_cache(db, user_id=current_user_id)

        # Run AI in background (NON-BLOCKING)
        threading.Thread(
            target=precompute_ai_after_upload,
            args=(current_user_id,)
        ).start()

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


# ======================================================
# LIST FILES
# ======================================================
@router.get("/list")
def list_uploaded_files(db: Session = Depends(get_db)):
    current_user_id = 1

    return db.query(UploadedFile).filter(
        UploadedFile.user_id == current_user_id,
        UploadedFile.status == "active"
    ).all()


# ======================================================
# DELETE FILE
# ======================================================
@router.delete("/file/{filename}")
def delete_file(filename: str, db: Session = Depends(get_db)):
    current_user_id = 1

    db.query(Revenue).filter(
        Revenue.source_file == filename,
        Revenue.user_id == current_user_id
    ).delete()

    db.query(Expense).filter(
        Expense.source_file == filename,
        Expense.user_id == current_user_id
    ).delete()

    db.query(Loan).filter(
        Loan.source_file == filename,
        Loan.user_id == current_user_id
    ).delete()

    db.query(Inventory).filter(
        Inventory.source_file == filename,
        Inventory.user_id == current_user_id
    ).delete()

    db.query(BankTransaction).filter(
        BankTransaction.source_file == filename,
        BankTransaction.user_id == current_user_id
    ).delete()

    db.query(UploadedFile).filter(
        UploadedFile.file_name == filename,
        UploadedFile.user_id == current_user_id
    ).update({"status": "deleted"})

    db.commit()
    clear_ai_cache(db, user_id=current_user_id)

    threading.Thread(
        target=precompute_ai_after_upload,
        args=(current_user_id,)
    ).start()

    return {"message": "File deleted successfully"}
