# Threat Generation — Complete Guide

> **URL:** [itsectools.com/threat-protection](https://itsectools.com/threat-protection)

## Overview

Safe malware simulation for testing network and endpoint security solutions. All samples are **benign simulators** — no real malicious code is executed.

---

## Available Test Files

### EICAR Standard Test File
The industry-standard antivirus detection test. Every AV and endpoint security product should detect this.

| Format | Description |
|---|---|
| `.com` | Standard EICAR test file |
| `.txt` | EICAR string in plain text |
| `.zip` | EICAR file inside a ZIP archive |

### Heuristic Malware Simulator
Tests behavioral analysis engines — files that exhibit malware-like characteristics without being actually malicious.

| Format | Description |
|---|---|
| `.exe` | Executable with suspicious behavioral patterns |
| `.pdf` | PDF with embedded script-like content |
| `.doc` | Document with macro-like structures |

### Ransomware Simulator
Tests ransomware protection policies and behavioral detection.

| Format | Description |
|---|---|
| `.vbs` | VBScript that simulates ransomware behavior patterns |

---

## How to Use

1. Navigate to **Threat Gen** from the sidebar
2. Select the threat category (EICAR, Heuristic Malware, or Ransomware)
3. Click the download button for your desired format
4. Your endpoint security or network DLP should either block the download or quarantine the file

---

## What to Expect

- **Download blocked** → Your security solution detected the threat. ✅
- **File downloaded but quarantined** → Endpoint protection caught it post-download. ✅
- **File downloaded without alerts** → Your security solution may need tuning. ⚠️

---

## Related

- [NGFW Testing Guide](ngfw-testing.md)
- [Open Threat Gen →](https://itsectools.com/threat-protection)
