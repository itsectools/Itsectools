import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MITRE ATT&CK Kill Chain Simulator | ITSecTools',
    description: 'Run an interactive MITRE ATT&CK kill chain simulation to validate your NGFW, IPS, and EDR controls. Test Initial Access, Execution, Credential Access, and Exfiltration.',
    alternates: {
        canonical: 'https://itsectools.com/mitre',
    },
    openGraph: {
        title: 'MITRE ATT&CK Simulator | ITSecTools',
        description: 'Interactive MITRE ATT&CK kill chain simulator for testing perimeter defenses.',
    }
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MITRE ATT&CK Kill Chain Simulator',
    applicationCategory: 'SecurityApplication',
    description: 'Run an interactive MITRE ATT&CK kill chain simulation to validate your NGFW, IPS, and EDR controls directly from your browser.',
    url: 'https://itsectools.com/mitre',
    featureList: [
        'Simulate T1190 Exploit Public-Facing Application (Log4j)',
        'Simulate T1059.001 PowerShell Execution',
        'Simulate T1003.001 OS Credential Dumping (Mimikatz)',
        'Simulate T1048.003 Exfiltration Over Unencrypted Protocol'
    ]
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'What is a MITRE ATT&CK kill chain simulation?',
            acceptedAnswer: { '@type': 'Answer', text: 'A kill chain simulation executes multiple attack stages sequentially — Initial Access, Execution, Credential Access, and Exfiltration — to test whether your security controls can break the chain at any point, mimicking how a real attacker operates.' }
        },
        {
            '@type': 'Question',
            name: 'What MITRE techniques does ITSecTools simulate?',
            acceptedAnswer: { '@type': 'Answer', text: 'ITSecTools simulates T1190 (Exploit Public-Facing Application via Log4j), T1059.001 (PowerShell download cradle), T1003.001 (OS Credential Dumping via Mimikatz strings), and T1048.003 (Exfiltration over unencrypted protocol).' }
        },
        {
            '@type': 'Question',
            name: 'Is the MITRE ATT&CK simulation safe to run?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. All simulations use benign payloads designed to trigger detection signatures without performing any real malicious actions. The test traffic targets your own infrastructure through the browser.' }
        }
    ]
};

export default function MitreLayout({
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
