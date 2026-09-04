# The Port — Pages ↔ DOCX ↔ PDF Converter

**The Port** is a high-precision, free document converter built for bi-directional document transitions between **Apple Pages (`.pages`)**, **Microsoft Word (`.docx`)**, and **Adobe PDF (`.pdf`)**.

---

## 🏛️ System Architecture

```text
Browser (Upload) ──► Backend API (Express + SQLite)
                            │
                            ├─ Enqueues conversion job (status: pending)
                            │
                            ▼
                      Mac Worker (Node daemon on MacBook Air)
                            │
                            ├─ GET /api/jobs/next (polls outbound)
                            ├─ Downloads source document
                            ├─ Executes ./convert.sh <input> <output>
                            │   ├─ AppleScript Pages.app (for .pages)
                            │   ├─ LibreOffice / pdf2docx (for docx ↔ pdf)
                            ├─ POST /api/jobs/:id/complete (uploads converted file)
                            ▼
                      Backend stores result ──► Browser polls & downloads
```

---

## ⚡ Quick Start

### 1. Start the Backend API Server
```bash
npm run server
```
*Runs on port `3001` with SQLite database, 25MB validation, and 24-hour auto-expiration cleanup.*

### 2. Start the Mac Worker Daemon
```bash
npm run worker
```
*Polls `http://localhost:3001/api/jobs/next` and processes conversions sequentially via `./convert.sh`.*

### 3. Start the Frontend UI
```bash
npm run dev
```
*Runs the Vite development server at `http://localhost:5173`.*

---

## 🎨 UI Concept: The Seam & The Gate

- **Paper Territory (Left / Top on mobile)**: DOCX/PDF print world — warm grid background, serif typography (`Fraunces`).
- **Glass Territory (Right / Bottom on mobile)**: Pages/iWork world — cool translucent base, rounded geometric sans (`Plus Jakarta Sans`).
- **The Gate**: Vertical rounded-capsule portal positioned on the seam. Dilates and glows **Transit Gold** (`#E8A23D`) during file crossing with a 600ms morph animation.
- **Below the Fold**: Minimal status strip with present-tense progress words and monospace download list.

---

## 🛠️ Standalone Bash Script (`./convert.sh`)

You can also run conversions directly from the terminal:

```bash
# Word to Apple Pages
./convert.sh document.docx document.pages

# Apple Pages to PDF
./convert.sh keynote.pages keynote.pdf

# Apple Pages to Word
./convert.sh keynote.pages keynote.docx

# PDF to Word
./convert.sh contract.pdf contract.docx

# Word to PDF
./convert.sh brief.docx brief.pdf

# PDF Compressor (-75% stream optimization)
./convert.sh oversized.pdf compressed.pdf

# PDF Splitter (extract pages to ZIP)
./convert.sh contract.pdf split_pages.zip

# PDF Rotate (90° clockwise)
./convert.sh scan.pdf rotated.pdf

# PDF Watermark
./convert.sh draft.pdf watermarked.pdf

# PDF Password Protect
./convert.sh financials.pdf protected.pdf

# PDF OCR (Searchable PDF)
./convert.sh scanned_invoice.pdf ocr_document.pdf
```

---

## 🧰 PDF & Utilities Engine (`media_pdf_engine.py`)

The high-performance PDF engine is powered by Python (`pikepdf`, `PyMuPDF`, `Pillow`, `ocrmypdf`):

- **Merge Multi-PDF**: Combines multiple PDF files into one clean document (`media_pdf_engine.py merge in1.pdf in2.pdf out.pdf`).
- **Split PDF**: Extracts individual pages into a ZIP archive (`media_pdf_engine.py split input.pdf output.zip`).
- **Rotate PDF**: Rotates PDF pages 90° clockwise with lossless page stream transforms (`media_pdf_engine.py rotate input.pdf output.pdf 90`).
- **Watermark PDF**: Embeds centered watermark overlay on all pages (`media_pdf_engine.py watermark input.pdf output.pdf "CONFIDENTIAL"`).
- **Password Protect / Unprotect**: 128-bit / 256-bit AES PDF security (`media_pdf_engine.py protect input.pdf output.pdf <password>`).
- **OCR Engine**: Converts scanned image PDFs into searchable vector PDFs.
  - *Optional OCR Dependency on macOS*: `brew install ocrmypdf` (PyMuPDF vector fallback is included automatically if CLI is not present).

---

## 🛡️ Key Guarantees
- **Hybrid Concurrency Engine**: Guaranteed sequential execution for Apple GUI apps (Pages/Keynote/Numbers) paired with 3x parallel throughput for non-Apple formats (DOCX/PDF/XLSX/PPTX/Images).
- **24-Hour Auto-Expiration**: Cron routine automatically purges uploads, outputs, and database records older than 24 hours.
- **Outward Polling**: No port-forwarding or public IP required on the Mac worker.
