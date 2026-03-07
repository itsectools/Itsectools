import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free NGFW & IPS Testing Tool | ITSecTools',
    description: 'Stress-test your Next-Generation Firewall (NGFW) and Intrusion Prevention System (IPS). Simulate threats, SQLi, XSS, Path Traversal, and C2 beacons.',
    alternates: {
        canonical: 'https://itsectools.com/ngfw',
    },
    openGraph: {
        title: 'Free NGFW & IPS Testing Tool | ITSecTools',
        description: 'Validate NGFW and Intrusion Prevention System (IPS) policies with real-time threat simulations.',
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
        'Command & Control (C2) Simulations: Test outbound traffic policies using Python Stagers and Web Shell simulators to verify beacon detection.',
        'Out-of-Band (OOB) Exfiltration: Check for unauthorized data extraction channels by simulating OOB DNS and HTTP data exfiltration.',
        'Protocol Evasion Validation: Test firewall adherence to RFC standards using Jumbo HTTP Headers and HTTP Method Spoofing techniques.'
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
