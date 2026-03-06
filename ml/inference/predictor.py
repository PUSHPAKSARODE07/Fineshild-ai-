import joblib
import pandas as pd
from ml.training.feature_engineering import build_features

model = joblib.load(
    "ml/models/finshield_model.pkl"
)


def predict_fraud(transactions_df):

    features = build_features(transactions_df)

    probs = model.predict_proba(features)[:, 1]

    fraud_probability = float(probs.mean())

    if fraud_probability > 0.7:
        risk = "HIGH"
    elif fraud_probability > 0.4:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {
        "fraud_probability": fraud_probability,
        "risk_level": risk,
        "confidence": float(probs.max())
    }

import joblib
from backend.config.settings import MODEL_PATH

model = joblib.load(MODEL_PATH)