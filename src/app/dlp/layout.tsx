import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Test Your DLP Policy — Advanced DLP Testing & MCP Protocol Exfiltration | ITSecTools',
    description: 'The only free DLP testing tool with Advanced DLP Tests: MCP Protocol Testing (nested JSON exfiltration), multi-protocol uploads (HTTP/HTTPS/FTP), endpoint DLP detection, PDF validation reports, and vendor-specific regex for 10 engines. No signup.',
    alternates: {
        canonical: 'https://itsectools.com/dlp',
    },
    openGraph: {
        title: 'Test Your DLP Policy — Advanced DLP Testing & MCP Protocol Exfiltration | ITSecTools',
        description: 'The only free tool with MCP Protocol Testing — test if your DLP detects sensitive data inside nested JSON-RPC payloads used by AI agents. Plus multi-protocol uploads, endpoint DLP detection, and PDF reports.',
        url: 'https://itsectools.com/dlp',
        siteName: 'ITSecTools',
    }
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'DLP Validator & Regex Builder',
    applicationCategory: 'SecurityApplication',
    description: 'Test DLP policies by uploading files with sensitive data across HTTP, HTTPS, and FTP. Build regex patterns for 10 vendor engines.',
    url: 'https://itsectools.com/dlp',
    featureList: [
        'Multi-protocol data leakage testing (HTTP, HTTPS, FTP)',
        'Fresh PII/PCI/PHI document generation (PDF, DOCX, XLSX, CSV)',
        'Evasion payloads — Base64, renamed extensions, encrypted archives, nested ZIPs',
        'Vendor-specific regex builder for 10 DLP engines',
        'File classification label inspection (MIP labels, metadata)',
        'Endpoint DLP agent detection — distinguishes endpoint vs. network blocks',
        'PDF Validation Report — auto-generated scorecard with protocol coverage, data category gaps, and recommendations',
        'MCP Protocol Testing — test whether DLP detects sensitive data inside nested JSON-RPC payloads used by AI agents and APIs'
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
            name: 'Can ITSecTools detect Endpoint DLP agents blocking uploads?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. ITSecTools is the only free DLP testing tool that can detect and report when an Endpoint DLP agent (such as Forcepoint or Symantec) blocks a file upload at the browser level — even in inline/proxy mode. When an endpoint agent intercepts the upload, ITSecTools displays: "BLOCKED: Upload intercepted by Endpoint DLP agent before data reached the browser." This clearly distinguishes endpoint-level blocks from network/proxy DLP blocks, helping security teams validate both layers independently.' }
        },
        {
            '@type': 'Question',
            name: 'Why does my DLP block CSV/XLSX downloads but not DOCX/PDF?',
            acceptedAnswer: { '@type': 'Answer', text: 'CSV files are plain text and XLSX files have XML-based content — both are easily parseable by DLP engines. DOCX files are OOXML ZIP archives requiring decompression and XML parsing, while PDF files store text inside compressed content stream objects. Many network-based proxy DLP solutions lack deep file parsing for these complex formats. If your DLP misses DOCX/PDF, check your DLP policy for file type inspection depth settings or consider using Endpoint DLP agents which typically handle these formats better.' }
        },
        {
            '@type': 'Question',
            name: 'What is MCP Protocol Testing and why does it matter for DLP?',
            acceptedAnswer: { '@type': 'Answer', text: 'MCP (Model Context Protocol) is the protocol AI agents use to communicate with external tools via JSON-RPC. ITSecTools tests whether your DLP can detect sensitive data (PII, PCI, PHI) buried inside nested JSON-RPC payloads at configurable depths (2, 4, or 6 levels). Many DLP engines only scan flat text — this test reveals whether they can parse deeply nested JSON structures that AI tools and modern APIs use to transmit data.' }
        },
        {
            '@type': 'Question',
            name: 'Can I generate a DLP validation report?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. After running your tests, click "Generate Report" to download a branded PDF with a score gauge, protocol coverage matrix, data category breakdown, identified gaps, and actionable recommendations. The report is generated client-side — no data leaves your browser.' }
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
