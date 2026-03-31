import re

with open('pdf_content.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import sys
text = text.replace('\xa0', ' ').replace('\u2014', '-').replace('\u2022', '-')

# lets just dump the whole text and let me read it properly
with open('cleaned_pdf.txt', 'w', encoding='utf-8') as f:
    f.write(text)

