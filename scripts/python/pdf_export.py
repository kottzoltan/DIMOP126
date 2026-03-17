#!/usr/bin/env python3
"""Convert XLSX to PDF using LibreOffice headless."""
import subprocess
import sys
import os


def convert_to_pdf(xlsx_path: str, out_dir: str | None = None) -> str:
    """
    Convert xlsx to pdf. Returns path to created pdf.
    """
    if not os.path.isfile(xlsx_path):
        raise FileNotFoundError(f"Workbook not found: {xlsx_path}")
    if out_dir is None:
        out_dir = os.path.dirname(xlsx_path)
    out_dir = os.path.abspath(out_dir)
    result = subprocess.run(
        ["soffice", "--headless", "--convert-to", "pdf", "--outdir", out_dir, xlsx_path],
        capture_output=True,
        text=True,
        timeout=60,
    )
    if result.returncode != 0:
        raise RuntimeError(f"LibreOffice convert failed: {result.stderr}")
    base = os.path.splitext(os.path.basename(xlsx_path))[0]
    pdf_path = os.path.join(out_dir, f"{base}.pdf")
    if not os.path.isfile(pdf_path):
        raise RuntimeError(f"PDF was not created: {pdf_path}")
    return pdf_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: pdf_export.py <xlsx_path> [out_dir]")
        sys.exit(1)
    xlsx = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else None
    try:
        p = convert_to_pdf(xlsx, out)
        print(p)
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)
