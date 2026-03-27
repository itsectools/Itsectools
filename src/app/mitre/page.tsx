import MITREClient from './MITREClient';

export default function MitrePage() {
    return (
        <>
            <MITREClient />

            {/* SEO Content Section - Server-rendered, collapsible for clean UI */}
            <details className="seo-details">
                <summary>Learn more about this tool</summary>
                <div className="seo-content">
                    <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem' }}>MITRE ATT&amp;CK Kill Chain Simulator</h2>
                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                        Real-world cyberattacks don&#39;t happen in isolation — they follow a sequence of stages known as the kill chain. ITSecTools simulates a complete adversary kill chain mapped to the MITRE ATT&amp;CK framework, executing Initial Access, Execution, Credential Access, and Exfiltration stages sequentially to test whether your perimeter defenses can break the chain at any point.
                    </p>

                    <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Simulated Techniques</h3>
                    <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: '0 0 1.5rem 0' }}>
                        <li><strong>T1190 — Initial Access</strong>: Exploit Public-Facing Application via Log4j JNDI/LDAP injection targeting external-facing services.</li>
                        <li><strong>T1059.001 — Execution</strong>: PowerShell download cradle attempting to fetch a malicious .ps1 payload, testing post-exploitation tool download detection.</li>
                        <li><strong>T1003.001 — Credential Access</strong>: OS Credential Dumping using Mimikatz string patterns over the wire, testing deep packet inspection of credential theft indicators.</li>
                        <li><strong>T1048.003 — Exfiltration</strong>: Data extraction over an unencrypted protocol, simulating /etc/passwd content exfiltration via cleartext query strings.</li>
                    </ul>

                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                        Each stage depends on the previous one succeeding — just like a real attack. If your firewall, IPS, or EDR blocks any stage, the kill chain is broken. The console output shows exactly which stages were blocked and which payloads reached their destination, giving you a clear security posture assessment aligned to the MITRE ATT&amp;CK framework.
                    </p>
                </div>
            </details>
        </>
    );
}
