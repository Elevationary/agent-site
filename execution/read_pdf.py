import pypdf
import os

pdf_path = "docs/brand_identity/BrandGuide-Elevationary V2.pdf"

try:
    reader = pypdf.PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    print("PDF Text Extraction Successful:\n")
    print(text)
except Exception as e:
    print(f"Error reading PDF: {e}")
