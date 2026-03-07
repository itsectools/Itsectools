import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'NGFW Testing Guide — How to Validate Firewall Rules | ITSecTools',
    description: 'Learn how to use ITSecTools NGFW Validation: execute IPS signature tests, advanced evasion techniques, C2 beacon simulations, and interpret console results.',
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
                        <li><strong>SQL Injection (SQLi)</strong> — Injects <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>&apos; OR 1=1; --</code> into HTTP query strings. Tests classic SQLi signature detection.</li>
                        <li><strong>Cross-Site Scripting (XSS)</strong> — Injects <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>&lt;script&gt;alert(1)&lt;/script&gt;</code> into parameters. Tests client-side script injection detection.</li>
                        <li><strong>Directory Traversal</strong> — Sends <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>../../etc/passwd</code> in the URL path. Tests path traversal signature detection.</li>
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
                        <li><strong>Log4j JNDI Injection</strong> — Embeds <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>${'${jndi:ldap://...}'}</code> in HTTP headers. Tests deep packet inspection of non-standard headers (CVE-2021-44228).</li>
                        <li><strong>Hex/URL-Encoded SQLi</strong> — Sends SQL injection entirely in Hex/URL encoding (<code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>%31%20%75%6e%69%6f%6e...</code>). Tests if the IPS normalizes and decodes complex character representations.</li>
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
                        <li><strong>OOB Data Exfiltration</strong> — Embeds <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>/etc/passwd</code> contents in outbound query parameters. Tests DLP and Application Control.</li>
                        <li><strong>Web Shell Beacon</strong> — Sends Linux enumeration commands (<code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>cat /etc/passwd</code>) to an external server. Tests interactive shell traffic detection.</li>
                        <li><strong>Python Reverse Shell Stager</strong> — Fetches a malware payload with a Python user-agent. Tests IPS detection of automated exploit fetching.</li>
                    </ul>
                </div>
            </section>

            {/* Console Output */}
            <section id="console" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F0F9FF' }}>4. Understanding Console Output</h2>

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
