import re

with open('pdf_content.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix broken characters
text = text.replace('â€¢', '-')
text = text.replace('â€”', '-')

# Find the start of Phase 1 prompt
idx1 = text.find('Phase 1 - Project Setup')
idx2 = text.find('Phase 2 - Token Economy')

if idx1 != -1 and idx2 != -1:
    with open('actual_phase_1.txt', 'w', encoding='utf-8') as out:
        out.write(text[idx1:idx2])
print("Extracted Phase 1.")
