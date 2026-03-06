# MITRE ATT&CK Simulator — Complete Guide

> **URL:** [itsectools.com/mitre](https://itsectools.com/mitre)

## Overview

Execute a 4-phase sequential kill chain mapped to the MITRE ATT&CK framework. Each stage runs in sequence — if your security controls break the chain at any point, the attacker fails.

> 💡 **Key concept:** Unlike independent NGFW tests, the kill chain runs tests **sequentially** — simulating how real-world attacks progress through stages.

---

## How to Use

1. Navigate to **MITRE ATT&CK** from the sidebar
2. Review the four stage cards
3. Click **Execute Kill Chain**
4. Watch the console as each stage runs with a 1.2s delay
5. The summary shows how many stages were blocked out of 4

---

## Kill Chain Stages

### Stage 1 — Initial Access (T1190)
**Technique:** Exploit Public-Facing Application

Sends a Log4j JNDI/LDAP payload in an HTTP header to simulate exploiting a public-facing application. Your IPS/WAF should detect the JNDI lookup pattern.

### Stage 2 — Execution (T1059.001)
**Technique:** PowerShell

Attempts to download a malicious `.ps1` PowerShell payload (download cradle). Your firewall should detect and block the PowerShell content.

### Stage 3 — Credential Access (T1003.001)
**Technique:** OS Credential Dumping (LSASS Memory)

Transmits Mimikatz strings over the wire used to dump LSASS credentials. Tests deep packet inspection for credential theft indicators.

### Stage 4 — Exfiltration (T1048.003)
**Technique:** Exfiltration Over Unencrypted Protocol

Extracts `/etc/passwd` contents via cleartext query string, simulating data exfiltration over an unencrypted channel.

---

## Interpreting Results

| Result | Meaning |
|---|---|
| **4/4 blocked** | Excellent. Kill chain broken at every stage. |
| **3/4 blocked** | One gap. Identify which technique bypassed controls. |
| **1-2/4 blocked** | Multiple gaps. Review IPS signatures and policies. |
| **0/4 blocked** | Check SSL Decryption is enabled and IPS is active. |

---

## Related

- [NGFW Testing Guide](ngfw-testing.md)
- [Open MITRE ATT&CK Simulator →](https://itsectools.com/mitre)
