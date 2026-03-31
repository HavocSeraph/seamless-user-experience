import re

with open('pdf_content.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Try to find headers like "Phase 1 " or similar
sections = re.split(r'(?=Phase \d+ [^\n]+)', text)

for i, section in enumerate(sections):
    if section.strip().startswith('Phase'):
        with open(f'phase_{i}.txt', 'w', encoding='utf-8') as out:
            out.write(section.strip())
