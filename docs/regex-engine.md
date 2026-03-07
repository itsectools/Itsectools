# DLP Regex Builder — Complete Guide

> **URL:** [itsectools.com/dlp](https://itsectools.com/dlp) → DLP Regex Builder tab

## Overview

Build and translate DLP regex patterns across 10 vendor-specific engines. Each DLP vendor uses a different regex engine (PCRE, RE2, Java, .NET, cloud-native) with different syntax requirements — this tool handles the translation automatically.

---

## Regex Creator

Build regex patterns from sample data without writing regex manually.

**How to use:**
1. Switch to the **Regex** tab → select **Regex Creator**
2. Enter a sample text (e.g., `MRN:1234567`)
3. Click **Analyze** — the tool auto-detects each segment's type
4. Refine each segment's **match type** (27 options) and **quantity**
5. Select your **target DLP vendor**
6. Click **Generate Regex**
7. Optionally enter a test string to validate the pattern

### 27 Match Types

Digits, letters (upper/lower), word characters, whitespace, special characters, exact text, character sets, ranges, hex digits, alphanumeric, any character, and more.

---

## Regex Translator & Tester

Convert existing regex patterns into vendor-optimized versions.

**How to use:**
1. Switch to the **Regex** tab → select **Regex Translator**
2. Paste your existing regex pattern
3. Select your target DLP vendor
4. Optionally enter a test string
5. Click **Translate & Test**

### Features
- **Vendor-specific syntax translation** — Handles differences between PCRE, RE2, Java, and cloud-native engines
- **Instant match testing** — Shows whether the translated pattern matches your test string
- **Failure diagnostics** — Pinpoints exactly which regex token broke and where
- **Plain English explanations** — Every regex includes a step-by-step breakdown

---

## Supported Vendors

| Vendor | Engine Type |
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

## Related

- [DLP Validator Guide](dlp-validator.md)
- [Open DLP Validator →](https://itsectools.com/dlp)
