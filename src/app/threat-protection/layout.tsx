import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free Malware Test Files & Threat Protection Validator | ITSecTools',
    description: 'Download safe EICAR test payloads, heuristic malware simulators, and ransomware behavior scripts to validate your Antivirus and Endpoint Detection & Response (EDR) solutions.',
    alternates: {
        canonical: 'https://itsectools.com/threat-protection',
    },
    openGraph: {
        title: 'Free Threat Protection Testing Tool | ITSecTools',
        description: 'Safely validate your AV and EDR solutions with benign malware test payloads and ransomware behaviors.',
    }
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Threat Protection Validator',
    applicationCategory: 'SecurityApplication',
    description: 'Download safe EICAR test payloads, heuristic malware simulators, and ransomware behavior scripts to validate your Antivirus and Endpoint Detection & Response (EDR) solutions.',
    url: 'https://itsectools.com/threat-protection',
    featureList: [
        'Download standard EICAR anti-malware test files',
        'Download heuristic malware simulators (PDF, EXE)',
        'Simulate ransomware test behavior scripts',
        'Validate Endpoint Detection & Response (EDR) alerts'
    ]
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'What is an EICAR test file?',
            acceptedAnswer: { '@type': 'Answer', text: 'EICAR is a standardized test file used to verify antivirus software detection without using real malware. It contains a harmless ASCII string that AV engines are programmed to flag as malicious, confirming your security solution is active and scanning.' }
        },
        {
            '@type': 'Question',
            name: 'How do I test my endpoint protection (EPP) or EDR?',
            acceptedAnswer: { '@type': 'Answer', text: 'Download EICAR test files, heuristic malware simulators (.exe, .pdf, .doc), or ransomware behavior scripts (.vbs) from ITSecTools. If your EPP/EDR blocks or quarantines the download, your endpoint protection is working correctly.' }
        },
        {
            '@type': 'Question',
            name: 'Are the malware test files safe?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. All files are benign simulators containing detection signatures but no actual malicious code. They are designed exclusively for testing whether your security tools detect and block known threat patterns.' }
        }
    ]
};

export default function ThreatProtectionLayout({
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
