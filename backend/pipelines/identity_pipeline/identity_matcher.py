from difflib import SequenceMatcher


def match_identity(user_name, extracted_name):

    score = int(
        SequenceMatcher(
            None,
            user_name.lower(),
            extracted_name.lower()
        ).ratio() * 100
    )

    verified = score >= 80

    return verified, score
