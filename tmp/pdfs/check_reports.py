from pathlib import Path
import json
import pdfplumber
from pypdf import PdfReader

base = Path(__file__).parent
results = []
for name, marker in [('mission-portfolio-qa.pdf', 'END OF STUDENT PROGRAM'), ('mission-portfolio-long-code-qa.pdf', 'FINAL STUDENT LINE 182')]:
    reader = PdfReader(base / name)
    content = '\n'.join(page.extract_text() or '' for page in reader.pages)
    for expected in ['Student Mars Mission Portfolio', 'Mars Engineering Team', 'Mission design screenshot', 'Our Python rover program', marker, 'Placed equipment and obstacles']:
        assert expected in content, f'{name}: missing {expected}'
    images = sum(len(page.images) for page in reader.pages)
    assert images >= 1, f'{name}: missing design screenshot'
    outside = []
    with pdfplumber.open(base / name) as pdf:
        for index, page in enumerate(pdf.pages, 1):
            for char in page.chars:
                if char['text'].strip() and (char['x0'] < 40 or char['x1'] > page.width - 40 or char['top'] < 39 or char['bottom'] > page.height - 39):
                    outside.append((index, char['text'], round(char['x0'], 1), round(char['top'], 1)))
    assert not outside, f'{name}: content outside print margins: {outside[:8]}'
    results.append({'file': name, 'pages': len(reader.pages), 'embedded_images': images, 'final_code_line_present': True, 'content_within_print_margins': True})
assert results[1]['pages'] > results[0]['pages'], 'Long program must paginate.'
print(json.dumps(results, indent=2))
