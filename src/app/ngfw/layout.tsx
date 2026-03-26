import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Test Your Firewall — SQLi, XSS & IPS Attacks | ITSecTools',
    description: 'Run real attack payloads against your NGFW and see what gets through. SQLi, XSS, Log4j, C2 beacons, and 30-attack flood tests. Download a scored PDF assessment report. Requires SSL decryption. Free.',
    alternates: {
        canonical: 'https://itsectools.com/ngfw',
    },
    openGraph: {
        title: 'Test Your Firewall — SQLi, XSS & IPS Attacks | ITSecTools',
        description: 'Run real attack payloads against your NGFW. SQLi, XSS, Log4j, C2 beacons, and flood tests. Free.',
        url: 'https://itsectools.com/ngfw',
        siteName: 'ITSecTools',
    }
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'NGFW & IPS Testing Tool',
    applicationCategory: 'SecurityApplication',
    description: 'Validate NGFW and Intrusion Prevention System (IPS) policies. Run SQLi, XSS, AET evasions, and Command & Control checks.',
    url: 'https://itsectools.com/ngfw',
    featureList: [
        'IPS Signature Testing: Run real-time intrusion prevention tests including SQL Injection (SQLi), Cross-Site Scripting (XSS), and Path Traversal attack simulations.',
        'Advanced Evasion Techniques (AET): Validate firewall inspection capabilities against Log4j header injections, Hex-encoded SQLi, and Shellshock probes.',
        'Command & Control (C2) Simulations: Test outbound traffic policies using encoded path traversal exfiltration, web shell beacons, and ActiveX dropper delivery.',
        'Run All Tests: Execute IPS, AET, and C2C suites sequentially with configurable IP shun cooldown delay. Combined summary of all 9 attacks.',
        'Network IP Flooder: Fire 30 continuous URL-based IPS attacks (SQL injection, path traversal, system file disclosure) to stress-test firewall throughput and signature matching under load.',
        'PDF Assessment Report: Auto-generated scorecard with IPS and evasion category breakdown, gap analysis, and remediation recommendations.'
    ]
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'How do I test my firewall IPS rules online?',
            acceptedAnswer: { '@type': 'Answer', text: 'ITSecTools sends live attack payloads (SQLi, XSS, Path Traversal) through your network. If your NGFW blocks them (HTTP 403/503 or connection reset), your IPS rules are working. SSL Decryption must be enabled for HTTPS inspection.' }
        },
        {
            '@type': 'Question',
            name: 'What evasion techniques does ITSecTools test against?',
            acceptedAnswer: { '@type': 'Answer', text: 'ITSecTools tests Log4j JNDI header injection, Hex/URL-encoded SQL injection (anti-normalization), and Shellshock Bash function injection in HTTP headers — techniques attackers use to bypass signature-based detection.' }
        },
        {
            '@type': 'Question',
            name: 'Can ITSecTools detect Command and Control (C2) beacon traffic?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. The C2 simulation module tests OOB data exfiltration, web shell command beacons, and Python reverse shell stagers to verify your firewall detects and blocks unauthorized outbound traffic.' }
        },
        {
            '@type': 'Question',
            name: 'Do I need SSL decryption enabled for NGFW testing?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. Since tests run over HTTPS (port 443), your firewall must have SSL/TLS decryption (DPI-SSL) enabled for the domain to inspect the encrypted payloads. Without decryption, the firewall cannot see the attack signatures.' }
        },
        {
            '@type': 'Question',
            name: 'Can I generate a firewall security assessment report?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. After running IPS, evasion, and C2 tests, click "Generate Report" to download a branded PDF with a score gauge, per-category breakdown bars, detailed test results, identified gaps, and actionable recommendations. Everything is generated client-side.' }
        },
        {
            '@type': 'Question',
            name: 'What is the Network IP Flooder and how does it work?',
            acceptedAnswer: { '@type': 'Answer', text: 'The Network IP Flooder fires 30 continuous IPS attack patterns (SQL injection, path traversal, encoded traversal, system file disclosure) in rapid succession. Each request hits a unique URL path to avoid browser connection reuse. It tests your firewall throughput and signature detection under sustained attack load.' }
        }
    ]
};

export default function NGFWLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            {children}
        </>
    );
}
