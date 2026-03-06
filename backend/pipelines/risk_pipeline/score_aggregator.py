def aggregate_risk_scores(
        fraud_score,
        distress_score,
        identity_confidence):

    risk = (
        fraud_score * 0.5 +
        distress_score * 0.3 +
        (1 - identity_confidence) * 0.2
    )

    return round(risk, 3)