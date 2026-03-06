def structure_transactions(df):

    df["amount"] = df["credit"] - df["debit"]

    return df[
        [
            "date",
            "description",
            "amount",
            "balance"
        ]
    ]