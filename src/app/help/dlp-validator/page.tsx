import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'DLP Validator Guide — How to Test DLP Policies | ITSecTools',
    description: 'Learn how to use ITSecTools DLP Validator: upload sensitive test files over HTTP/HTTPS/FTP, inspect file metadata & labels, build vendor-specific regex patterns, and generate evasion payloads.',
    alternates: { canonical: 'https://itsectools.com/help/dlp-validator' },
};

export default function DLPGuide() {
    return (
        <div>
            <nav style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <Link href="/help" style={{ color: '#6366F1', textDecoration: 'none' }}>← Back to Help</Link>
            </nav>

            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.5rem' }}>DLP Validator — Complete Guide</h1>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
                    Feature-by-feature walkthrough of every capability in the DLP testing suite.
                </p>
            </header>

            {/* Table of Contents */}
            <section style={{ background: '#F8FAFC', borderRadius: '12px', padding: '1.5rem 2rem', marginBottom: '2rem', border: '1px solid #E2E8F0' }}>
                <h2 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>On This Page</h2>
                <ol style={{ paddingLeft: '1.25rem', margin: 0, color: '#6366F1', fontSize: '0.9rem', lineHeight: 2 }}>
                    <li><a href="#file-upload" style={{ color: 'inherit', textDecoration: 'none' }}>File Upload Testing (HTTP/HTTPS/FTP)</a></li>
                    <li><a href="#download-test" style={{ color: 'inherit', textDecoration: 'none' }}>Download Test Documents</a></li>
                    <li><a href="#raw-text" style={{ color: 'inherit', textDecoration: 'none' }}>Raw Text POST</a></li>
                    <li><a href="#metadata" style={{ color: 'inherit', textDecoration: 'none' }}>File Metadata &amp; Label Checker</a></li>
                    <li><a href="#regex-creator" style={{ color: 'inherit', textDecoration: 'none' }}>Regex Creator</a></li>
                    <li><a href="#regex-translator" style={{ color: 'inherit', textDecoration: 'none' }}>Regex Translator</a></li>
                    <li><a href="#advanced-payloads" style={{ color: 'inherit', textDecoration: 'none' }}>DLP Test Data Generator</a></li>
                    <li><a href="#endpoint-dlp" style={{ color: 'inherit', textDecoration: 'none' }}>Unique: Endpoint DLP Agent Detection</a></li>
                </ol>
            </section>

            {/* File Upload Testing */}
            <section id="file-upload" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #EEF2FF' }}>1. File Upload Testing</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Upload any file through three different protocols to test whether your DLP solution inspects traffic across all channels.
                </p>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>How to Use</h3>
                    <ol style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li>Navigate to <strong>DLP Validator</strong> → <strong>Upload</strong> tab.</li>
                        <li>Select your file using the file picker.</li>
                        <li>Choose a protocol: <strong>HTTP</strong> (port 80), <strong>HTTPS</strong> (port 443), or <strong>FTP</strong> (port 21).</li>
                        <li>Click the upload button for your chosen protocol.</li>
                        <li>Check the result — if your DLP blocks the upload, you'll see a blocked status; if it passes through, the upload succeeds.</li>
                    </ol>
                </div>

                <div style={{ background: '#FFFBEB', borderRadius: '8px', padding: '1rem', border: '1px solid #FDE68A', fontSize: '0.9rem', color: '#92400E' }}>
                    <strong>💡 Tip:</strong> Use the <strong>Sample Data Download</strong> tab to generate DLP test payloads containing realistic compliance test data (PII, PCI, PHI) so you&apos;re testing with dynamic content, not static hash-matched samples.
                </div>
            </section>

            {/* Download Test Documents */}
            <section id="download-test" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #EEF2FF' }}>2. Download Test Documents</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Generate dynamic documents with realistic compliance test data patterns for DLP testing. Each payload creates a unique file — preventing static hash fingerprinting from bypassing your DLP.
                </p>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Available Data Types</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><strong>PII (Personally Identifiable Information)</strong> — Social Security Numbers, names, addresses, phone numbers, dates of birth.</li>
                        <li><strong>PCI (Payment Card Industry)</strong> — Credit card numbers (Visa, MasterCard, Amex), CVVs, expiration dates, cardholder names.</li>
                        <li><strong>PHI (Protected Health Information)</strong> — Medical record numbers, patient names, diagnosis codes, treatment records.</li>
                    </ul>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Available File Formats</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {['PDF', 'DOCX', 'XLSX', 'CSV'].map(fmt => (
                            <span key={fmt} style={{ background: '#EEF2FF', color: '#4338CA', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500 }}>{fmt}</span>
                        ))}
                    </div>
                </div>

                <div style={{ background: '#EFF6FF', borderRadius: '8px', padding: '1.25rem', border: '1px solid #93C5FD', fontSize: '0.9rem', color: '#1E40AF', marginBottom: '1rem' }}>
                    <strong>🔍 Proxy Mode DLP Validation</strong>
                    <p style={{ margin: '0.75rem 0 0 0', lineHeight: 1.6 }}>
                        ITSecTools validates DLP configured in <strong>proxy/inline mode</strong> by generating documents with embedded PII, PCI, and PHI data and downloading them over HTTPS. This tests whether your DLP engine can intercept and inspect file content during transit — not just at the endpoint level.
                    </p>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', lineHeight: 1.8 }}>
                        <li><strong>CSV</strong> — Plain text with comma-delimited fields. Easily parseable by all DLP engines.</li>
                        <li><strong>XLSX</strong> — XML-based spreadsheet inside a ZIP archive. Most DLP engines parse this format reliably.</li>
                        <li><strong>DOCX</strong> — OOXML ZIP archive. The DLP engine must decompress the ZIP, parse <code style={{ background: '#DBEAFE', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>word/document.xml</code>, and extract text content before applying pattern matching.</li>
                        <li><strong>PDF</strong> — Binary format with text inside content stream objects (often FlateDecode compressed). Requires the DLP engine to parse the PDF structure, decompress streams, and extract text.</li>
                    </ul>
                    <p style={{ margin: '0.5rem 0 0 0', lineHeight: 1.6 }}>
                        Each download is <strong>dynamically generated</strong> with fresh data to prevent static hash fingerprinting. If your proxy DLP blocks the download, it confirms the engine is performing real-time content inspection on that file format. Testing all four formats reveals the depth of your DLP engine&apos;s file parsing capabilities.
                    </p>
                </div>
            </section>

            {/* Raw Text POST */}
            <section id="raw-text" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #EEF2FF' }}>3. Raw Text POST</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Execute a data-in-motion exfiltration simulation via HTTP or HTTPS POST. Tests whether your DLP solution scans inline text — not just file attachments.
                    By selecting <strong>HTTP</strong>, the platform proxies the payload unencrypted over Port 80, ensuring inline network firewalls can inspect the egress traffic.
                </p>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>How to Use</h3>
                    <ol style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li>Switch to the <strong>Text POST</strong> tab.</li>
                        <li>Enter or paste text containing sensitive data (e.g., <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>SSN: 123-45-6789</code>).</li>
                        <li>Click <strong>Send POST</strong>.</li>
                        <li>If your DLP inspects data-in-motion exfiltration, it should detect and block the request.</li>
                    </ol>
                </div>
            </section>

            {/* File Metadata & Label Checker */}
            <section id="metadata" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #EEF2FF' }}>4. File Metadata &amp; Label Checker</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Upload any document to deep-scan it for sensitivity labels, classification markings, content-level DLP patterns, and file integrity hashes. This is a capability not found in most free DLP testing tools.
                </p>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Detection Methods</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><strong>DOCX/XLSX Label Extraction</strong> — Reads Microsoft Information Protection (MIP) labels from <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>docProps/custom.xml</code> inside the ZIP archive. Detects labels like Confidential, Internal, Public, Top Secret.</li>
                        <li><strong>PDF Metadata Scanning</strong> — Extracts Classification and Label properties from PDF metadata dictionaries using raw binary parsing.</li>
                        <li><strong>Content-Level DLP Matching</strong> — Scans file content for PII patterns (SSN), PCI data (credit card numbers), and keyword-based classification markers.</li>
                        <li><strong>File Integrity Hashing</strong> — Computes MD5 and SHA-256 hashes for verification and threat intelligence lookups.</li>
                    </ul>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Color-Coded Results</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><span style={{ color: '#DC2626', fontWeight: 600 }}>● Red</span> — Confidential / Secret / Top Secret</li>
                        <li><span style={{ color: '#2563EB', fontWeight: 600 }}>● Blue</span> — Internal / Restricted</li>
                        <li><span style={{ color: '#16A34A', fontWeight: 600 }}>● Green</span> — Public / Unclassified</li>
                    </ul>
                </div>
            </section>

            {/* Regex Creator */}
            <section id="regex-creator" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #EEF2FF' }}>5. Regex Creator</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Build DLP regex patterns from a sample text string. The tool auto-detects the data structure (e.g., digits, letters, separators) and lets you customize each segment&apos;s match type and quantity before generating a vendor-optimized regex pattern.
                </p>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>How to Use</h3>
                    <ol style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li>Switch to the <strong>Regex</strong> tab, then select <strong>Regex Creator</strong>.</li>
                        <li>Enter a <strong>sample text</strong> (e.g., <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>MRN:1234567</code>).</li>
                        <li>Click <strong>Analyze</strong> — the tool auto-detects each segment&apos;s type (letters, digits, separator, etc.).</li>
                        <li>Refine each segment&apos;s <strong>match type</strong> (27 options: exact digits, any digit, hex, alphanumeric, etc.) and <strong>quantity</strong> (exact, range, one-or-more).</li>
                        <li>Select your <strong>target DLP vendor</strong> (Forcepoint, Symantec, Palo Alto, Zscaler, Netskope, Trellix, Microsoft Purview, Proofpoint, Fortinet).</li>
                        <li>Click <strong>Generate Regex</strong> — the tool outputs a vendor-optimized pattern with a plain English explanation.</li>
                        <li>Optionally enter a <strong>test string</strong> and click <strong>Test</strong> to validate the pattern matches your data.</li>
                    </ol>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Supported DLP Vendors</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {['Forcepoint DLP', 'Forcepoint DSPM', 'Symantec (Broadcom)', 'Palo Alto Networks', 'Zscaler', 'Netskope', 'Trellix DLP', 'Fortinet', 'Microsoft Purview', 'Proofpoint'].map(v => (
                            <span key={v} style={{ background: '#EFF6FF', color: '#1E40AF', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500 }}>{v}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Regex Translator */}
            <section id="regex-translator" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #EEF2FF' }}>6. Regex Translator</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Convert any existing regex pattern into a vendor-optimized version for your target DLP platform. Handles syntax differences between PCRE, RE2, Java, and cloud-native regex engines automatically.
                </p>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>How to Use</h3>
                    <ol style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li>Switch to the <strong>Regex</strong> tab, then select <strong>Regex Translator</strong>.</li>
                        <li>Paste your <strong>existing regex pattern</strong> into the input field.</li>
                        <li>Select your <strong>target DLP vendor</strong>.</li>
                        <li>Optionally enter a <strong>test string</strong> to validate the translated pattern.</li>
                        <li>Click <strong>Translate &amp; Test</strong> — the tool outputs the vendor-optimized regex and shows whether it matches your test string.</li>
                    </ol>
                </div>
            </section>

            {/* DLP Test Data Generator */}
            <section id="advanced-payloads" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #EEF2FF' }}>7. DLP Test Data Generator</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    Generate real test files that challenge your DLP engine&apos;s inspection depth. These are actual downloadable files — not simulated traffic — designed to test how your DLP handles common evasion techniques.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.5rem' }}>Renamed Extensions</h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                            Generates a valid DOCX document with sensitive data but saves it as <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>.jpg</code> or <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>.png</code>. Tests whether your DLP inspects <strong>file magic numbers</strong> (file signatures) rather than trusting the extension.
                        </p>
                    </div>
                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.5rem' }}>Base64 Encoding</h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                            Obfuscates sensitive text (SSN, credit cards) into Base64 format. Tests if your DLP can <strong>decode and inspect Base64-encoded content</strong> in transit.
                        </p>
                    </div>
                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.5rem' }}>Password-Protected Archives</h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                            Generates AES-256 encrypted ZIP files with sensitive documents inside. Tests your DLP&apos;s <strong>fail-close vs. fail-open policy</strong> — does it block archives it can&apos;t inspect, or let them through?
                        </p>
                    </div>
                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.5rem' }}>Nested Archives</h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                            Wraps sensitive data inside multiple ZIP layers (ZIP-in-ZIP-in-ZIP). Tests your DLP&apos;s <strong>maximum archive extraction depth</strong> — most solutions stop at 2-3 levels.
                        </p>
                    </div>
                </div>
            </section>

            {/* Unique Capability: Endpoint DLP Detection */}
            <section id="endpoint-dlp" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #EEF2FF' }}>Unique Capability: Endpoint DLP Agent Detection</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    ITSecTools is the only free online DLP testing tool that can detect and report when an <strong>Endpoint DLP agent</strong> blocks a file upload at the browser level — even when the DLP is configured in <strong>inline/proxy mode</strong>. When an endpoint agent intercepts the upload before data leaves the browser, ITSecTools provides a clear, actionable message:
                </p>

                <div style={{ background: '#0F172A', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#F87171' }}>
                    BLOCKED: HTTP Upload intercepted by Endpoint DLP agent before data reached the browser.
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Why This Matters</h3>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li>Most DLP testing tools silently fail or show generic &quot;upload failed&quot; errors — they cannot tell you <strong>why</strong> or <strong>where</strong> the block occurred.</li>
                        <li>ITSecTools clearly differentiates between <strong>network/proxy DLP blocks</strong> (intercepted during file transmission) and <strong>endpoint DLP blocks</strong> (intercepted before data even leaves the browser).</li>
                        <li>This helps security teams confirm their endpoint DLP agent is actively enforcing policies, even on machines that also have network-based proxy DLP enabled.</li>
                        <li>Compatible with <strong>Forcepoint DLP</strong>, <strong>Symantec Endpoint DLP</strong>, and other endpoint DLP agents that operate at the browser level.</li>
                    </ul>
                </div>

                <div style={{ background: '#F0FDF4', borderRadius: '8px', padding: '1.25rem', border: '1px solid #86EFAC', fontSize: '0.9rem', color: '#166534' }}>
                    <strong>Not Available Elsewhere:</strong> Other free DLP testing websites (e.g., dlptest.com) can only validate network/proxy DLP by checking if file transfers are blocked on the wire. They have no ability to detect or report endpoint-level DLP interception. ITSecTools is uniquely designed for organizations running endpoint and network DLP in parallel — giving visibility into both layers from a single test.
                </div>
            </section>

            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Link href="/dlp" style={{ background: '#6366F1', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                    Open DLP Validator →
                </Link>
            </div>
        </div>
    );
}
