import pandas as pd


def extract_transactions(rows):

    df = pd.DataFrame(
        rows,
        columns=[
            "date",
            "description",
            "debit",
            "credit",
            "balance"
        ]
    )

    return df