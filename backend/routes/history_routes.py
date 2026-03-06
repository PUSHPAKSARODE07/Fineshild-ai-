from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json

from backend.middleware.auth_middleware \
    import get_current_user

from backend.config.db import get_db

from backend.services.history_service \
    import get_user_history


router = APIRouter(
    prefix="/history",
    tags=["History"]
)


@router.get("/")
def user_history(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    data = get_user_history(
        db, current_user["username"]
    )

    return [
        {
            "analysis_id": r.id,
            "fraud_score": r.fraud_score,
            "distress_score": r.distress_score,
            "identity_confidence":
                r.identity_confidence,
            "final_risk_score": r.final_risk_score,
            "risk_level": r.risk_level,
            "total_transactions":
                r.total_transactions,
            "explanation":
                json.loads(r.explanation)
                if r.explanation else [],
            "created_at": str(r.created_at)
        }
        for r in data
    ]
