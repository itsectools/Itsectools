import ThreatProtectionClient from './ThreatProtectionClient';

export default function ThreatProtectionPage() {
    return (
        <>
            <ThreatProtectionClient />

            {/* SEO Content Section - Server-rendered, collapsible for clean UI */}
            <details className="seo-details">
                <summary>Learn more about this tool</summary>
                <div className="seo-content">
                    <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem' }}>Free Malware Test Files &amp; Threat Protection Validator</h2>
                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                        Verify that your antivirus, Endpoint Protection Platform (EPP), Endpoint Detection &amp; Response (EDR), or gateway antivirus (AV) solutions are actively scanning and blocking threats. ITSecTools provides safe, benign test files that trigger security detection signatures without performing any real malicious actions.
                    </p>

                    <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Available Test Files</h3>
                    <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: '0 0 1.5rem 0' }}>
                        <li><strong>EICAR Standard Test File</strong> — The industry-standard antivirus detection string, available in .com, .txt, and .zip formats. Recognized by every major AV engine worldwide.</li>
                        <li><strong>Heuristic Malware Simulators</strong> — Polymorphic signature patterns in .exe, .pdf, and .doc formats that test behavioral analysis engines beyond simple signature matching.</li>
                        <li><strong>Ransomware Behavior Script</strong> — A .vbs script simulating file encryption behavior to verify your ransomware protection policies and behavioral detection capabilities.</li>
                    </ul>

                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                        All test files are generated on-demand and delivered over HTTPS. If your security solution blocks the download, it confirms your protection is working correctly. No real malicious code is involved — these are detection-only test payloads designed for security validation.
                    </p>
                </div>
            </details>
        </>
    );
}
