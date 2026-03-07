import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'MITRE ATT&CK Simulator Guide — Kill Chain Testing | ITSecTools',
    description: 'Learn how to use the ITSecTools MITRE ATT&CK Kill Chain Simulator to validate perimeter defenses against a sequential attack.',
    alternates: { canonical: 'https://itsectools.com/help/mitre-attack' },
};

export default function MITREGuide() {
    return (
        <div>
            <nav style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <Link href="/help" style={{ color: '#F59E0B', textDecoration: 'none' }}>← Back to Help</Link>
            </nav>

            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.5rem' }}>MITRE ATT&amp;CK Simulator — Complete Guide</h1>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
                    Understand how the kill chain simulator works and how to interpret the results.
                </p>
            </header>

            {/* What is a Kill Chain */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FFFBEB' }}>What Is a Kill Chain?</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Real-world cyberattacks follow a <strong>sequence of stages</strong>. If your security controls break the chain at any point, the attacker fails. The simulator executes four stages sequentially, mapped to the MITRE ATT&amp;CK framework.
                </p>
                <div style={{ background: '#FFFBEB', borderRadius: '8px', padding: '1rem', border: '1px solid #FDE68A', fontSize: '0.9rem', color: '#92400E' }}>
                    <strong>💡 Key Concept:</strong> Unlike independent NGFW tests, the kill chain runs tests <strong>sequentially</strong> — each stage depends on the previous one succeeding.
                </div>
            </section>

            {/* How to Use */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FFFBEB' }}>How to Use</h2>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <ol style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li>Navigate to <strong>MITRE ATT&amp;CK</strong> from the sidebar.</li>
                        <li>Review the four stage cards.</li>
                        <li>Click <strong>Execute Kill Chain</strong>.</li>
                        <li>Watch the console as each stage runs with a 1.2s delay.</li>
                        <li>The summary shows how many stages were blocked out of 4.</li>
                    </ol>
                </div>
            </section>

            {/* Stages */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FFFBEB' }}>Kill Chain Stages</h2>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.5rem' }}>Stage 1 — Initial Access (T1190)</h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                            Sends a <strong>Log4j JNDI/LDAP payload</strong> in an HTTP header to simulate exploiting a public-facing application. Your IPS/WAF should detect the JNDI lookup pattern.
                        </p>
                    </div>
                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.5rem' }}>Stage 2 — Execution (T1059.001)</h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                            Attempts to <strong>download a malicious .ps1 PowerShell payload</strong> (download cradle). Your firewall should detect and block the PowerShell content.
                        </p>
                    </div>
                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.5rem' }}>Stage 3 — Credential Access (T1003.001)</h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                            Transmits <strong>Mimikatz strings</strong> over the wire used to dump LSASS credentials. Tests deep packet inspection for credential theft indicators.
                        </p>
                    </div>
                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.5rem' }}>Stage 4 — Exfiltration (T1048.003)</h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                            Extracts <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>/etc/passwd</code> contents via cleartext query string, simulating data exfiltration over an unencrypted channel.
                        </p>
                    </div>
                </div>
            </section>

            {/* Interpreting Results */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FFFBEB' }}>Interpreting Results</h2>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><strong>4/4 blocked</strong> — Excellent. Kill chain broken at every stage.</li>
                        <li><strong>3/4 blocked</strong> — One gap. Identify which technique bypassed controls.</li>
                        <li><strong>1-2/4 blocked</strong> — Multiple gaps. Review IPS signatures and policies.</li>
                        <li><strong>0/4 blocked</strong> — Check SSL Decryption is enabled and IPS is active.</li>
                    </ul>
                </div>
            </section>

            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Link href="/mitre" style={{ background: '#F59E0B', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                    Open MITRE ATT&amp;CK Simulator →
                </Link>
            </div>
        </div>
    );
}
