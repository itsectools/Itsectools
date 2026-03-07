import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Read file structure
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentRaw = buffer.toString('binary');

        // --- 1. DOCX/XLSX Metadata Extraction (Custom Properties) ---
        // Parses the ZIP structure to find 'docProps/custom.xml' and 'docProps/core.xml' without external libs
        let label = 'NO LABEL DETECTED';
        let color = '#94A3B8'; // Slate/Grey
        let tags: string[] = [];

        try {
            const zlib = require('zlib');
            // Helper to search for ZIP entries
            const searchZipEntry = (filename: string): string | null => {
                const searchBuf = Buffer.from(filename);
                let idx = buffer.indexOf(searchBuf);
                while (idx > -1) {
                    // Check local header signature (PK\x03\x04) at idx - 30
                    const headerStart = idx - 30;
                    if (headerStart >= 0 && buffer.readUInt32LE(headerStart) === 0x04034b50) {
                        const method = buffer.readUInt16LE(headerStart + 8); // 8 = Deflate, 0 = Store
                        const compressedSize = buffer.readUInt32LE(headerStart + 18);
                        const nameLen = buffer.readUInt16LE(headerStart + 26);
                        const extraLen = buffer.readUInt16LE(headerStart + 28);

                        // Sanity check name length matches
                        if (nameLen === filename.length) {
                            const dataStart = headerStart + 30 + nameLen + extraLen;
                            const compressed = buffer.subarray(dataStart, dataStart + compressedSize);

                            if (method === 8) { // Deflate
                                return zlib.inflateRawSync(compressed).toString();
                            } else if (method === 0) { // Stored
                                return compressed.toString();
                            }
                        }
                    }
                    idx = buffer.indexOf(searchBuf, idx + 1);
                }
                return null;
            };

            // Check Custom Properties (e.g., Classification="Top Secret")
            const customXml = searchZipEntry('docProps/custom.xml');
            if (customXml) {
                // Regex for <property ... name="Classification"><vt:lpwstr>Value</vt:lpwstr>
                const classMatch = /name="Classification".*?>.*?>(.*?)<\//i.exec(customXml);
                if (classMatch && classMatch[1]) {
                    const val = classMatch[1];
                    label = val.toUpperCase();
                    tags.push(val);

                    if (/secret|confidential|restricted/i.test(val)) color = '#DC2626';
                    else if (/internal|proprietary/i.test(val)) color = '#3B82F6';
                    else color = '#10B981';
                }
            }

        } catch (e) { }

        // --- 2. PDF Metadata Extraction (Basic Scanner) ---
        if (contentRaw.includes('%PDF-')) {
            const dictRegex = /\/([a-zA-Z0-9]+)\s*\(([^)\r\n]+)\)/g;
            let match;
            while ((match = dictRegex.exec(contentRaw)) !== null) {
                const key = match[1];
                const val = match[2];
                if (['Classification', 'Label'].includes(key)) {
                    label = val.toUpperCase();
                    tags.push(val);
                    if (/secret|confidential/i.test(val)) color = '#DC2626';
                    else if (/internal/i.test(val)) color = '#3B82F6';
                }
            }
        }

        // --- 3. Fallback: Binary Safe Text Scan for DLP Patterns ---
        const extractedStrings = contentRaw.replace(/[^\x20-\x7E]/g, ' ');
        const scanText = extractedStrings.toLowerCase();
        const filename = file.name.toLowerCase();

        // DLP Pattern Matching (PII / PCI) - Only if no label found yet
        if (label === 'NO LABEL DETECTED') {
            const patterns = {
                email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
                ssn: /\b\d{3}-\d{2}-\d{4}\b/,
                creditCard: /\b(?:\d[ -]*?){13,16}\b/,
            };

            if (patterns.creditCard.test(extractedStrings)) {
                label = 'CONFIDENTIAL';
                color = '#DC2626';
                tags.push('PCI Data (Credit Card)');
            }
            else if (patterns.ssn.test(extractedStrings)) {
                label = 'CONFIDENTIAL';
                color = '#DC2626';
                tags.push('PII Data (SSN)');
            }

            // Keyword Context Scanning
            const keywords = {
                confidential: ['secret', 'confidential', 'sensitive', 'restricted', 'hr-only', 'finance', 'payroll'],
                internal: ['internal', 'employee', 'proprietary', 'not for release', 'do not distribute', 'company private', 'internal'],
                public: ['public release', 'marketing', 'press release', 'distribution: public', 'unclassified', 'public']
            };

            // Priority Check: Confidential > Internal > Public
            if (label === 'NO LABEL DETECTED') {
                if (keywords.confidential.some(k => filename.includes(k) || scanText.includes(k))) {
                    label = 'CONFIDENTIAL';
                    color = '#DC2626';
                    tags.push('Keyword: Confidential');
                } else if (keywords.internal.some(k => filename.includes(k) || scanText.includes(k))) {
                    label = 'INTERNAL';
                    color = '#3B82F6';
                    tags.push('Keyword: Internal');
                } else if (keywords.public.some(k => filename.includes(k) || scanText.includes(k))) {
                    label = 'PUBLIC';
                    color = '#10B981';
                    tags.push('Keyword: Public');
                }
            }
        }

        // --- 4. File Hashing ---
        const crypto = require('crypto');
        const md5Hash = crypto.createHash('md5').update(buffer).digest('hex');
        const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');

        return NextResponse.json({
            label,
            color,
            filename: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified || Date.now(),
            hash: {
                md5: md5Hash,
                sha256: sha256Hash
            },
            tags
        });

    } catch (error) {
        return NextResponse.json({ error: 'Inspection Failed' }, { status: 500 });
    }
}
