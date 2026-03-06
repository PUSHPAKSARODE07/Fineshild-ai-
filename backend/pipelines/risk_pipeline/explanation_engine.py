def generate_explanations(
        fraud,
        distress):

    reasons = []

    if fraud > 0.6:
        reasons.append("High fraud probability")

    if distress > 0.5:
        reasons.append(
            "Financial distress indicators detected"
        )

    if not reasons:
        reasons.append("Stable financial behaviour")

    return reasons