# DLP Validator — Complete Guide

> **URL:** [itsectools.com/dlp](https://itsectools.com/dlp)

## Overview

The DLP Validator lets you test your Data Loss Prevention policies across every channel — file downloads, uploads, inline text, evasion payloads, classification labels, nested JSON exfiltration, and vendor-specific regex patterns. Follow the 7-step workflow below to fully validate your DLP policy.

**Recommended testing flow:** ① Download Test Files → ② Evasive Payload Download → ③ Label & Classification Check (optional) → ④ Data Leakage Simulator → ⑤ Advanced DLP Tests → ⑥ Generate & Share Report → ⑦ DLP Regex Builder

---

## 1. Download Test Files

Generate dynamic documents with realistic compliance test data patterns for DLP testing. Each payload creates a unique file — preventing static hash fingerprinting from bypassing your DLP.

**Available data types:**
- **PII (Personally Identifiable Information)** — Social Security Numbers, names, addresses, phone numbers, dates of birth.
- **PCI (Payment Card Industry)** — Credit card numbers (Visa, MasterCard, Amex), CVVs, expiration dates, cardholder names.
- **PHI (Protected Health Information)** — Medical record numbers, patient names, diagnosis codes, treatment records.
- **Sensitivity-Labeled Files** — DOCX/XLSX with embedded MIP labels (Confidential, Internal, Public) for testing label-aware DLP policies.

**Available formats:** `PDF` · `DOCX` · `XLSX` · `CSV`

> **🔍 Proxy Mode DLP Validation**
> Downloads are generated with embedded PII, PCI, and PHI data over HTTPS. This tests whether your DLP engine can intercept and inspect file content during transit — not just at the endpoint level.
> - **CSV** — Plain text. Easily parseable by all DLP engines.
> - **XLSX** — XML-based spreadsheet inside a ZIP archive. Most DLP engines parse this reliably.
> - **DOCX** — OOXML ZIP archive. DLP must decompress and parse `word/document.xml`.
> - **PDF** — Binary format with compressed content streams. Requires deep PDF parsing by the DLP engine.

> 💡 **Next Step:** Once downloaded, use the file in **Step 4 — Data Leakage Simulator** to test if your DLP blocks the upload.

---

## 2. Evasive Payload Download

Generate real test files that challenge your DLP engine's inspection depth using common evasion techniques. These are actual downloadable files — not simulated traffic — designed to test how deeply your DLP inspects content.

| Payload | Description |
|---|---|
| **Renamed Extensions** | Valid DOCX saved as `.jpg`/`.png` — tests magic number detection |
| **Base64 Encoding** | Obfuscates sensitive text — tests inline Base64 decoding |
| **Password-Protected ZIP** | AES-256 encrypted archives — tests fail-close vs. fail-open |
| **Nested Archives** | 1–10 ZIP layers — tests maximum extraction depth |

---

## 3. Label & Classification Check *(optional)*

Upload any document to deep-scan it for sensitivity labels, classification markings, content-level DLP patterns, and file integrity hashes. Use this to verify that files downloaded in Step 1 have the correct sensitivity labels embedded before running upload tests.

**Detection methods:**
- **DOCX/XLSX Label Extraction** — Reads MIP labels from `docProps/custom.xml` inside the ZIP archive (Confidential, Internal, Public, Top Secret).
- **PDF Metadata Scanning** — Extracts Classification and Label properties from PDF metadata dictionaries using raw binary parsing.
- **Content-Level DLP Matching** — Scans file content for PII patterns (SSN), PCI data (credit card numbers), and keyword-based classification markers.
- **File Integrity Hashing** — Computes MD5 and SHA-256 hashes for verification and threat intelligence lookups.

**Color-coded results:**
- 🔴 Red — Confidential / Secret / Top Secret
- 🔵 Blue — Internal / Restricted
- 🟢 Green — Public / Unclassified

---

## 4. Data Leakage Simulator

Upload files and send raw text payloads through HTTP, HTTPS, and FTP to verify whether your DLP solution inspects and blocks data in transit across all protocols.

### File Upload Test

**How to use:**
1. Navigate to **DLP Validator** → **Data Leakage Simulator** tab.
2. Select your file using the file picker (use files from Step 1 or Step 2).
3. Choose a protocol: **HTTP** (port 80), **HTTPS** (port 443), or **FTP** (port 21).
4. Click the upload button for your chosen protocol.
5. Check the result — a blocked status confirms your DLP is inspecting traffic on that channel.

### Raw Text POST Test

Sends inline sensitive text (SSN, credit card numbers) via HTTP or HTTPS POST — without a file wrapper. Tests whether your DLP scans data-in-motion, not just file attachments.

1. Select the **Text POST** option within the Data Leakage Simulator tab.
2. Enter or paste text containing sensitive data (e.g., `SSN: 123-45-6789`).
3. Click **Send POST** — if your DLP inspects inline traffic, it should detect and block the request.

### Detect & Display Block Status When DLP Agent Intercepts Browser Upload

ITSecTools is the only free tool that detects when an Endpoint DLP agent (Forcepoint, Symantec) blocks an upload at the browser level — before data even leaves the machine. It clearly distinguishes endpoint-level blocks from network/proxy DLP blocks with an actionable message:

```
BLOCKED: HTTP Upload intercepted by Endpoint DLP agent before data reached the browser.
```

> 💡 No other free DLP testing tool (including DLPTest.com) offers this visibility.

---

## 5. Advanced DLP Tests

Tests whether your DLP can detect sensitive data buried inside deeply nested JSON structures — the same format used by AI agents (MCP), REST APIs, and GraphQL mutations. Sensitive data is generated server-side and wrapped at configurable nesting depths, requiring the DLP engine to parse JSON to find it.

**How to use:**
1. Navigate to **DLP Validator** → **Advanced DLP Tests** tab.
2. Select **Data Type** (PII, PCI, or PHI).
3. Select **Nesting Depth** (2, 4, or 6 levels deep) — deeper nesting is harder for DLP to parse.
4. Select **Protocol** (HTTP or HTTPS).
5. Click **Send Nested JSON Test** and review the JSON preview to see the exact payload sent.

**What it tests:**
- **JSON parsing depth** — Can your DLP find an SSN buried 4–6 levels deep inside a JSON object?
- **Content-Type awareness** — Does your DLP inspect `application/json` payloads, or only form data?
- **API/AI exfiltration** — MCP, REST APIs, and GraphQL transmit data in nested JSON. Can your DLP detect leakage through these channels?

**Results:**
- **LEAKED** — DLP failed to detect the sensitive data inside the nested JSON.
- **BLOCKED** — DLP detected and blocked the sensitive data inside the JSON payload.

---

## 6. Generate & Share Report

After running tests in Steps 4 and 5, the **Generate Report** button becomes active automatically. Click it to download a branded PDF scorecard with a score gauge, protocol coverage matrix, detailed test results, gap analysis, and actionable recommendations. The report is generated entirely client-side — no data leaves your browser.

**What the report includes:**
- **Score gauge** — visual percentage showing how many tests were blocked vs. leaked.
- **Protocol coverage bars** — per-protocol breakdown (HTTP, HTTPS, FTP, MCP) showing blocked/total.
- **Test details table** — every test with timestamp, protocol, file/content, and result.
- **Gaps identified** — automatically detected weaknesses based on test results.
- **Recommendations** — actionable steps to close the identified gaps.

> 💡 **Tip:** Share the PDF report with your security team or stakeholders to document DLP coverage gaps and track remediation progress over time.

---

## 7. DLP Regex Builder

Use test results from Steps 4 and 5 to identify regex gaps, then build or translate vendor-optimized patterns here. Supports 10 DLP vendor engines — build from a sample string or translate an existing pattern.

### Regex Creator

1. Navigate to **DLP Validator** → **DLP Regex Builder** tab, then select **Regex Creator**.
2. Enter a **sample text** (e.g., `MRN:1234567`).
3. Click **Analyze** — the tool auto-detects each segment's type (letters, digits, separator, etc.).
4. Refine each segment's **match type** and **quantity** as needed.
5. Select your **target DLP vendor** and click **Generate Regex**.
6. Optionally enter a **test string** and click **Test** to validate the pattern.

### Regex Translator

1. Select **Regex Translator** within the DLP Regex Builder tab.
2. Paste your **existing regex pattern** into the input field.
3. Select your **target DLP vendor**.
4. Optionally enter a **test string** to validate the translated pattern.
5. Click **Translate & Test** — the tool outputs the vendor-optimized regex.

**Supported DLP Vendors:** Forcepoint DLP · Forcepoint DSPM · Symantec (Broadcom) · Palo Alto Networks · Zscaler · Netskope · Trellix DLP · Fortinet · Microsoft Purview · Proofpoint

---

## Related

- [DLP Regex Builder Guide](regex-engine.md)
- [Open DLP Validator →](https://itsectools.com/dlp)
