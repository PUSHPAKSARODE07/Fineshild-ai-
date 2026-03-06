from .ocr_engine import extract_text
from .name_extractor import extract_name
from .identity_matcher import match_identity
from .confidence_score import compute_confidence


def run_identity_verification(
        image_path,
        user_name):

    text = extract_text(image_path)

    extracted_name = extract_name(text)

    verified, score = match_identity(
        user_name,
        extracted_name
    )

    confidence = compute_confidence(score)

    return {
        "verified": verified,
        "confidence": confidence,
        "extracted_name": extracted_name
    }