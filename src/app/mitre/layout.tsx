import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MITRE ATT&CK Kill Chain Simulator — Free | ITSecTools',
    description: 'Simulate a 4-stage attack chain — Log4j exploit, PowerShell execution, Mimikatz credential dump, data exfiltration. See which stage your defenses break. Download a kill chain assessment PDF. Free, in-browser.',
    alternates: {
        canonical: 'https://itsectools.com/mitre',
    },
    openGraph: {
        title: 'MITRE ATT&CK Kill Chain Simulator | ITSecTools',
        description: 'Simulate a 4-stage attack — from Log4j to data exfiltration. See where your defenses break.',
        url: 'https://itsectools.com/mitre',
        siteName: 'ITSecTools',
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
        'Simulate T1048.003 Exfiltration Over Unencrypted Protocol',
        'PDF Kill Chain Report with score gauge, stage visualization, risk assessment, and recommendations'
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
            name: 'Can I generate a MITRE ATT&CK simulation report?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. After running the kill chain, click "Generate Report" to download a PDF with a score gauge, stage-by-stage visualization showing where the attack was stopped, risk assessment, and recommendations for closing gaps.' }
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
