def detect_overdrafts(df):

    overdrafts = df[df["balance"] < 0]

    if overdrafts.empty:
        return {
            "overdraft_count": 0,
            "max_negative_balance": 0
        }

    return {
        "overdraft_count": len(overdrafts),
        "max_negative_balance":
            abs(overdrafts["balance"].min())
    }