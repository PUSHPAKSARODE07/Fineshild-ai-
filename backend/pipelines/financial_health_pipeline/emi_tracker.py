import pandas as pd


def detect_faulty_emis(df):

    df["date"] = pd.to_datetime(df["date"])

    emis = df[
        df["description"]
        .str.contains("emi|loan", case=False, na=False)
    ].copy()

    if emis.empty:
        return {
            "emi_count": 0,
            "delayed_emis": 0,
            "emi_risk": 0
        }

    emis = emis.sort_values("date")
    emis["gap_days"] = emis["date"].diff().dt.days

    delayed = emis[emis["gap_days"] > 35]

    return {
        "emi_count": len(emis),
        "delayed_emis": len(delayed),
        "emi_risk": len(delayed) / len(emis)
    }