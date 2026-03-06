def clean_transactions(df):

    df["debit"] = df["debit"].replace("", 0)
    df["credit"] = df["credit"].replace("", 0)

    df["debit"] = df["debit"].astype(float)
    df["credit"] = df["credit"].astype(float)
    df["balance"] = df["balance"].astype(float)

    return df