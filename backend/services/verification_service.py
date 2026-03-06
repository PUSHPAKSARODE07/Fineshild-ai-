from backend.pipelines.identity_pipeline.\
verification_pipeline import \
run_identity_verification


def verify_identity(image_path, user_name):

    result = run_identity_verification(
        image_path,
        user_name
    )

    return result