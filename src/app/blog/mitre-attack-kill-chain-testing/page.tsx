import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Your Firewall Blocks Attacks — But Can It Stop a Kill Chain? | ITSecTools',
    description: 'Testing one signature at a time gives you false confidence. Simulate a real 4-stage attack from Initial Access to Exfiltration with real CVEs — free, from your browser.',
    keywords: ['Browser-based MITRE ATT&CK network kill chain simulator', 'Simulate Out-of-Band (OOB) DNS exfiltration in browser', 'Test Pulse Secure CVE-2019-11510 firewall signature online', 'Agentless C2 beacon and web shell network simulator', 'Simulate T1190 Initial Access exploit', 'Free Red Team perimeter defense tester'],
    alternates: { canonical: 'https://itsectools.com/blog/mitre-attack-kill-chain-testing' },
    openGraph: {
        title: 'Your Firewall Blocks Attacks — But Can It Stop a Kill Chain?',
        description: 'Simulate a real 4-stage attack from Initial Access to Exfiltration with real CVEs — free, from your browser.',
        url: 'https://itsectools.com/blog/mitre-attack-kill-chain-testing',
        type: 'article',
        siteName: 'ITSecTools',
        images: ['https://itsectools.com/blog/og-mitre.png?v=4'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Your Firewall Blocks Attacks — But Can It Stop a Kill Chain?',
        description: 'Simulate a real 4-stage attack from Initial Access to Exfiltration with real CVEs — free, from your browser.',
        images: ['https://itsectools.com/blog/og-mitre.png?v=4'],
    },
};

export default function MitreAttackKillChainTestingPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: 'Your Firewall Blocks Attacks — But Can It Stop a Kill Chain?',
        description: 'Simulate a real 4-stage MITRE ATT&CK kill chain from your browser.',
        datePublished: '2026-03-05',
        dateModified: '2026-03-05',
        author: { '@type': 'Organization', name: 'ITSecTools', url: 'https://itsectools.com' },
        publisher: { '@type': 'Organization', name: 'ITSecTools', url: 'https://itsectools.com' },
        mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://itsectools.com/blog/mitre-attack-kill-chain-testing' },
    };

    return (
        <div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <nav style={{ marginBottom: '2rem' }}>
                <Link href="/blog" style={{ color: '#F59E0B', textDecoration: 'none', fontSize: '0.9rem' }}>&larr; Back to Blog</Link>
            </nav>

            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.5rem' }}>Your Firewall Blocks Attacks — But Can It Stop a Kill Chain?</h1>
                <div className="blog-intro-callout">
                    Testing one signature at a time gives you false confidence. Real breaches are multi-stage operations. Here&apos;s how to test your NGFW against a real attack progression.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: '#94A3B8' }}>
                    <span>March 5, 2026</span><span>&middot;</span><span>8 min read</span><span>&middot;</span>
                    <span style={{ background: '#FFFBEB', color: '#F59E0B', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>MITRE ATT&CK</span>
                </div>
            </header>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FFFBEB' }}>Why Individual Signature Tests Give You False Confidence</h2>
                
                <h3 className="blog-vs-heading-bad">What most tools do</h3>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Execute isolated, single-event exploits. If your NGFW catches the initial attack, the test ends. They never verify if subsequent stages like command execution or data exfiltration would have succeeded if the first attack bypassed defenses.
                </p>

                <h3 className="blog-vs-heading-good">What ITSecTools does differently</h3>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Simulates a fully chained 4-stage MITRE ATT&CK progression over HTTPS. It tests Initial Access, Execution, Credential Access, and Exfiltration consecutively to uncover blind spots in your outbound detection.
                </p>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FFFBEB' }}>Most MITRE ATT&CK Tools Require Infrastructure. This One Doesn&apos;t.</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>Atomic Red Team requires PowerShell agents on endpoints. CALDERA needs a server deployment. Infection Monkey requires network access. These are powerful frameworks, but they&apos;re designed for red teams with dedicated infrastructure.</p>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>ITSecTools runs a 4-stage kill chain simulation from any browser. No agents, no server setup, no installation. Open the URL, click &quot;Execute Kill Chain,&quot; and watch your firewall handle — or fail to handle — a real attack progression over HTTPS.</p>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FFFBEB' }}>4 Stages, 4 Real CVEs, 4 Defense Layers</h2>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}><strong style={{ color: '#0F172A' }}>Stage 1 — Initial Access (T1190)</strong> — Replicates the network signature of the Apache Struts RCE (CVE-2017-5638). Tests whether your IPS catches exploitation of public-facing applications. If this passes, an attacker has a foothold.</p>
                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}><strong style={{ color: '#0F172A' }}>Stage 2 — Execution (T1059.004)</strong> — Mimics the ThinkPHP RCE (CVE-2018-20062), a URL-based command injection. Tests detection of post-compromise command execution — the attacker is now running commands on your server.</p>
                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}><strong style={{ color: '#0F172A' }}>Stage 3 — Credential Access (T1003.001)</strong> — Reproduces the Pulse Secure VPN file read (CVE-2019-11510). Tests whether your firewall catches credential harvesting — the attacker is stealing passwords for lateral movement.</p>
                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}><strong style={{ color: '#0F172A' }}>Stage 4 — Exfiltration (T1048.003)</strong> — Uses Shellshock (CVE-2014-6271) header injection to simulate data exfiltration. This is the last chance for your defenses to stop stolen data from leaving your network.</p>
                </div>

                <div className="blog-image-wrapper">
                    <Image src="/blog/mitre-cards.png" alt="MITRE ATT&CK simulator interface with 4 stages" width={1200} height={400} />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FFFBEB' }}>The 6-Second Inter-Stage Delay — And Why It Matters</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>The simulator waits 6 seconds between each stage. This isn&apos;t arbitrary — it solves a real testing problem.</p>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>Many NGFWs implement IP shunning: once they detect an attack, they block all subsequent traffic from that IP. If your firewall shuns after Stage 1, Stages 2-4 will all show as connection drops — and you&apos;ll have no idea whether those stages would have been individually detected.</p>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>The delay gives your firewall time to evaluate each request on its own merits. If Stage 1 is blocked but Stage 4 passes, you know your exfiltration detection has gaps — the kind of gap that only shows up when you test the full chain.</p>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FFFBEB' }}>What Your Results Mean</h2>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}><strong style={{ color: '#16A34A' }}>All 4 stages blocked:</strong> Comprehensive kill chain coverage. Your IPS signatures, decryption policies, and security rules work together as layered defense.</p>
                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}><strong style={{ color: '#F59E0B' }}>3 stages blocked:</strong> Good coverage with one gap. Identify which technique passed and check whether the corresponding signature is enabled.</p>
                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}><strong style={{ color: '#DC2626' }}>1-2 stages blocked:</strong> Significant exposure. Review your IPS signature database, verify SSL decryption is active, and check security policies across traffic zones.</p>
                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}><strong style={{ color: '#DC2626' }}>0 stages blocked:</strong> IPS signatures are likely not active or SSL decryption is not configured. Start with verifying your IPS license, signature updates, and decryption policies.</p>
                </div>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>Map each blocked stage to your SIEM and NGFW logs. Every block should have a corresponding log event. If blocks appear in the simulator but not your SIEM, you have a log forwarding issue that could impact incident response.</p>
                <div className="blog-image-wrapper">
                    <Image src="/blog/mitre-console.png" alt="Kill chain results console showing command execution blocks" width={1200} height={500} />
                </div>
            </section>

            <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
                <Link href="/mitre" className="blog-cta">Run the Kill Chain Test &rarr;</Link>
            </div>

            {/* ─── SEO Tags ─── */}
            <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Related Searches & Tools</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {Array.isArray(metadata.keywords) && (metadata.keywords as string[]).map((tag: string) => (
                        <span key={tag} style={{ background: '#F8FAFC', color: '#64748B', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', border: '1px solid #E2E8F0' }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
