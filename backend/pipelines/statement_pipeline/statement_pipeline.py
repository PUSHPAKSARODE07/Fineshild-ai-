from .pdf_reader import read_pdf_tables
from .transaction_extractor import extract_transactions
from .cleaner import clean_transactions
from .normalizer import normalize_dates
from .structurer import structure_transactions


def run_statement_pipeline(pdf_path):

    rows = read_pdf_tables(pdf_path)

    df = extract_transactions(rows)

    df = clean_transactions(df)

    df = normalize_dates(df)

    df = structure_transactions(df)

    return df