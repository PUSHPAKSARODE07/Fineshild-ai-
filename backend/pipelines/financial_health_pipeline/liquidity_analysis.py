def liquidity_stress(df):

    low_balance_days = df[df["balance"] < 1000]

    ratio = len(low_balance_days) / max(len(df), 1)

    return {
        "low_balance_frequency": ratio
    }