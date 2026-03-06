import os


# =====================================
# APP SECURITY CONFIG
# =====================================

SECRET_KEY = "finshield-super-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24


# =====================================
# PROJECT ROOT
# =====================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )
)


# =====================================
# UPLOAD DIRECTORIES
# =====================================

UPLOAD_DIR = os.path.join(
    BASE_DIR,
    "backend",
    "uploads"
)

GOV_ID_UPLOAD = os.path.join(
    UPLOAD_DIR,
    "government_ids"
)

STATEMENT_UPLOAD = os.path.join(
    UPLOAD_DIR,
    "bank_statements"
)


# =====================================
# ML MODEL CONFIG
# =====================================

MODEL_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "models",
    "finshield_model.pkl"
)


# =====================================
# DATABASE CONFIG
# =====================================

DATABASE_URL = "sqlite:///./finshield.db"


# =====================================
# ANALYSIS CONFIG
# =====================================

FRAUD_WEIGHT = 0.6
FINANCIAL_HEALTH_WEIGHT = 0.4


# =====================================
# OCR CONFIG
# =====================================

TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"