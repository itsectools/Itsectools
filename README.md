# ITSecTools - Security Validation Suite

A free, browser-based security testing platform for validating NGFW, DLP, IPS, and Threat Protection capabilities. No agents, no sign-ups, no data collection.

**Live:** [https://itsectools.com](https://itsectools.com)

## Features

### 1. NGFW Validation
- **IPS Signature Testing** — SQL Injection (UNION SELECT), Cross-Site Scripting (XSS cookie theft), and Directory Traversal attacks via HTTP query strings.
- **Advanced Evasion Techniques (AET)** — Log4j JNDI header injection, Hex/URL-encoded SQL injection, and Shellshock RCE in custom HTTP headers.
- **Command & Control (C2C) Beacon** — Encoded path traversal exfiltration, web shell beacons, and ActiveX dropper delivery via response-body inspection.
- **Run All Tests** — Execute IPS, AET, and C2C suites sequentially (9 total attacks) with configurable IP shun cooldown delay.
- **Network IP Flooder** — Fire 30 continuous IPS attack patterns (SQL injection, path traversal, encoded traversal, system file disclosure) in rapid succession with no delay. Each request uses a unique URL path and patterns are randomized (Fisher-Yates shuffle) each run. Includes mid-stream body termination detection — catches NGFW blocks that arrive after HTTP 200 headers.
- **IP Shun Cooldown Delay** — Configurable pause (1s / 6s / 15s / 30s) between IPS/AET/C2C suite attacks to avoid NGFW IP shunning. The Network IP Flooder runs without delay by design.
- **PDF Assessment Report** — Auto-generated scorecard with score gauge, per-category breakdown (IPS, Evasion, C2, Flood), gap analysis, and remediation recommendations.

### 2. MITRE ATT&CK Kill Chain Simulator
- **T1190 — Initial Access:** Apache Struts RCE (CVE-2017-5638) OGNL injection in Content-Type header.
- **T1059.004 — Execution:** ThinkPHP RCE (CVE-2018-20062) reverse shell download via URL path.
- **T1003.001 — Credential Access:** Pulse Secure VPN (CVE-2019-11510) arbitrary file reading for cached credentials.
- **T1048.003 — Exfiltration:** Shellshock (CVE-2014-6271) system file exfiltration via header injection.
- Sequential execution with 6s inter-stage delay to avoid IP shunning.
- **PDF Kill Chain Report** — Stage-by-stage visualization, risk assessment, and recommendations showing where the attack was stopped.

### 3. DLP Validator — 7-Step Workflow
- **Step 1: Download Test Files** — Generate DOCX/PDF/XLSX/CSV with 100+ rows of realistic PII (SSN, Driver License, Passport), PCI (Luhn-valid Visa/MC/Amex), or PHI (ICD-10 codes, prescriptions) data. Includes sensitivity-labeled files (Confidential, Internal, Public). Each download is dynamically generated to prevent static hash fingerprinting. Also validates proxy/inline DLP by testing whether your DLP engine intercepts and inspects file content during HTTPS transit.
- **Step 2: Evasive Payload Download** — Base64 encoding, renamed extensions (.docx→.jpg), AES-256 encrypted archives, nested ZIPs (1–10 layers for depth testing).
- **Step 3: Label & Classification Check** *(optional)* — Deep-scan documents for Microsoft Information Protection (MIP) labels from DOCX/XLSX ZIP archives, PDF metadata dictionaries, content-level DLP pattern matching, and MD5/SHA-256 hashing.
- **Step 4: Data Leakage Simulator** — Upload files over HTTP/HTTPS/FTP and send raw text POST payloads to test whether DLP blocks data in transit across all protocols. Detects and displays block status when a DLP agent intercepts browser uploads — the only free tool that distinguishes endpoint-level blocks from network/proxy blocks.
- **Step 5: Advanced DLP Tests** — Tests DLP detection of sensitive data inside deeply nested JSON structures used by AI agents (MCP), REST APIs, and GraphQL mutations. Server generates fresh PII/PCI/PHI data and wraps it at configurable nesting depth (2/4/6 levels).
- **Step 6: Generate & Share Report** — Auto-generated PDF scorecard with score gauge, protocol coverage matrix, data category breakdown, gap analysis, and actionable recommendations. Client-side generation — no data leaves the browser.
- **Step 7: DLP Regex Builder** — Build and translate DLP regex patterns across 10 vendor formats (Forcepoint, Symantec, Palo Alto, Zscaler, Netskope, Trellix, Fortinet, Microsoft Purview, Proofpoint).

### 4. Threat Protection Lab
- **EICAR Test Files** — Standard EICAR antivirus test file in multiple formats (.txt, .zip, .ps1).
- **Heuristic Malware Samples** — Files with malware-like signatures (Mimikatz strings, PowerShell cradles).
- **Ransomware Simulator** — Harmless scripts mimicking ransomware behavior (VBS, BAT, PS1).
- **OLE ActiveX Exploit** — CVE-2012-0158 MSCOMCTL.ListView buffer overflow in OLE compound file.
- **ANI Cursor Exploit** — CVE-2007-0038 RIFF/ACON animation header buffer overflow.

### 5. Network Pulse
- **Public IP Detection** — Identify your external IP address visible to servers.
- **Edge Server Identification** — Detect which CDN/cloud data center serves your requests.
- **Latency & Jitter** — Application-layer HTTP RTT measurement with variance tracking.
- **Packet Loss** — HTTP request failure rate monitoring.
- **Path MTU Discovery** — Binary search (576-1500 bytes) for maximum transmission unit.
- **AI Security Insights** — AI-generated posture assessment and recommendations.

## Prerequisites

- **SSL Decryption (DPI-SSL)** must be enabled on your firewall for the `itsectools.com` domain. Without decryption, the firewall cannot inspect HTTPS payloads.

## Disclaimer

This tool is for **educational and authorized security testing purposes only**. All attack simulations use industry-standard test patterns. No actual malware is distributed.
