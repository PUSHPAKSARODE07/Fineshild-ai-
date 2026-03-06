import re


def extract_name(text):

    lines = text.split("\n")

    for line in lines:
        if re.search(r"[A-Z]{3,}", line):
            return line.strip()

    return ""