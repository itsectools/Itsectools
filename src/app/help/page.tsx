import Link from 'next/link';

const guides = [
    {
        href: '/help/dlp-validator',
        title: 'DLP Validator',
        description: 'File uploads (HTTP/HTTPS/FTP), download test documents, raw text POST, file metadata & label checker, regex creator & translator, advanced payload generator, MCP protocol testing (JSON exfiltration), and PDF validation report.',
        color: '#6366F1',
        bg: '#EEF2FF',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="12" y1="12" x2="12.01" y2="12" />
            </svg>
        ),
    },
    {
        href: '/help/ngfw-testing',
        title: 'NGFW Validation',
        description: 'IPS signature tests (SQLi, XSS, Path Traversal), Advanced Evasion Techniques, C2 beacon simulation, Run All Tests, Network IP Flooder (30 attacks), IP shun cooldown, console output, and PDF security assessment report.',
        color: '#0EA5E9',
        bg: '#F0F9FF',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
    },
    {
        href: '/help/mitre-attack',
        title: 'MITRE ATT&CK Simulator',
        description: 'Kill chain concept, T1190 Apache Struts RCE, T1059.004 ThinkPHP RCE, T1003.001 Pulse Secure VPN, T1048.003 Shellshock Exfiltration, results interpretation, and PDF kill chain report.',
        color: '#F59E0B',
        bg: '#FFFBEB',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
            </svg>
        ),
    },
    {
        href: '/help/threat-generation',
        title: 'Threat Generation',
        description: 'EICAR standard test files, heuristic malware samples, ransomware simulator, and how to verify your endpoint or gateway AV blocked the download.',
        color: '#DC2626',
        bg: '#FEF2F2',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        ),
    },
    {
        href: '/help/network-pulse',
        title: 'Network Pulse',
        description: 'Public IP detection, edge server identification, latency (RTT), jitter, packet loss, Path MTU discovery, AI security insights, and connection quality scoring.',
        color: '#10B981',
        bg: '#ECFDF5',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
        ),
    },
];

export default function HelpPage() {
    return (
        <div>
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.5rem' }}>Help &amp; User Guides</h1>
                <p style={{ margin: 0, fontSize: '1rem', color: '#64748B', lineHeight: 1.6, maxWidth: '700px' }}>
                    Detailed, feature-by-feature documentation for every tool in the ITSecTools security validation suite. Select a guide below to learn how each feature works, what it tests, and how to interpret the results.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {guides.map((guide) => (
                    <Link
                        key={guide.href}
                        href={guide.href}
                        style={{
                            background: 'white',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            padding: '2rem',
                            textDecoration: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        className="feature-card"
                    >
                        <div style={{
                            background: guide.bg,
                            color: guide.color,
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {guide.icon}
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0F172A', fontWeight: 600 }}>{guide.title}</h2>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, flex: 1 }}>{guide.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: guide.color, fontWeight: 600, fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            Read Guide
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>

            {/* SEO Content */}
            <section style={{ marginTop: '3rem', padding: '2.5rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem' }}>ITSecTools Documentation &amp; Getting Started</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                    ITSecTools is a free, browser-based security validation suite that helps security teams, IT administrators, and compliance auditors test their network defenses without installing agents or purchasing subscriptions. Every tool runs directly in your browser — no downloads, no sign-ups, no data collection.
                </p>

                <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>What Can You Test?</h3>
                <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: '0 0 1.5rem 0' }}>
                    <li><strong>Data Loss Prevention (DLP)</strong> — Upload sensitive test files, inspect metadata labels, build vendor-specific regex patterns, generate evasion payloads, and download a scored PDF validation report with gap analysis.</li>
                    <li><strong>Next-Generation Firewall (NGFW)</strong> — Send real SQLi, XSS, Log4j, Shellshock, and C2 beacon payloads to verify IPS signatures and evasion detection. Download a PDF security assessment with per-category scoring. Includes a 30-attack flood stress test.</li>
                    <li><strong>MITRE ATT&amp;CK Kill Chain</strong> — Execute a sequential 4-stage attack and download a PDF kill chain report showing where your defenses break.</li>
                    <li><strong>Threat Protection</strong> — Download EICAR, heuristic malware, and ransomware test files to verify endpoint and gateway antivirus detection.</li>
                    <li><strong>Network Pulse</strong> — Identify your public IP, measure latency/jitter/packet loss, discover Path MTU, and get AI-generated security recommendations.</li>
                </ul>

                <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Who Is This For?</h3>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                    Security Operations Center (SOC) analysts, network engineers, compliance auditors, penetration testers, and anyone responsible for validating security controls. Whether you&apos;re testing a newly deployed firewall, verifying DLP policies after a vendor migration, or demonstrating security posture during an audit — ITSecTools provides the validation you need at zero cost.
                </p>
            </section>
        </div>
    );
}
