import NGFWClient from './NGFWClient';

export default function NGFWPage() {
    return (
        <>
            <NGFWClient />

            {/* SEO Content Section - Server-rendered, collapsible for clean UI */}
            <details className="seo-details">
                <summary>Learn more about this tool</summary>
                <div className="seo-content">
                    <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem' }}>Free NGFW &amp; IPS Testing Tool</h2>
                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                        Validate your Next-Generation Firewall (NGFW) and Intrusion Prevention System (IPS) with live attack simulations directly from your browser. ITSecTools sends real SQL Injection, Cross-Site Scripting (XSS), and Path Traversal payloads through your network to verify that your firewall detects and blocks them. Unlike static vulnerability scanners, these are active traffic tests that confirm your security controls work in real-time.
                    </p>

                    <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Test Categories</h3>
                    <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: '0 0 1.5rem 0' }}>
                        <li><strong>IPS Signature Testing</strong> — SQLi, XSS, and Directory Traversal payloads injected into standard HTTP traffic.</li>
                        <li><strong>Advanced Evasion Techniques (AET)</strong> — Log4j JNDI header injection, Hex/URL-encoded SQL injection, and Shellshock Bash function injection in HTTP headers.</li>
                        <li><strong>Command &amp; Control (C2) Beacon Simulation</strong> — OOB data exfiltration, web shell command beacons, and Python reverse shell stagers.</li>
                        <li><strong>Protocol Evasion Validation</strong> — Jumbo HTTP headers and method spoofing to test RFC compliance.</li>
                    </ul>

                    <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Why This NGFW Testing Tool?</h3>
                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                        Most firewall testing tools require agents, installations, or paid subscriptions. ITSecTools runs entirely in your browser — no setup, no downloads, no cost. The console output shows real-time results including HTTP status codes, connection resets, and timeout analysis, giving you immediate visibility into your firewall&#39;s response to each attack vector. SSL Decryption (DPI-SSL) must be enabled for your firewall to inspect the HTTPS payloads.
                    </p>
                </div>
            </details>
        </>
    );
}
