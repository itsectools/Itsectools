# NGFW Validation — Complete Guide

> **URL:** [itsectools.com/ngfw](https://itsectools.com/ngfw)

## Overview

Test your Next-Generation Firewall and IPS with live attack simulations. Results appear in a real-time console output panel with color-coded logging.

> ⚠️ **SSL Decryption Required:** ITSecTools runs over HTTPS. Your firewall must have SSL Decryption (DPI-SSL) enabled for `itsectools.com`. Without decryption, the firewall cannot see the payloads and all tests will show as "allowed."

---

## 1. IPS Signature Testing

Sends real attack payloads to verify that your IPS engine detects and blocks them.

| Test | Payload | What It Tests |
|---|---|---|
| **SQL Injection** | `' OR 1=1; --` in query strings | Classic SQLi signature detection |
| **Cross-Site Scripting** | `<script>alert(1)</script>` injection | Client-side script injection detection |
| **Directory Traversal** | `../../etc/passwd` in URL path | Path traversal signature detection |

**How to use:**
1. Navigate to **NGFW Validation**
2. Click **Execute** on the **Intrusion Prevention (IPS) Signature** card
3. Watch the console — each test shows Blocked or Allowed
4. Summary shows `SUMMARY: X/3 attacks blocked`

---

## 2. Advanced Evasion Techniques (AET)

Tests whether your firewall detects attacks hidden behind encoding and obfuscation.

| Test | Payload | What It Tests |
|---|---|---|
| **Log4j JNDI** | `${jndi:ldap://...}` in HTTP headers | Deep packet inspection of non-standard headers (CVE-2021-44228) |
| **Hex-Encoded SQLi** | `%31%20%75%6e%69%6f%6e...` | URL encoding normalization and decoding |
| **Shellshock RCE** | Bash function injection in headers | Shellshock signature detection (CVE-2014-6271) |

---

## 3. Command & Control (C2C) Beacon

Simulates outbound C2 traffic patterns from a compromised endpoint.

| Test | What It Simulates |
|---|---|
| **OOB Data Exfiltration** | `/etc/passwd` contents in outbound query parameters |
| **Web Shell Beacon** | Linux enumeration commands (`cat /etc/passwd`) to external server |
| **Python Stager** | Malware payload fetch with Python user-agent |

---

## 4. Understanding Console Output

```
[14:32:01] Test: SQL Injection vector injected into HTTP query strings...
[14:32:01] Result: Success - Blocked by firewall (HTTP 403)
[14:32:02] Result: Failed - Payload reached destination (HTTP 200)
[14:32:03] INFO: SUMMARY: 2/3 attacks blocked successfully.
```

**Result interpretation:**
- ✅ **Blocked** (HTTP 403/503 or Connection Reset) — Firewall detected and stopped the attack
- ⚠️ **Allowed** (HTTP 200) — Payload reached its destination undetected
- ❌ **Error** — Unexpected status code, may indicate misconfiguration

---

## Related

- [MITRE ATT&CK Guide](mitre-attack.md)
- [Open NGFW Validation →](https://itsectools.com/ngfw)
