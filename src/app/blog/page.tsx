import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Blog — Security Testing Guides & Tutorials | ITSecTools',
    description: 'Practical guides on DLP policy testing, MCP protocol exfiltration, Advanced DLP tests, NGFW IPS validation, MITRE ATT&CK simulation, and DLP regex building. Free tools with tutorials.',
};

const blogPosts = [
    {
        slug: 'dlp-false-confidence-testing',
        title: 'Your DLP Passes Every Test but Misses Real Exfiltration — Here\'s Why',
        description: 'Your DLP blocks the test file every time. So why did sensitive data still walk out the door? 6 blind spots — including nested JSON/MCP exfiltration — that lab testing never catches.',
        date: 'Mar 23, 2026',
        readingTime: '10 min read',
        category: 'DLP',
        color: '#6366F1',
        bg: '#EEF2FF',
    },
    {
        slug: 'itsectools-vs-dlp-testing-tools',
        title: 'Why Most Security Testing Tools Give False Confidence',
        description: 'There are other DLP and firewall testing tools. Here\'s what ITSecTools does that none of them can: MCP/JSON exfiltration testing, endpoint DLP detection, 10-vendor regex translation, PDF reports, and kill chain simulation.',
        date: 'Feb 26, 2026',
        readingTime: '10 min read',
        category: 'Comparison',
        color: '#059669',
        bg: '#ECFDF5',
    },
    {
        slug: 'test-dlp-policy-free-tool-guide',
        title: 'How to Test Your DLP Policy — Find the Gaps Before Attackers Do',
        description: 'Your DLP says it\'s working. But can it detect SSNs inside nested JSON? Encrypted ZIPs? MCP protocol exfiltration? 5 blind spots including Advanced DLP tests — free with PDF validation report.',
        date: 'Jan 24, 2026',
        readingTime: '10 min read',
        category: 'DLP',
        color: '#6366F1',
        bg: '#EEF2FF',
    },
    {
        slug: 'eicar-test-file-download',
        title: 'EICAR Is Just the Beginning — Test What Your AV Actually Misses',
        description: 'EICAR proves signature scanning works. It does NOT prove heuristic detection works. ITSecTools goes beyond EICAR with Mimikatz-pattern samples, ransomware simulators, and OLE/ANI exploits.',
        date: 'Feb 14, 2026',
        readingTime: '8 min read',
        category: 'Threat',
        color: '#DC2626',
        bg: '#FEF2F2',
    },
    {
        slug: 'dlp-regex-builder-vendors',
        title: 'Your DLP Regex Works in Testing but Breaks in Production — Here\'s Why',
        description: 'Forcepoint uses PCRE. Zscaler uses RE2. Your regex with lookaheads just failed silently. The only free tool that builds and translates DLP regex across 10 vendor engines.',
        date: 'Feb 3, 2026',
        readingTime: '8 min read',
        category: 'DLP',
        color: '#6366F1',
        bg: '#EEF2FF',
    },
    {
        slug: 'ngfw-ips-signature-validation',
        title: 'Your NGFW Has 10,000 Signatures — How Many Actually Fire?',
        description: 'SSL decryption disabled? IPS in detect-only? Stale signatures? Test your NGFW with real attack traffic over HTTPS. 4 test suites, 30-attack flood test, and a downloadable PDF assessment report.',
        date: 'Mar 12, 2026',
        readingTime: '9 min read',
        category: 'NGFW',
        color: '#0EA5E9',
        bg: '#F0F9FF',
    },
    {
        slug: 'mitre-attack-kill-chain-testing',
        title: 'Your Firewall Blocks Attacks — But Can It Stop a Kill Chain?',
        description: 'Testing one signature at a time gives you false confidence. Simulate a real 4-stage attack from Initial Access to Exfiltration with real CVEs. Download a kill chain report — free, from your browser.',
        date: 'Mar 5, 2026',
        readingTime: '8 min read',
        category: 'MITRE ATT&CK',
        color: '#F59E0B',
        bg: '#FFFBEB',
    },
];

export default function BlogPage() {
    return (
        <div>
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.5rem' }}>Blog</h1>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
                    Find the security gaps your tools aren&apos;t telling you about. Practical guides on DLP blind spots, NGFW misconfigurations, and validation techniques that actually work.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {blogPosts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="feature-card"
                        style={{
                            display: 'block',
                            background: 'white',
                            borderRadius: '12px',
                            padding: '2rem',
                            textDecoration: 'none',
                            border: '1px solid #E2E8F0',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                    >
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{
                                display: 'inline-block',
                                background: post.bg,
                                color: post.color,
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                            }}>
                                {post.category}
                            </span>
                        </div>

                        <h2 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 600, marginBottom: '0.75rem', lineHeight: 1.4 }}>
                            {post.title}
                        </h2>

                        <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                            {post.description}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94A3B8' }}>
                            <span>{post.date}</span>
                            <span>{post.readingTime}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
