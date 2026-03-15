# DLP Validator — Complete Guide

> **URL:** [itsectools.com/dlp](https://itsectools.com/dlp)

## Overview

The DLP Validator lets you test your Data Loss Prevention policies across every channel — file uploads, downloads, inline text, evasion payloads, classification labels, and vendor-specific regex patterns.

---

## 1. File Upload Testing (HTTP / HTTPS / FTP)

Upload any file through three different protocols to test whether your DLP solution inspects traffic across all channels.

**How to use:**
1. Navigate to **DLP Validator** → **Upload** tab
2. Select your file using the file picker
3. Choose a protocol: **HTTP** (port 80), **HTTPS** (port 443), or **FTP** (port 21)
4. Click the upload button for your chosen protocol
5. Check the result — if your DLP blocks the upload, you'll see a blocked status

> 💡 **Tip:** Use the Download tab to generate test files containing realistic sensitive data so you're testing with dynamic content, not static hash-matched samples.

---

## 2. Download Test Documents

Generate dynamic documents with realistic sensitive data for DLP testing. Each download creates a unique file — preventing static hash fingerprinting.

**Available data types:**
- **PII** — Social Security Numbers, names, addresses, phone numbers, dates of birth
- **PCI** — Credit card numbers (Visa, MasterCard, Amex), CVVs, expiration dates
- **PHI** — Medical record numbers, patient names, diagnosis codes, treatment records

**Available formats:** `PDF` · `DOCX` · `XLSX` · `CSV`

---

## 3. Raw Text POST

Paste or type text containing sensitive data and send it as a raw HTTP or HTTPS POST request. Tests whether your DLP scans inline text — not just file attachments.
By selecting **HTTP**, the platform proxies the payload unencrypted over Port 80, ensuring inline network firewalls can inspect the egress traffic.

**How to use:**
1. Switch to the **Text POST** tab
2. Enter text containing sensitive data (e.g., `SSN: 123-45-6789`)
3. Select your protocol (HTTP or HTTPS) and click **Send POST**
4. If your DLP inspects data-in-motion exfiltration, it should detect and block the request

---

## 4. File Metadata & Label Checker

Upload any document to deep-scan for sensitivity labels, classification markings, content-level DLP patterns, and file integrity hashes.

**Detection methods:**
- **DOCX/XLSX Label Extraction** — Reads MIP labels from `docProps/custom.xml` inside the ZIP archive (Confidential, Internal, Public, Top Secret)
- **PDF Metadata Scanning** — Extracts classification properties from PDF metadata dictionaries
- **Content-Level DLP Matching** — Scans for PII (SSN), PCI (credit cards), keyword-based classification
- **File Hashing** — MD5 and SHA-256 for verification and threat intelligence lookups

**Color-coded results:**
- 🔴 Red — Confidential / Secret / Top Secret
- 🔵 Blue — Internal / Restricted
- 🟢 Green — Public / Unclassified

---

## 5. Endpoint DLP Agent Detection *(Unique)*

ITSecTools is the **only free DLP testing tool** that detects and reports when an Endpoint DLP agent blocks file uploads at the browser level — even when DLP is configured in inline/proxy mode. When an endpoint agent intercepts the upload, ITSecTools displays a clear message identifying it as an endpoint-level block rather than a network/proxy block.

**Why this matters:**
- Most DLP testing tools silently fail or show generic "upload failed" errors — they cannot tell you **why** or **where** the block occurred
- ITSecTools clearly differentiates between **endpoint DLP blocks** and **network/proxy DLP blocks**
- Helps security teams confirm their endpoint agent is actively enforcing policies, even alongside network-based DLP
- Compatible with **Forcepoint DLP**, **Symantec Endpoint DLP**, and other endpoint agents

> 💡 No other free DLP testing tool (including DLPTest.com) offers this visibility.

---

## 6. Proxy Mode DLP Validation

ITSecTools validates DLP configured in proxy/inline mode by generating documents with embedded PII, PCI, and PHI data and downloading them over HTTPS. This tests whether your DLP engine can intercept and inspect file content during transit.

**Supported formats:** `CSV` · `XLSX` · `DOCX` · `PDF`

Each download is dynamically generated with fresh data to prevent static hash fingerprinting. If your proxy DLP blocks the download, it confirms the engine is performing real-time content inspection on that file format.

---

## 7. DLP Test Data Generator

Generate real test files that challenge your DLP engine's inspection depth.

| Payload | Description |
|---|---|
| **Renamed Extensions** | Valid DOCX saved as `.jpg`/`.png` — tests magic number detection |
| **Base64 Encoding** | Obfuscates sensitive text — tests inline Base64 decoding |
| **Password-Protected ZIP** | AES-encrypted archives — tests fail-close vs. fail-open |
| **Nested Archives** | 1–10 ZIP layers — tests maximum extraction depth |

---

## Related

- [DLP Regex Builder Guide](regex-engine.md)
- [Open DLP Validator →](https://itsectools.com/dlp)
