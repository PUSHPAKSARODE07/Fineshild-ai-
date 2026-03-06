from .score_aggregator import aggregate_risk_scores
from .risk_level import classify_risk
from .explanation_engine import generate_explanations


def run_risk_pipeline(
        fraud_result,
        health_result,
        identity_result):

    fraud_score = fraud_result["fraud_score"]

    distress_score = \
        health_result["financial_distress_score"]

    identity_confidence = \
        identity_result["confidence"]

    final_score = aggregate_risk_scores(
        fraud_score,
        distress_score,
        identity_confidence
    )

    level = classify_risk(final_score)

    explanation = generate_explanations(
        fraud_score,
        distress_score
    )

    return {
        "final_risk_score": final_score,
        "risk_level": level,
        "explanations": explanation
    }