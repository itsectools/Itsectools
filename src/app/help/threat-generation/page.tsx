import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Threat Generation Guide — EICAR & Malware Test Files | ITSecTools',
    description: 'Learn how to use ITSecTools Threat Generation: download EICAR test files, heuristic malware samples, and ransomware simulators to verify endpoint and gateway AV.',
    alternates: { canonical: 'https://itsectools.com/help/threat-generation' },
};

export default function ThreatGenGuide() {
    return (
        <div>
            <nav style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <Link href="/help" style={{ color: '#DC2626', textDecoration: 'none' }}>← Back to Help</Link>
            </nav>

            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.5rem' }}>Threat Generation — Complete Guide</h1>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
                    How to safely test your endpoint and gateway antivirus with benign threat simulators.
                </p>
            </header>

            {/* Safety Notice */}
            <section style={{ marginBottom: '2.5rem' }}>
                <div style={{ background: '#FEF2F2', borderRadius: '8px', padding: '1.25rem', border: '1px solid #FECACA', fontSize: '0.9rem', color: '#991B1B' }}>
                    <strong>🛡️ Safety Notice:</strong> All test files are <strong>completely harmless</strong>. They contain detection signatures that trigger security alerts but perform <strong>no actual malicious actions</strong>. They are used by security professionals worldwide.
                </div>
            </section>

            {/* How It Works */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FEF2F2' }}>How It Works</h2>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <ol style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li>Navigate to <strong>Threat Gen</strong> from the sidebar.</li>
                        <li>Choose a threat category: <strong>EICAR</strong>, <strong>Heuristic Malware</strong>, or <strong>Ransomware</strong>.</li>
                        <li>Click a file format button (.COM, .TXT, .ZIP, .EXE, .PDF, .DOC, or .VBS).</li>
                        <li>The file is generated on-demand and delivered over HTTPS.</li>
                        <li><strong>If your AV blocks the download</strong> → Protection is working ✅</li>
                        <li><strong>If the file downloads successfully</strong> → Your AV may need tuning ⚠️</li>
                    </ol>
                </div>
            </section>

            {/* EICAR */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FEF2F2' }}>EICAR Standard Test File</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    The <strong>European Institute for Computer Antivirus Research (EICAR)</strong> test file is an industry-standard string recognized by every major AV engine worldwide. It&apos;s a 68-byte ASCII string — not a real virus — that all AV vendors have agreed to detect.
                </p>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Available Formats</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><strong>.COM</strong> — Native EICAR executable format.</li>
                        <li><strong>.TXT</strong> — Plain text format for testing content inspection.</li>
                        <li><strong>.ZIP</strong> — Compressed archive to test archive scanning depth.</li>
                    </ul>
                </div>
            </section>

            {/* Heuristic Malware */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FEF2F2' }}>Heuristic Malware Samples</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Simulates <strong>polymorphic malware signatures</strong> to test behavioral analysis engines beyond simple hash-based matching. These test whether your AV can detect malware-like patterns even without a known signature.
                </p>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Available Formats</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><strong>.EXE</strong> — Windows executable with Trojan-like behavior patterns.</li>
                        <li><strong>.PDF</strong> — PDF with embedded suspicious content markers.</li>
                        <li><strong>.DOC</strong> — Document with macro-like detection triggers.</li>
                    </ul>
                </div>
            </section>

            {/* Ransomware */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FEF2F2' }}>Ransomware Simulator</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    A <strong>.VBS script</strong> that emulates file encryption behavior to test your ransomware protection policies and behavioral detection capabilities. The script does <strong>not</strong> encrypt any actual files.
                </p>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>What It Tests</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li>Behavioral detection of mass file encryption patterns</li>
                        <li>Script execution blocking policies</li>
                        <li>Ransomware protection features in your EPP/EDR</li>
                    </ul>
                </div>
            </section>

            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Link href="/threat-protection" style={{ background: '#DC2626', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                    Open Threat Generation →
                </Link>
            </div>
        </div>
    );
}
