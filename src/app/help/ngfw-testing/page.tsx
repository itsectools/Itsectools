import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'NGFW Testing Guide — How to Validate Firewall Rules | ITSecTools',
    description: 'Learn how to use ITSecTools NGFW Validation: execute IPS signature tests, advanced evasion techniques, C2 beacon simulations, Network IP Flooder stress tests, and interpret console results.',
    alternates: { canonical: 'https://itsectools.com/help/ngfw-testing' },
};

export default function NGFWGuide() {
    return (
        <div>
            <nav style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <Link href="/help" style={{ color: '#0EA5E9', textDecoration: 'none' }}>← Back to Help</Link>
            </nav>

            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.5rem' }}>NGFW Validation — Complete Guide</h1>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
                    How to test your Next-Generation Firewall and IPS with live attack simulations.
                </p>
            </header>

            {/* Prerequisites */}
            <section style={{ marginBottom: '2.5rem' }}>
                <div style={{ background: '#FFF7ED', borderRadius: '8px', padding: '1.25rem', border: '1px solid #FDBA74', fontSize: '0.9rem', color: '#9A3412' }}>
                    <strong>⚠️ Prerequisites — SSL Decryption Required</strong>
                    <p style={{ margin: '0.75rem 0 0 0', lineHeight: 1.6 }}>
                        ITSecTools runs over <strong>HTTPS (port 443)</strong>. Your firewall <u>must</u> have <strong>SSL Decryption (DPI-SSL)</strong> enabled for the <code style={{ background: '#FEF3C7', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>itsectools.com</code> domain. Without decryption, the firewall cannot see the attack payloads inside the encrypted tunnel and all tests will show as &quot;allowed.&quot;
                    </p>
                </div>
            </section>

            {/* IPS Signature Testing */}
            <section id="ips" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F0F9FF' }}>1. IPS Signature Testing</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Sends real attack payloads through your network to verify that your IPS engine detects and blocks them. These are active traffic tests, not static vulnerability scans.
                </p>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Tests Executed</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><strong>SQL Injection (SQLi)</strong> — Injects SQL query manipulation payloads into HTTP query strings. Tests classic SQLi signature detection.</li>
                        <li><strong>Cross-Site Scripting (XSS)</strong> — Injects script execution payloads into parameters. Tests client-side script injection detection.</li>
                        <li><strong>Directory Traversal</strong> — Sends directory traversal sequences in the URL path. Tests path traversal signature detection.</li>
                    </ul>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>How to Use</h3>
                    <ol style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li>Navigate to <strong>NGFW Validation</strong>.</li>
                        <li>Click <strong>Execute</strong> on the <strong>Intrusion Prevention (IPS) Signature</strong> card.</li>
                        <li>Watch the console output — each test shows whether it was <span style={{ color: '#16A34A', fontWeight: 600 }}>Blocked</span> or <span style={{ color: '#EAB308', fontWeight: 600 }}>Allowed</span>.</li>
                        <li>The summary line shows <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>SUMMARY: X/3 attacks blocked</code>.</li>
                    </ol>
                </div>
            </section>

            {/* Advanced Evasion Techniques */}
            <section id="aet" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F0F9FF' }}>2. Advanced Evasion Techniques (AET)</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Tests whether your firewall can detect attacks hidden behind encoding, obfuscation, and header injection — techniques that bypass basic IPS signature matching.
                </p>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Tests Executed</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><strong>Log4j JNDI Injection</strong> — Embeds JNDI lookup payloads in HTTP headers. Tests deep packet inspection of non-standard headers (CVE-2021-44228).</li>
                        <li><strong>Hex/URL-Encoded SQLi</strong> — Sends SQL injection entirely in hex/URL encoding. Tests if the IPS normalizes and decodes complex character representations.</li>
                        <li><strong>Shellshock RCE</strong> — Injects Bash function vectors in custom HTTP headers. Tests Shellshock signature detection (CVE-2014-6271).</li>
                    </ul>
                </div>
            </section>

            {/* C2C Beacon */}
            <section id="c2c" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F0F9FF' }}>3. Command &amp; Control (C2) Beacon Simulation</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Simulates outbound C2 traffic patterns that a compromised endpoint would generate. Tests your firewall&apos;s application control and outbound traffic policies.
                </p>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Tests Executed</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><strong>OOB Data Exfiltration</strong> — Embeds sensitive system file paths in outbound query parameters. Tests DLP and Application Control.</li>
                        <li><strong>Web Shell Beacon</strong> — Sends Linux enumeration commands to an external server. Tests interactive shell traffic detection.</li>
                        <li><strong>ActiveX Dropper Delivery</strong> — Server returns an HTA payload with ActiveX file-write patterns. Tests response-body content inspection for dropper delivery.</li>
                    </ul>
                </div>
            </section>

            {/* Run All Tests */}
            <section id="run-all" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F0F9FF' }}>4. Run All Tests</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Executes all three test suites (IPS, AET, and C2C) sequentially in one shot. Uses the configured IP Shun Cooldown Delay between suites to ensure each test is individually inspected by the firewall.
                </p>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>How It Works</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li>Runs IPS (3 tests) → AET (3 tests) → C2C (3 tests) = <strong>9 total attacks</strong>.</li>
                        <li>Pauses between suites using the selected cooldown delay.</li>
                        <li>Displays a combined summary: <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>TOTAL: X/9 attacks blocked</code>.</li>
                    </ul>
                </div>
            </section>

            {/* Network IP Flooder */}
            <section id="flood" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F0F9FF' }}>5. Network IP Flooder</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Fires 30 continuous IPS attack patterns in rapid succession without delay — stress-testing your firewall&apos;s ability to detect and block high-volume attack traffic. Each request uses a unique URL path to avoid browser connection reuse.
                </p>

                <div style={{ background: '#FFF7ED', borderRadius: '8px', padding: '1.25rem', border: '1px solid #FDBA74', fontSize: '0.9rem', color: '#9A3412', marginBottom: '1rem' }}>
                    <strong>⚠️ Warning:</strong> This test may trigger aggressive IP shunning on your firewall. If your NGFW shuns the source IP after the first detection, subsequent attacks will be silently dropped without generating individual log entries. All attacks will still be blocked — but the firewall logs may show fewer entries than 30.
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Attack Patterns (13 unique, cycled to 30)</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><strong>SQL Injection</strong> (4 variants) — UNION SELECT with different target tables and schemas.</li>
                        <li><strong>XSS + Path Traversal</strong> (1 variant) — Combined cookie-theft script with encoded traversal.</li>
                        <li><strong>Path Traversal</strong> (5 variants) — URL-encoded, double-encoded, UTF-8 overlong, double-dot, and Windows-style traversals.</li>
                        <li><strong>System File Disclosure</strong> (3 variants) — Traversal-prefixed access to <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>/etc/shadow</code>, <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>/var/log/auth.log</code>, and <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>/proc/self/environ</code>.</li>
                    </ul>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>How Detection Works</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><strong>HTTP 403/503</strong> — Firewall block page returned before response delivery.</li>
                        <li><strong>Connection dropped/timeout</strong> — Firewall terminated the TCP connection or IP was shunned.</li>
                        <li><strong>Body terminated by firewall</strong> — HTTP 200 headers arrived but the NGFW killed the response stream mid-delivery.</li>
                        <li><strong>Payload reached destination (HTTP 200)</strong> — Attack was not detected. Review your IPS signatures.</li>
                    </ul>
                </div>
            </section>

            {/* IP Shun Cooldown */}
            <section id="shun" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F0F9FF' }}>6. IP Shun Cooldown Delay</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Most NGFWs temporarily blacklist (shun) a source IP after detecting an attack. During the shun window, all subsequent packets are dropped at the kernel level <strong>without inspection</strong> — meaning no individual log entries are generated.
                </p>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Configuring the Delay</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><strong>~1s</strong> — Fastest execution. Best for firewalls with no shunning or very short shun windows.</li>
                        <li><strong>6s</strong> (default) — Recommended for most Forcepoint NGFW configurations.</li>
                        <li><strong>15s / 30s</strong> — Use if only the first attack in each suite generates a log.</li>
                    </ul>
                    <p style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '0.75rem', marginBottom: 0, fontStyle: 'italic' }}>
                        Note: The IP Shun Cooldown applies to IPS, AET, C2C, and Run All Tests. The Network IP Flooder runs without delay by design.
                    </p>
                </div>
            </section>

            {/* Console Output */}
            <section id="console" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F0F9FF' }}>7. Understanding Console Output</h2>

                <div style={{ background: '#0F172A', borderRadius: '8px', padding: '1.5rem', color: '#E2E8F0', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.8 }}>
                    <div><span style={{ color: '#64748B' }}>[14:32:01]</span> <span style={{ color: '#FCD34D', fontWeight: 'bold' }}>Test:</span> <span>SQL Injection vector injected into HTTP query strings...</span></div>
                    <div><span style={{ color: '#64748B' }}>[14:32:01]</span> <span style={{ color: '#4ADE80', fontWeight: 'bold' }}>Result:</span> <span>Success - Blocked by firewall (HTTP 403)</span></div>
                    <div><span style={{ color: '#64748B' }}>[14:32:02]</span> <span style={{ color: '#FCD34D', fontWeight: 'bold' }}>Result:</span> <span>Failed - Payload reached destination (HTTP 200)</span></div>
                    <div><span style={{ color: '#64748B' }}>[14:32:03]</span> <span style={{ color: '#4ADE80', fontWeight: 'bold' }}>Result:</span> <span>Success - Connection dropped/timeout</span></div>
                    <div style={{ marginTop: '0.5rem' }}><span style={{ color: '#64748B' }}>[14:32:04]</span> <span style={{ fontWeight: 'bold' }}>INFO: SUMMARY: 2/3 attacks blocked successfully.</span></div>
                </div>

                <div style={{ marginTop: '1rem', background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Result Interpretation</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><strong style={{ color: '#16A34A' }}>Blocked (HTTP 403/503 or Connection Reset)</strong> — Your firewall detected and stopped the attack. ✅ This is the expected result.</li>
                        <li><strong style={{ color: '#EAB308' }}>Allowed (HTTP 200 or Opaque)</strong> — The attack payload reached its destination undetected. ⚠️ Your IPS may need tuning or the signature set may need updating.</li>
                        <li><strong style={{ color: '#EF4444' }}>Error</strong> — An unexpected status code was returned. May indicate a misconfiguration.</li>
                    </ul>
                </div>
            </section>

            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Link href="/ngfw" style={{ background: '#0EA5E9', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                    Open NGFW Validation →
                </Link>
            </div>
        </div>
    );
}
