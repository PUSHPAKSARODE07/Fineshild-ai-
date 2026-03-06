def classify_risk(score):

    if score > 0.7:
        return "HIGH"

    if score > 0.4:
        return "MEDIUM"

    return "LOW"