import pytesseract
from PIL import Image
import re


# ===============================
# SET TESSERACT PATH (WINDOWS)
# ===============================

pytesseract.pytesseract.tesseract_cmd = \
r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# ===============================
# IMAGE OCR EXTRACTION
# ===============================

def extract_text(image_path: str):

    image = Image.open(image_path)

    text = pytesseract.image_to_string(image)

    return text


# ===============================
# NAME EXTRACTION LOGIC
# ===============================

def extract_name(ocr_text: str):

    lines = ocr_text.split("\n")

    cleaned_lines = [
        line.strip()
        for line in lines
        if len(line.strip()) > 3
    ]

    # Simple heuristic:
    # Name usually uppercase & alphabetic
    for line in cleaned_lines:

        if re.match(r"^[A-Z ]+$", line):
            if 3 < len(line) < 40:
                return line.title()

    return "Unknown"


# ===============================
# MAIN OCR PIPELINE
# ===============================

def run_ocr_pipeline(image_path: str):

    text = extract_text(image_path)

    name = extract_name(text)

    return {
        "extracted_name": name,
        "raw_text": text
    }