import joblib
import pandas as pd
import numpy as np

from backend.config.settings import MODEL_PATH


# =====================================
# SAFE MODEL LOADING
# =====================================

try:
    model = joblib.load(MODEL_PATH)
    MODEL_FEATURES = list(model.feature_names_in_)
except Exception:
    model = None
    MODEL_FEATURES = [
        "transaction_amount",
        "amount_deviation",
        "is_large_txn",
        "night_transaction"
    ]


# =====================================
# NORMALIZE TRANSACTIONS
# =====================================

def normalize_transactions(df):

    df = df.copy()

    if "transaction_amount" not in df.columns:

        if "amount" in df.columns:
            df["transaction_amount"] = df["amount"]

        elif "debit" in df.columns:
            df["transaction_amount"] = df["debit"]

        elif "credit" in df.columns:
            df["transaction_amount"] = df["credit"]

        else:
            df["transaction_amount"] = 0

    return df


# =====================================
# FEATURE ENGINEERING
# =====================================

def create_features(df):

    df = df.copy()

    mean_amt = df["transaction_amount"].mean()

    df["amount_deviation"] = (
        df["transaction_amount"] - mean_amt
    )

    df["is_large_txn"] = (
        df["transaction_amount"] >
        mean_amt * 2
    ).astype(int)

    if "timestamp" in df.columns:

        df["timestamp"] = pd.to_datetime(
            df["timestamp"],
            errors="coerce"
        )

        df["night_transaction"] = (
            df["timestamp"]
            .dt.hour
            .between(0, 6)
        ).astype(int)

    else:
        df["night_transaction"] = 0

    return df


# =====================================
# FRAUD ANALYSIS PIPELINE
# =====================================

def run_fraud_analysis(transactions):

    if isinstance(transactions, list):
        df = pd.DataFrame(transactions)
    else:
        df = transactions.copy()

    # ✅ EMPTY SAFETY
    if df.empty:
        return {
            "fraud_score": 0.0,
            "total_transactions": 0,
            "warning": "No transactions parsed"
        }

    df = normalize_transactions(df)

    df = create_features(df)

    X = df.reindex(columns=MODEL_FEATURES)

    X = X.fillna(0)

    if len(X) == 0:
        return {
            "fraud_score": 0.0,
            "total_transactions": 0,
            "warning": "Empty feature matrix"
        }

    if model is None:
        return {
            "fraud_score": 0.15,
            "total_transactions": len(df),
            "warning": "Model unavailable, default score"
        }

    predictions = model.predict(X)

    fraud_score = float(np.mean(predictions))

    return {
        "fraud_score": fraud_score,
        "total_transactions": len(df)
    }
