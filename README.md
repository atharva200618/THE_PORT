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
```

---

## 🛡️ Key Guarantees
- **Sequential Mac Worker Processing**: Guaranteed 1-job-at-a-time concurrency for rock-solid Apple Pages GUI automation.
- **24-Hour Auto-Expiration**: Cron routine automatically purges uploads, outputs, and database records older than 24 hours.
- **Outward Polling**: No port-forwarding or public IP required on the Mac worker.
