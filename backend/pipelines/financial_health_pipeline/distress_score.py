def compute_distress_score(
        emi_risk,
        overdraft_count,
        liquidity_ratio):

    score = (
        emi_risk * 0.4 +
        min(overdraft_count / 10, 1) * 0.35 +
        liquidity_ratio * 0.25
    )

    return round(score, 3)