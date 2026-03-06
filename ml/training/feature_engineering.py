import pandas as pd

def build_features(df):

    df["transaction_amount"] = df["amt"]

    df["is_large_txn"] = (
        df["amt"] > df["amt"].mean()
    ).astype(int)

    df["hour"] = pd.to_datetime(
        df["trans_date_trans_time"]
    ).dt.hour

    df["night_transaction"] = (
        df["hour"].between(0,5)
    ).astype(int)

    df["amount_deviation"] = (
        df["amt"] - df["amt"].mean()
    ) / df["amt"].std()

    return df[
        [
            "transaction_amount",
            "is_large_txn",
            "night_transaction",
            "amount_deviation"
        ]
    ]