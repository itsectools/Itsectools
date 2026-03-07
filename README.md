# CyberShield - Security Testing Suite

A comprehensive web application for testing NGFW, DLP, and Threat Protection capabilities.

## Features

### 1. Home / Network Diagnostics
- **Public IP Detection**: Displays your current public IP.
- **Network Stats**: Measures Latency, Jitter, and Packet Loss to the server.
- **Fragmentation Analysis**: Visualizes Path MTU discovery and recommends optimal MSS values.
- **Visual Map**: Animated network topology map showing packet flow.

### 2. DLP (Data Loss Prevention) Tools
- **Text Analysis**: Post text data over HTTP and HTTPS to verify keyword blocking (e.g., SSN patterns, Credit Card numbers) and test unencrypted egress detection across different ports.
- **DLP Payload Generation**: Generate and exfiltrate compliance test data (PII, PCI, PHI) to test your endpoint DLP.

### 3. NGFW (Next-Gen Firewall) Validation
- **Evasion Tests**: Simulates obfuscated payloads (Base64) to test firewall inspection.
- **IPS Tests**: Simulates SQL Injection and XSS attacks.
- **C2C Communication**: Simulates botnet command & control traffic to specific endpoints.
- **Protocol Validation**: Tests standard HTTP compliance.

### 4. Threat Protection Lab
- **EICAR Test File**: Download standard EICAR test file.
- **Malware Simulation**: Download benign files with malware-like signatures for testing AV detection.
- **Ransomware Simulator**: Download harmless scripts that mimic ransomware behavior.

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS (CSS Modules & Global CSS) with "Premium" Dark Mode.
- **Visualization**: HTML5 Canvas for Network Map.

## Disclaimer
This tool is for **educational and testing purposes only**. The "malware" files provided are harmless simulations.
