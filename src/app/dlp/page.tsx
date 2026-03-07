import DLPClient from './DLPClient';

export default function DLPPage() {
    return (
        <>
            <DLPClient />

            {/* SEO Content Section - Server-rendered, collapsible for clean UI */}
            <details className="seo-details">
                <summary>Learn more about this tool</summary>
                <div className="seo-content">
                    <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem' }}>Free DLP Testing &amp; Regex Builder Tool</h2>
                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                        ITSecTools provides a comprehensive Data Loss Prevention (DLP) testing suite that goes beyond simple file upload tests. Generate dynamic documents containing PII, PCI, or PHI data on the fly — preventing static hash fingerprinting that bypasses basic DLP solutions. Test multi-protocol transfers over HTTP, HTTPS, and FTP, inspect file metadata and classification labels, and simulate advanced evasion techniques including Base64 encoding, renamed file extensions, password-protected archives, and nested ZIP files.
                    </p>

                    <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>File Label Identifier &amp; Classification Checker</h3>
                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                        A unique capability not found in other free DLP testing tools. Upload any document and the engine deep-scans it to detect sensitivity labels and classification markings using multiple detection methods:
                    </p>
                    <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: '0 0 1.5rem 0' }}>
                        <li><strong>DOCX/XLSX Label Extraction</strong> — Parses the ZIP archive structure to read Microsoft Information Protection (MIP) classification labels from <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px', fontSize: '0.85rem' }}>docProps/custom.xml</code> (e.g., Confidential, Internal, Public, Top Secret).</li>
                        <li><strong>PDF Metadata Scanning</strong> — Extracts Classification and Label properties directly from PDF metadata dictionaries using raw binary parsing.</li>
                        <li><strong>Content-Level DLP Matching</strong> — When no explicit label exists, scans file content for PII patterns (SSN), PCI data (credit card numbers), and keyword-based classification markers.</li>
                        <li><strong>File Integrity Hashing</strong> — Computes MD5 and SHA-256 hashes for verification and threat intelligence lookups.</li>
                        <li><strong>Color-Coded Results</strong> — Sensitivity levels are visually coded: Red (Confidential/Secret), Blue (Internal), Green (Public) with classification tags.</li>
                    </ul>

                    <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>DLP Test Data Generator (Evasion Testing)</h3>
                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                        Test whether your DLP solution can detect sensitive data hidden behind common evasion techniques used by insiders and attackers. The DLP Test Data Generator creates real DLP test payloads for exfiltration simulation — not simulated traffic — that challenge your DLP engine&#39;s inspection capabilities:
                    </p>
                    <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: '0 0 1.5rem 0' }}>
                        <li><strong>Renamed File Extensions (True File Typing)</strong> — Generates valid DOCX documents containing sensitive data but saved with fake extensions like <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px', fontSize: '0.85rem' }}>.jpg</code> or <code style={{ background: '#F1F5F9', padding: '0.1rem 0.4rem', borderRadius: '3px', fontSize: '0.85rem' }}>.png</code>. Tests whether your DLP inspects file magic numbers (file signatures) rather than trusting the extension.</li>
                        <li><strong>Base64 Encoder/Decoder</strong> — Obfuscates any sensitive text (SSN, credit cards, passwords) into Base64 format. Tests if your DLP can natively decode and inspect Base64-encoded content in transit.</li>
                        <li><strong>Password-Protected Archives (AES-256)</strong> — Generates encrypted ZIP files containing sensitive documents. Tests your DLP&#39;s fail-close vs. fail-open policy — does it block encrypted archives it cannot inspect, or does it let them through?</li>
                        <li><strong>Nested Archives (Depth Limit Testing)</strong> — Wraps sensitive data inside multiple layers of ZIP compression (ZIP-in-ZIP-in-ZIP). Tests your DLP&#39;s maximum archive extraction depth — most solutions stop at 2-3 levels, leaving deeper payloads uninspected.</li>
                    </ul>

                    <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Vendor-Optimized Regex Builder</h3>
                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                        Build regex patterns optimized for your specific DLP vendor. Unlike generic regex tools, ITSecTools understands the differences between PCRE, RE2, Java, and cloud-native regex engines. Simply enter a compliance test data string, and the tool auto-detects its structure, letting you customize 27 match types and generate vendor-ready patterns with plain English explanations.
                    </p>

                    <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>Supported DLP Vendors</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {['Forcepoint DLP', 'Forcepoint DSPM', 'Symantec DLP (Broadcom)', 'Palo Alto Networks', 'Zscaler', 'Netskope', 'Trellix DLP', 'Fortinet', 'Microsoft Purview', 'Proofpoint'].map(v => (
                            <span key={v} style={{ background: '#EFF6FF', color: '#1E40AF', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500 }}>{v}</span>
                        ))}
                    </div>

                    <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>What Makes This DLP Tool Different?</h3>
                    <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><strong>Dynamic payload generation</strong> — files are created on the fly, preventing signature/hash-based bypasses.</li>
                        <li><strong>Vendor-specific regex creator and translator</strong> — patterns are translated for each vendor&#39;s regex engine, not generic one-size-fits-all.</li>
                        <li><strong>Failure diagnostics</strong> — when a regex doesn&#39;t match, the tool pinpoints exactly which token failed and where.</li>
                        <li><strong>Evasion testing</strong> — Base64 encoding, renamed extensions, encrypted archives, and nested ZIP depth testing.</li>
                        <li><strong>File label / Classification checker</strong> — upload any document and the engine deep-scans it to detect sensitivity labels and classification markings.</li>
                        <li><strong>Completely free</strong> — no sign-up, no installation, no agents required.</li>
                    </ul>
                </div>
            </details>
        </>
    );
}
