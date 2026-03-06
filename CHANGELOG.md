# Changelog

All notable changes to ITSecTools are documented here.

## [1.2.0] — 2026-02

### Added
- **Regex Engine Tools** — Build and translate DLP regex patterns across 10 vendor engines (Forcepoint, Symantec, Palo Alto, Zscaler, Netskope, Trellix, Fortinet, Microsoft Purview, Proofpoint)
- **Regex Creator** with 27 match types and auto-analysis
- **Regex Translator & Tester** with vendor-specific syntax translation and failure diagnostics
- **File Label Identifier** — Deep-scans DOCX/XLSX for MIP classification labels, PDF metadata scanning, content-level PII/PCI/PHI detection
- **Advanced Payload Generator** — Renamed file extensions, Base64 encoder/decoder, password-protected ZIP (AES), nested archives (1–10 layers)
- File hashing (MD5, SHA-256) for integrity verification
- Color-coded classification results (Confidential/Internal/Public)
- Help Center with detailed guides for every tool
- FAQ schema (JSON-LD) for DLP, NGFW, MITRE, and Network Pulse pages

### Improved
- Enhanced SEO metadata across all pages
- AI discoverability via `llms.txt` and structured data

## [1.1.0] — 2026-01

### Added
- **MITRE ATT&CK Kill Chain Simulator** — 4-phase sequential attack (T1190, T1059.001, T1003.001, T1048.003)
- **Network Pulse** — Public IP detection, edge server geolocation, latency, jitter, packet loss, PMTU discovery, AI Security Insights
- **NGFW C2C Beacon Testing** — OOB data exfiltration, web shell beacon, Python stager download
- **Advanced Evasion Techniques** — Log4j JNDI, hex-encoded SQLi, Shellshock RCE

### Improved
- Console output with color-coded real-time logging
- MITRE test payloads updated to trigger IPS signatures via backend service

## [1.0.0] — 2025-12

### Initial Release
- **DLP Validator** — File upload testing (HTTP, HTTPS, FTP), data download (PII, PCI, PHI in PDF, DOCX, XLSX, CSV), raw text POST simulation
- **NGFW Tests** — IPS signature testing (SQLi, XSS, Path Traversal)
- **Threat Gen** — EICAR test files, heuristic malware simulators, ransomware behaviour scripts
- Sidebar navigation with all tools
- Privacy-first architecture — no data stored
