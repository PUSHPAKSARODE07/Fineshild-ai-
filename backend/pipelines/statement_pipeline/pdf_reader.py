import pdfplumber


def read_pdf_tables(pdf_path):

    tables = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            table = page.extract_table()
            if table:
                tables.extend(table[1:])

    return tables