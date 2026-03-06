<div align="center">

# 🔒 ITSecTools

### Free IT Security Validation Suite

**Test your DLP, NGFW, IPS, and MITRE ATT&CK defences — all from your browser.**

[![Website](https://img.shields.io/badge/Website-itsectools.com-0EC7A8?style=for-the-badge&logo=google-chrome&logoColor=white)](https://itsectools.com)
[![Free](https://img.shields.io/badge/Cost-Free-16A34A?style=for-the-badge)](https://itsectools.com)
[![No Login](https://img.shields.io/badge/Login-Not%20Required-3B82F6?style=for-the-badge)](https://itsectools.com)
[![Browser Based](https://img.shields.io/badge/Install-None-6366F1?style=for-the-badge)](https://itsectools.com)

</div>

---

## What is ITSecTools?

ITSecTools is a free, browser-based security validation toolkit that lets you test whether your security controls are actually working — DLP policies, firewall rules, IPS signatures, and complete MITRE ATT&CK kill chains. No installation, no login, no data stored.

**🌐 Try it now → [itsectools.com](https://itsectools.com)**

---

## Features

| Tool | What It Does | Link |
|---|---|---|
| ⚡ **DLP Validator** | Multi-protocol file testing, evasion payloads, file label scanning | [Open →](https://itsectools.com/dlp) |
| 🧠 **Regex Engine Tools** | Build & translate DLP regex across 10 vendor engines | [Open →](https://itsectools.com/dlp) |
| 🔥 **NGFW Validation** | IPS signature testing, advanced evasion, C2C beacon simulation | [Open →](https://itsectools.com/ngfw) |
| 🎯 **MITRE ATT&CK Simulator** | 4-phase sequential kill chain execution | [Open →](https://itsectools.com/mitre) |
| 🛡 **Threat Gen** | EICAR, heuristic malware, ransomware test files | [Open →](https://itsectools.com/threat-protection) |
| 📡 **Network Pulse** | Latency, jitter, packet loss, PMTU, AI security insights | [Open →](https://itsectools.com/network-pulse) |

---

## ⚡ DLP Validator

The most comprehensive free DLP testing tool available. Test your data loss prevention policies across every channel and evasion technique.

### File Transfer Testing
- Upload files over **HTTP** (port 80), **HTTPS** (port 443), and **FTP** (port 21) — all from the browser
- Download dynamically generated test files containing **PII, PCI, and PHI** data in **PDF, DOCX, XLSX, CSV**
- Every file is unique — prevents static hash fingerprinting
- **HTTP/S POST Simulation** for testing inline text inspection

### File Label Identifier & Classification Checker
- **DOCX/XLSX** — Parses ZIP archive structure to extract MIP classification labels from `docProps/custom.xml`
- **PDF** — Reads classification properties from PDF metadata dictionaries
- **Content-Level DLP** — Scans for PII (SSN), PCI (credit cards), keyword-based classification
- **File Hashing** — MD5 and SHA-256 for integrity verification
- Color-coded results: 🔴 Confidential/Secret · 🔵 Internal/Restricted · 🟢 Public

### Advanced Payload Generator (Evasion Testing)
| Payload Type | What It Tests |
|---|---|
| **Renamed File Extensions** | Valid DOCX saved as `.jpg`/`.png` — tests true file typing (magic number detection) |
| **Base64 Encoder/Decoder** | Obfuscated sensitive strings — tests inline Base64 decoding |
| **Password-Protected ZIP** | AES-encrypted archives — tests fail-close vs. fail-open policies |
| **Nested Archives** | 1–10 layers of ZIP compression — tests maximum extraction depth |

---

## 🧠 Regex Engine Tools

Build and translate DLP regex patterns across 10 vendor engines.

### Regex Creator
- Paste sample data → auto-analyze into segments → customize 27 match types → generate vendor-optimized regex
- Plain English explanation of every generated pattern

### Regex Translator & Tester
- Translate any regex across vendor-specific syntax (PCRE, RE2, Java, cloud-native)
- Instant match testing with failure diagnostics that pinpoint exactly which token broke

### Supported DLP Vendors

| Vendor | Engine |
|---|---|
| Forcepoint DLP | PCRE |
| Forcepoint DSPM | Cloud |
| Symantec DLP (Broadcom) | Custom |
| Palo Alto Networks | RE2 |
| Zscaler | RE2 |
| Netskope | RE2 |
| Trellix DLP | Java |
| Fortinet | PCRE |
| Microsoft Purview | .NET |
| Proofpoint | Smart Identifiers |

---

## 🔥 NGFW Validation

Test your Next-Generation Firewall with real attack payloads.

> ⚠️ **Prerequisite:** SSL Decryption (DPI-SSL) must be enabled for `itsectools.com` — without it, the firewall can't inspect the encrypted payloads.

### IPS Signature Testing
- **SQL Injection (SQLi)** — `' OR 1=1; --` in HTTP query strings
- **Cross-Site Scripting (XSS)** — `<script>alert(1)</script>` injection
- **Directory Traversal** — `../../etc/passwd` path traversal

### Advanced Evasion Techniques (AET)
- **Log4j JNDI Injection** — `${jndi:ldap://...}` in HTTP headers (CVE-2021-44228)
- **Hex-Encoded SQLi** — SQL injection entirely in URL encoding
- **Shellshock RCE** — Bash function injection in custom headers (CVE-2014-6271)

### Command & Control (C2C) Beacon
- **OOB Data Exfiltration** — `/etc/passwd` in outbound query parameters
- **Web Shell Beacon** — Linux enumeration commands to external server
- **Python Reverse Shell Stager** — Malware payload fetch with Python user-agent

---

## 🎯 MITRE ATT&CK Simulator

Execute a 4-phase sequential kill chain mapped to the MITRE ATT&CK framework. One click runs all stages — if your controls break the chain at any point, the attacker fails.

| Stage | MITRE ID | Technique | What It Simulates |
|---|---|---|---|
| 1️⃣ Initial Access | T1190 | Exploit Public-Facing Application | Log4j JNDI/LDAP payload in HTTP headers |
| 2️⃣ Execution | T1059.001 | PowerShell | Download cradle attempting to fetch malicious .ps1 |
| 3️⃣ Credential Access | T1003.001 | OS Credential Dumping | Mimikatz strings transmitted over the wire |
| 4️⃣ Exfiltration | T1048.003 | Exfiltration Over Unencrypted Protocol | Cleartext data extraction via query strings |

---

## 🛡 Threat Gen

Safe malware simulation for testing endpoint and network security solutions.

| File Type | Description | Extensions |
|---|---|---|
| **EICAR Standard Test** | Industry-standard antivirus detection test | `.com`, `.txt`, `.zip` |
| **Heuristic Malware** | Tests behavioral analysis engines | `.exe`, `.pdf`, `.doc` |
| **Ransomware Simulator** | Tests ransomware protection policies | `.vbs` |

All samples are **benign simulators** — no real malicious code is executed.

---

## 📡 Network Pulse

Real-time network telemetry and security analysis.

- **Public IP Detection** — Shows your external IP address
- **Nearest Edge Server** — Identifies your closest CDN/edge node
- **Latency (RTT)** — Round-trip time measurement
- **Jitter** — Latency variance analysis
- **Packet Loss** — Connection reliability measurement
- **PMTU Discovery** — Binary search path MTU detection
- **Connection Quality Score** — Overall network health grade
- **AI Security Insights** — Automated security recommendations based on telemetry

---

## Privacy & Safety

| Principle | Details |
|---|---|
| **Free** | All tools, no limits, no subscription |
| **No Login** | No account creation required |
| **No Data Stored** | Files and data are never stored, logged, or transmitted to third parties |
| **Ephemeral Processing** | Analysis occurs locally in the browser or via stateless serverless functions |
| **Safe Simulation** | All threat samples are benign simulators designed for detection testing only |

---

## Documentation

- [DLP Validator Guide](docs/dlp-validator.md)
- [NGFW Testing Guide](docs/ngfw-testing.md)
- [MITRE ATT&CK Guide](docs/mitre-attack.md)
- [Threat Generation Guide](docs/threat-generation.md)
- [Network Pulse Guide](docs/network-pulse.md)
- [Regex Engine Tools Guide](docs/regex-engine.md)

---

## Comparisons

- [ITSecTools vs DLPTest.com](comparisons/vs-dlptest.md)
- [Best Free NGFW & Firewall Testing Tools](comparisons/vs-ngfw-tools.md)
- [Best Free Web Security Testing Tools](comparisons/vs-web-security-tools.md)

---

## Links

- 🌐 **Website:** [itsectools.com](https://itsectools.com)
- 📖 **Help Center:** [itsectools.com/help](https://itsectools.com/help)
- 📧 **Contact:** [itsectools.com/contact](https://itsectools.com/contact)
- 🎥 **YouTube:** [@ITSecTools](https://www.youtube.com/@ITSecTools)
- 💼 **LinkedIn:** [ITSecTools](https://www.linkedin.com/company/itsectools)

---

<div align="center">

**Built for security professionals. Free for everyone.**

[Try ITSecTools →](https://itsectools.com)

</div>
