import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free DLP Testing & Regex Builder Tool | ITSecTools',
    description: 'Test your Data Loss Prevention (DLP) policies with live file upload simulations, multi-format payload generation (PDF, DOCX, XLSX, CSV), metadata inspection, evasion-grade payloads (Base64, nested archives, renamed extensions), and vendor-optimized DLP regex builder supporting Forcepoint, Symantec, Palo Alto, Zscaler, Netskope, Trellix, Fortinet, Microsoft Purview, and Proofpoint.',
    alternates: {
        canonical: 'https://itsectools.com/dlp',
    },
    openGraph: {
        title: 'Free DLP Testing & Regex Builder Tool | ITSecTools',
        description: 'Validate DLP policies with evasion-grade payloads, metadata inspection, and vendor-optimized regex generation for 10 DLP engines.',
    }
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free DLP Testing & Regex Builder Tool',
    applicationCategory: 'SecurityApplication',
    description: 'Online toolkit to validate Data Loss Prevention (DLP) security controls, test file uploads, generate evasion payloads, inspect document classification metadata, and build vendor-optimized regex patterns for 10 major DLP engines.',
    url: 'https://itsectools.com/dlp',
    featureList: [
        'Dynamic Document Generation: Creates fresh PDF, DOCX, XLSX, CSV files with PII/PCI/PHI data on the fly — prevents static hash fingerprinting.',
        'Multi-Protocol Testing: Test data leakage simulations across HTTP, HTTPS, and FTP for inspection coverage.',
        'File Metadata Checker: Analyze uploaded files for classification labels, sensitivity markings, author info, and hidden metadata.',
        'File Label Identifier (Unique): Deep-scans DOCX/XLSX ZIP archives to extract MIP classification labels from docProps/custom.xml, and parses PDF metadata dictionaries for sensitivity properties.',
        'DLP Content Pattern Matching: Detects PII (SSN), PCI (credit card numbers), and keyword-based classification within file content when no explicit label is found.',
        'File Hashing: Computes MD5 and SHA-256 hashes for integrity verification and threat intelligence lookups.',
        'Data-in-Motion Exfiltration: Simulate data leakage with raw text exfiltration to validate inline network inspection.',
        'Renamed File Extensions (True File Typing): Generate valid documents with fake extensions (e.g., .jpg) to verify magic-number based file type detection.',
        'Base64 Encoder/Decoder: Obfuscate sensitive strings into Base64 to test decoding capabilities of inline appliances.',
        'Password-Protected Archives: Generate AES-encrypted ZIP files to test fail-close or fail-open archive inspection policies.',
        'Nested Archives (Depth Testing): Wrap sensitive data in multiple layers of ZIP compression to test extraction depth limits.',
        'Regex Creator: Auto-analyze DLP test payloads into segments, customize 27 match types, and generate vendor-optimized regex patterns.',
        'Regex Translator & Tester: Translate any regex into vendor-specific syntax and test it with instant match diagnostics and failure pinpointing.',
        '10 Vendor Engines: Forcepoint DLP, Forcepoint DSPM, Symantec DLP, Palo Alto Networks, Zscaler, Netskope, Trellix DLP, Fortinet, Microsoft Purview, and Proofpoint.',
        'Regex Failure Diagnostics: Pinpoints exactly where a test string fails to match — shows which token broke and what was expected vs. found.',
        'Plain English Regex Explanations: Every regex includes a step-by-step human-readable breakdown of what it matches.'
    ]
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'How do I test my DLP policies online?',
            acceptedAnswer: { '@type': 'Answer', text: 'ITSecTools lets you upload or generate test files (PDF, DOCX, XLSX, CSV) containing PII, PCI, or PHI data and attempt to transfer them over HTTP/HTTPS/FTP. If your DLP solution blocks the transfer, your policies are working correctly.' }
        },
        {
            '@type': 'Question',
            name: 'What is a DLP regex builder and why do I need one?',
            acceptedAnswer: { '@type': 'Answer', text: 'A DLP regex builder helps you create regular expression patterns that match sensitive data like credit card numbers, medical record numbers, or employee IDs. ITSecTools generates vendor-optimized regex for 10 DLP engines including Forcepoint, Symantec, Palo Alto, Zscaler, and Netskope — each with different syntax requirements.' }
        },
        {
            '@type': 'Question',
            name: 'Which DLP vendors are supported for regex generation?',
            acceptedAnswer: { '@type': 'Answer', text: 'ITSecTools supports Forcepoint DLP, Forcepoint DSPM, Symantec DLP (Broadcom), Palo Alto Networks, Zscaler, Netskope, Trellix DLP, Fortinet, Microsoft Purview, and Proofpoint. Each vendor uses a different regex engine (PCRE, RE2, Java, etc.), and the tool translates patterns accordingly.' }
        },
        {
            '@type': 'Question',
            name: 'How do I test if my DLP can inspect base64 encoded data or nested archives?',
            acceptedAnswer: { '@type': 'Answer', text: 'Use the DLP Test Data Generator to create Base64-encoded data, renamed file extensions (e.g., .docx renamed to .jpg), password-protected ZIP archives, or nested archive files. If your DLP blocks these, it has strong evasion detection capabilities.' }
        },
        {
            '@type': 'Question',
            name: 'Can I check document classification labels and sensitivity markings with this tool?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. The File Label Identifier deep-scans uploaded DOCX and XLSX files by parsing their ZIP archive structure to extract Microsoft Information Protection (MIP) classification labels from docProps/custom.xml. For PDFs, it reads classification properties directly from the metadata dictionary. If no explicit label is found, it performs content-level DLP pattern matching for PII (SSN), PCI (credit card numbers), and keyword-based classification. Results are color-coded by sensitivity level with MD5 and SHA-256 hashes for verification.' }
        },
        {
            '@type': 'Question',
            name: 'Is ITSecTools free to use?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes, ITSecTools is completely free. All testing occurs locally in your browser or via stateless API functions. No data is stored, collected, or transmitted to external servers.' }
        }
    ]
};

export default function DLPLayout({
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
