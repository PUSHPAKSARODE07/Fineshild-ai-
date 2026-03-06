from backend.pipelines.risk_pipeline.risk_pipeline \
import run_risk_pipeline

from backend.config.db import SessionLocal
from backend.models.analysis_model import Analysis
from backend.models.user_model import User


def generate_risk(
        fraud,
        health,
        identity,
        username):

    result = run_risk_pipeline(
        fraud,
        health,
        identity
    )

    db = SessionLocal()

    user = db.query(User)\
        .filter(
            User.username == username
        ).first()

    record = Analysis(
        user_id=user.id,
        fraud_score=fraud["fraud_score"],
        distress_score=
            health["financial_distress_score"],
        identity_confidence=
            identity["confidence"],
        final_risk_score=
            result["final_risk_score"],
        risk_level=result["risk_level"]
    )

    db.add(record)
    db.commit()
    db.close()

    return result