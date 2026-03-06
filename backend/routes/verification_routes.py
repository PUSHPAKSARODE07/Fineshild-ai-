from fastapi import (
    APIRouter, UploadFile, File, Depends
)
import shutil
import os

from backend.middleware.auth_middleware \
    import get_current_user

from backend.services.verification_service \
    import verify_identity


router = APIRouter(
    prefix="/verify",
    tags=["Verification"]
)


UPLOAD_DIR = "backend/uploads/government_ids"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ======================================
# AUTHENTICATED IDENTITY VERIFICATION
# ======================================

@router.post("/upload")
async def upload_id(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        file_path = f"{UPLOAD_DIR}/{file.filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = verify_identity(
            file_path,
            current_user["username"]
        )

        return {
            "status": "success",
            "verification": result
        }

    except Exception as e:
        return {
            "status": "error",
            "detail": str(e)
        }


# ======================================
# OCR TEST (NO AUTH)
# ======================================

@router.post("/ocr-test")
async def test_ocr(file: UploadFile = File(...)):

    from backend.pipelines.identity_pipeline \
        .ocr_engine import run_ocr_pipeline

    file_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = run_ocr_pipeline(file_path)

    return result
