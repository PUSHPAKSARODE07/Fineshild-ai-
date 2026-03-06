import pandas as pd
import json
import traceback

from backend.config.db import SessionLocal
from backend.models.user_model import User
from backend.models.analysis_model import Analysis

from backend.pipelines.fraud_pipeline.fraud_inference \
    import run_fraud_analysis

from backend.pipelines.financial_health_pipeline \
    .financial_health_pipeline import run_financial_health_analysis

from backend.pipelines.risk_pipeline.risk_pipeline \
    import run_risk_pipeline


# ===================================
# FULL ANALYSIS PIPELINE
# ===================================

def analyse_transactions(transactions, user):
    """
    Orchestrates: fraud detection -> financial health
    -> risk scoring -> DB persistence.
    """
    db = SessionLocal()

    try:
        # ---- Resolve user ----
        user_obj = (
            db.query(User)
            .filter(User.username == user)
            .first()
        )

        if not user_obj:
            return {"error": "User not found"}

        # ---- Fraud Detection ----
        try:
            fraud_result = run_fraud_analysis(transactions)
        except Exception:
            fraud_result = {
                "fraud_score": 0.0,
                "total_transactions": len(transactions),
                "warning": "Fraud model unavailable"
            }

        # ---- Financial Health ----
        try:
            df = pd.DataFrame(transactions)

            for col in ["debit", "credit", "balance"]:
                if col in df.columns:
                    df[col] = pd.to_numeric(
                        df[col], errors="coerce"
                    ).fillna(0)

            if "date" not in df.columns \
                    and "timestamp" in df.columns:
                df.rename(
                    columns={"timestamp": "date"},
                    inplace=True
                )

            if "description" not in df.columns:
                df["description"] = ""

            health_result = run_financial_health_analysis(df)

        except Exception:
            health_result = {
                "financial_distress_score": 0.0,
                "emi_analysis": {},
                "overdraft_analysis": {},
                "liquidity_analysis": {}
            }

        # ---- Identity (default if not verified) ----
        identity_result = {"confidence": 0.5}

        # ---- Risk Pipeline ----
        try:
            risk_result = run_risk_pipeline(
                fraud_result,
                health_result,
                identity_result
            )
        except Exception:
            risk_result = {
                "final_risk_score":
                    fraud_result.get("fraud_score", 0),
                "risk_level": "MEDIUM",
                "explanations": ["Risk engine fallback"]
            }

        # ---- Persist to DB ----
        record = Analysis(
            user_id=user_obj.id,
            fraud_score=fraud_result.get(
                "fraud_score", 0
            ),
            distress_score=health_result.get(
                "financial_distress_score", 0
            ),
            identity_confidence=
                identity_result["confidence"],
            final_risk_score=
                risk_result["final_risk_score"],
            risk_level=risk_result["risk_level"],
            total_transactions=fraud_result.get(
                "total_transactions", len(transactions)
            ),
            explanation=json.dumps(
                risk_result.get("explanations", [])
            )
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        return {
            "analysis_id": record.id,
            "fraud_score": record.fraud_score,
            "financial_health": {
                "distress_score": record.distress_score,
                "emi_analysis":
                    health_result.get("emi_analysis", {}),
                "overdraft_analysis":
                    health_result.get(
                        "overdraft_analysis", {}
                    ),
                "liquidity_analysis":
                    health_result.get(
                        "liquidity_analysis", {}
                    )
            },
            "identity_confidence":
                record.identity_confidence,
            "final_risk_score": record.final_risk_score,
            "risk_level": record.risk_level,
            "explanations":
                risk_result.get("explanations", []),
            "total_transactions":
                record.total_transactions,
            "created_at": str(record.created_at)
        }

    except Exception as e:
        db.rollback()
        return {
            "error": str(e),
            "trace": traceback.format_exc()
        }

    finally:
        db.close()
