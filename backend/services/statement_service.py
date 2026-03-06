import pandas as pd
import re


REQUIRED_COLUMNS = [
    "date",
    "description",
    "debit",
    "credit",
    "balance"
]


# =====================================
# SAFE CSV READER
# =====================================

def read_csv_safe(file_path):

    encodings = [
        "utf-8",
        "latin-1",
        "ISO-8859-1",
        "cp1252"
    ]

    for enc in encodings:
        try:
            return pd.read_csv(
                file_path, encoding=enc
            )
        except Exception:
            continue

    raise Exception("Unable to read statement file")


# =====================================
# FLEXIBLE COLUMN NORMALIZATION
# =====================================

def normalize_columns(df):
    """
    Handles headers like 'Debit (₹)',
    'Credit (INR)', 'Balance (Rs)' etc.
    """
    new_cols = {}

    for col in df.columns:
        lower = col.strip().lower()
        clean = re.sub(
            r'\s*\(.*?\)', '', lower
        ).strip()

        if clean in (
            "date", "transaction date",
            "txn date", "value date"
        ):
            new_cols[col] = "date"

        elif clean in (
            "description", "narration",
            "particulars", "details"
        ):
            new_cols[col] = "description"

        elif clean in (
            "debit", "withdrawal",
            "dr", "debit amount"
        ):
            new_cols[col] = "debit"

        elif clean in (
            "credit", "deposit",
            "cr", "credit amount"
        ):
            new_cols[col] = "credit"

        elif clean in (
            "balance", "closing balance",
            "running balance"
        ):
            new_cols[col] = "balance"

    df.rename(columns=new_cols, inplace=True)

    return df


# =====================================
# MAIN PARSER
# =====================================

def process_statement(file_path: str):

    df = read_csv_safe(file_path)

    df = normalize_columns(df)

    for col in REQUIRED_COLUMNS:
        if col not in df.columns:
            df[col] = 0

    # Clean numeric columns
    for col in ["debit", "credit", "balance"]:
        df[col] = (
            df[col]
            .astype(str)
            .str.replace(",", "", regex=False)
            .str.replace(" ", "", regex=False)
            .str.strip()
        )
        df[col] = pd.to_numeric(
            df[col], errors="coerce"
        ).fillna(0)

    transactions = []

    for _, row in df.iterrows():

        transactions.append({
            "timestamp": str(row["date"]),
            "description": str(row["description"]),
            "debit": float(row["debit"]),
            "credit": float(row["credit"]),
            "balance": float(row["balance"])
        })

    return transactions
