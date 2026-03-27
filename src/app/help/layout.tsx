import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Help & Documentation | ITSecTools',
    description: 'Step-by-step guides for DLP testing, firewall validation, MITRE ATT&CK simulation, threat generation, network diagnostics, and PDF report generation.',
    alternates: {
        canonical: 'https://itsectools.com/help',
    },
    openGraph: {
        title: 'Help & Documentation | ITSecTools',
        description: 'Guides for every ITSecTools feature — DLP, NGFW, MITRE, threat gen, and network tools.',
        url: 'https://itsectools.com/help',
        siteName: 'ITSecTools',
    }
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'ITSecTools Help & User Guides',
    description: 'Step-by-step guides for every ITSecTools feature: DLP testing, NGFW validation, MITRE ATT&CK simulation, threat generation, and network telemetry.',
    url: 'https://itsectools.com/help',
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'How do I test my DLP policy with ITSecTools?',
            acceptedAnswer: { '@type': 'Answer', text: 'Navigate to the DLP Validator page, select a data type (PII, PCI, or PHI), choose a file format (PDF, DOCX, XLSX, CSV), and generate a DLP test payload containing realistic sensitive data. Then exfiltrate this payload through your DLP-monitored channels to verify detection.' }
        },
        {
            '@type': 'Question',
            name: 'Do I need SSL Decryption enabled for NGFW tests?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. Since ITSecTools runs over HTTPS, your firewall must have SSL Decryption (DPI-SSL) enabled for the itsectools.com domain. Without decryption, the firewall cannot inspect the attack payloads inside the encrypted tunnel and all tests will show as "allowed".' }
        },
        {
            '@type': 'Question',
            name: 'What is the MITRE ATT&CK kill chain simulator?',
            acceptedAnswer: { '@type': 'Answer', text: 'The simulator executes four attack stages sequentially: Initial Access (Log4j), Execution (PowerShell cradle), Credential Access (Mimikatz patterns), and Exfiltration (cleartext data extraction). It tests whether your perimeter defenses can break the attack chain at any point.' }
        },
        {
            '@type': 'Question',
            name: 'Are the threat test files safe to download?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. All test files — EICAR, heuristic malware samples, and ransomware simulators — are benign. They contain detection signatures that trigger security alerts but perform no actual malicious actions. They are industry-standard tools used by security professionals worldwide.' }
        },
        {
            '@type': 'Question',
            name: 'How does ITSecTools build vendor-specific DLP regex?',
            acceptedAnswer: { '@type': 'Answer', text: 'Enter a compliance test data string (e.g., MRN:1234567), and the Regex Creator auto-detects its structure. You can then customize match types, select your target DLP vendor (Forcepoint, Symantec, Palo Alto, Zscaler, etc.), and generate a regex pattern optimized for that vendor\'s specific regex engine — PCRE, RE2, Java, or cloud-native.' }
        }
    ]
};

export default function HelpLayout({
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
