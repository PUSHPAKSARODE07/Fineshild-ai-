from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import shutil
import os

from backend.middleware.auth_middleware import get_current_user
from backend.services.statement_service import process_statement
from backend.services.analysis_service import analyse_transactions


router = APIRouter(prefix="/analysis", tags=["Analysis"])


UPLOAD_DIR = "backend/uploads/bank_statements"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ======================================
# REAL ANALYSIS ENDPOINT
# ======================================

@router.post("/run")
async def run_analysis(
    statement: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):

    try:

        # -----------------------------
        # SAVE UPLOADED FILE
        # -----------------------------
        file_path = f"{UPLOAD_DIR}/{statement.filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(statement.file, buffer)

        # -----------------------------
        # PARSE STATEMENT
        # -----------------------------
        transactions = process_statement(file_path)

        if not transactions:
            raise HTTPException(
                status_code=400,
                detail="No transactions extracted"
            )

        # -----------------------------
        # RUN ANALYSIS
        # -----------------------------
        result = analyse_transactions(
            transactions,
            user=current_user["username"]
        )

        return {
            "status": "success",
            "analysis": result
        }

    except Exception as e:
        return {"error": str(e)}