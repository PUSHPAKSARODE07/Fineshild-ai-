from .emi_tracker import detect_faulty_emis
from .overdraft_detector import detect_overdrafts
from .liquidity_analysis import liquidity_stress
from .distress_score import compute_distress_score


def run_financial_health_analysis(df):

    emi = detect_faulty_emis(df)
    overdraft = detect_overdrafts(df)
    liquidity = liquidity_stress(df)

    distress = compute_distress_score(
        emi["emi_risk"],
        overdraft["overdraft_count"],
        liquidity["low_balance_frequency"]
    )

    return {
        "emi_analysis": emi,
        "overdraft_analysis": overdraft,
        "liquidity_analysis": liquidity,
        "financial_distress_score": distress
    }