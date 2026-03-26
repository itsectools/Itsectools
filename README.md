# ITSecTools — Free Security Validation Suite

A free, browser-based security testing platform for validating DLP, NGFW, IPS, and Threat Protection capabilities. No agents, no sign-ups, no data collection.

**🔗 Live Tool:** [https://itsectools.com](https://itsectools.com)

---

## What Is ITSecTools?

ITSecTools helps security engineers, SOC analysts, and compliance auditors validate their security controls directly from the browser. Upload sensitive files, run attack simulations, test DLP policies, and generate professional PDF reports — all free, with zero data stored.

---

## Features

### 🛡 DLP Validator
Test your Data Loss Prevention solution across multiple protocols and attack vectors.

- **Multi-Protocol Testing** — Upload files over HTTP, HTTPS, and FTP to verify DLP inspection across all egress channels.
- **Advanced DLP Tests — MCP Protocol Testing** *(Unique — no competitor offers this)* — Test whether your DLP can detect sensitive data (PII, PCI, PHI) buried inside nested JSON-RPC payloads at configurable depths (2, 4, or 6 levels). This is the same structure used by MCP (Model Context Protocol) — the protocol AI agents use to communicate with external tools. Most DLP engines only scan flat text — this test reveals the gap.
- **Endpoint DLP Agent Detection** *(Unique)* — The only free tool that detects and reports when an Endpoint DLP agent (Forcepoint, Symantec) blocks uploads at the browser level — distinguishing endpoint vs. network/proxy blocks.
- **Dynamic Document Generation** — Fresh PII/PCI/PHI data in PDF, DOCX, XLSX, CSV formats. Each download is unique to prevent static hash fingerprinting.
- **DLP Regex Builder & Translator** — Build and translate regex patterns across 10 vendor engines: Forcepoint, Symantec, Palo Alto, Zscaler, Netskope, Trellix, Fortinet, Microsoft Purview, Proofpoint.
- **Evasion Payloads** — Base64 encoding, renamed extensions, AES-256 encrypted archives, nested ZIPs.
- **File Label Identifier** — Deep-scan DOCX/XLSX/PDF for Microsoft Information Protection (MIP) classification labels with content-level pattern matching fallback.
- **PDF Validation Report** — Auto-generated scorecard with score gauge, protocol coverage, gap analysis, and recommendations.

### 🔥 NGFW & IPS Validation
Run real attack payloads against your firewall and see what gets through.

- **IPS Signature Testing** — SQL Injection, Cross-Site Scripting (XSS), and Path Traversal attacks.
- **Advanced Evasion Techniques** — Log4j JNDI injection, Hex-encoded SQLi, Shellshock probes.
- **C2 Beacon Simulation** — Encoded exfiltration, web shell beacons, ActiveX dropper delivery.
- **Network IP Flooder** — 30 randomized attack patterns fired continuously to stress-test sustained blocking.
- **PDF Security Assessment Report** — Scored report with per-category breakdown and remediation recommendations.

### ⊕ MITRE ATT&CK Kill Chain Simulator
Simulate a 4-stage attack chain and see which stage your defenses break.

- **T1190** — Initial Access (Apache Struts / Log4j exploitation)
- **T1059.001** — Execution (PowerShell download cradle)
- **T1003.001** — Credential Access (Mimikatz-pattern credential dump)
- **T1048.003** — Exfiltration (Shellshock data extraction)
- **PDF Kill Chain Report** — Stage-by-stage visualization with risk assessment.

### 🔒 Threat Protection Lab
Download safe test files to validate your antivirus and endpoint protection.

- EICAR standard test files (.txt, .zip, .ps1)
- Heuristic malware samples (.exe, .pdf, .doc)
- Ransomware behavior simulators
- OLE ActiveX exploit documents

### 📡 Network Pulse
Real-time network diagnostics and telemetry.

- Public IP detection with geolocation
- Latency, jitter, and packet loss measurement
- Path MTU discovery
- AI-powered security insights

---

## Prerequisites

- **SSL Decryption (DPI-SSL)** must be enabled on your firewall for the `itsectools.com` domain. Without decryption, the firewall cannot inspect HTTPS payloads inside the encrypted tunnel.

---

## Resources

| Resource | Link |
|----------|------|
| **Live Tool** | [itsectools.com](https://itsectools.com) |
| **DLP Validator** | [itsectools.com/dlp](https://itsectools.com/dlp) |
| **NGFW Testing** | [itsectools.com/ngfw](https://itsectools.com/ngfw) |
| **MITRE ATT&CK** | [itsectools.com/mitre](https://itsectools.com/mitre) |
| **Threat Lab** | [itsectools.com/threat-protection](https://itsectools.com/threat-protection) |
| **Network Pulse** | [itsectools.com/network-pulse](https://itsectools.com/network-pulse) |
| **Help & Guides** | [itsectools.com/help](https://itsectools.com/help) |
| **Blog** | [itsectools.com/blog](https://itsectools.com/blog) |
| **Contact** | [itsectools.com/contact](https://itsectools.com/contact) |

---

## Privacy & Safety

- **Free to use** — no subscriptions, no accounts, no paywalls.
- **Safe simulation** — all test payloads are benign and designed exclusively for detection testing.
- **Privacy first** — all analysis occurs in the browser or via ephemeral stateless functions. No data is stored, logged, or transmitted.
- **No tracking** — no user data is collected beyond anonymous analytics.

---

## Disclaimer

This tool is for **educational and authorized security testing purposes only**. All attack simulations use industry-standard test patterns. No actual malware is distributed.
