'use client';

import React, { useState } from 'react';
import { DownloadIcon, KeyIcon, FileTextIcon, LayersIcon, ShieldIcon } from '@/components/Icons';
import * as zip from '@zip.js/zip.js';

const DEFAULT_PCI_PAYLOAD = `Cardholder Name, Credit Card Number, Expiration Date, CVV, Billing Zip Code
James Smith, 4147-2055-4916-0415, 12/27, 489, 45442
Mary Johnson, 5466-1601-0761-0238, 09/29, 245, 14933
Robert Williams, 4000-2298-7077-1372, 04/27, 925, 27155
Patricia Brown, 3782-088507-55870, 09/29, 8399, 46238
John Jones, 5178-0599-7187-8161, 11/27, 8442, 76604
Jennifer Garcia, 4266-8453-7151-4299, 07/29, 832, 81736
Michael Miller, 3499-625546-35194, 03/26, 8171, 79496
Linda Davis, 5424-1812-9225-7578, 12/28, 132, 70165
William Rodriguez, 4737-0245-0108-1725, 12/29, 255, 32418
Elizabeth Martinez, 4147-2047-2773-7631, 12/27, 3738, 29119`;

export default function AdvancedPayloadGenerator() {
    // 1. Renamed File Extensions
    const [renameText, setRenameText] = useState(DEFAULT_PCI_PAYLOAD);
    const [fakeExt, setFakeExt] = useState('.jpg');

    const handleGenerateRenamed = async () => {
        try {
            // Create a plain text blob (CSV format)
            const blob = new Blob([renameText], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `payload${fakeExt}`;
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (error) {
            console.error('Renamed extension generation failed', error);
            alert('Failed to generate renamed payload');
        }
    };

    // 2. Base64 Encoder/Decoder
    const [b64Input, setB64Input] = useState(DEFAULT_PCI_PAYLOAD);
    const [b64Output, setB64Output] = useState('');
    const [b64Format, setB64Format] = useState<'eml' | 'html' | 'docx'>('eml');

    const handleBase64Action = (action: 'encode' | 'decode') => {
        try {
            if (action === 'encode') {
                const rawBase64 = Buffer.from(b64Input, 'utf-8').toString('base64');
                // RFC 2045 MIME Line Wrapping (76 characters)
                const wrappedBase64 = rawBase64.replace(/(.{76})/g, "$1\n");
                setB64Output(wrappedBase64);
            } else {
                setB64Output(Buffer.from(b64Input, 'base64').toString('utf-8'));
            }
        } catch (error) {
            setB64Output(`Error: Invalid Base64 input`);
        }
    };

    const handleDownloadBase64 = async () => {
        if (!b64Output) return;
        
        try {
            if (b64Format === 'eml') {
                const emlContext = `From: dlp-tester@itsectools.com\r\nTo: admin@example.com\r\nSubject: Base64 Payload Test\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset="utf-8"\r\nContent-Transfer-Encoding: base64\r\n\r\n${b64Output}`;
                const blob = new Blob([emlContext], { type: 'message/rfc822' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'base64_payload.eml';
                a.click();
                URL.revokeObjectURL(a.href);
            } else if (b64Format === 'html') {
                // Remove newlines for the data URI
                const cleanB64 = b64Output.replace(/\n/g, '');
                const htmlContext = `<!DOCTYPE html>\n<html>\n<body>\n<h1>DLP Base64 HTML Test</h1>\n<img src="data:image/png;base64,${cleanB64}" alt="Hidden Payload" />\n</body>\n</html>`;
                const blob = new Blob([htmlContext], { type: 'text/html' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'base64_payload.html';
                a.click();
                URL.revokeObjectURL(a.href);
            } else if (b64Format === 'docx') {
                const { Document, Packer, Paragraph, TextRun } = await import('docx');
                const doc = new Document({
                    sections: [{
                        properties: {},
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "DLP Base64 Extraction Test", bold: true, size: 28 }),
                                ],
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: b64Output }),
                                ],
                            }),
                        ],
                    }],
                });
                const blob = await Packer.toBlob(doc);
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'base64_payload.docx';
                a.click();
                URL.revokeObjectURL(a.href);
            }
        } catch (error) {
            console.error('Base64 download failed', error);
            alert('Failed to generate Base64 file');
        }
    };

    // 3. Password-Protected Archive
    const [pwText, setPwText] = useState(DEFAULT_PCI_PAYLOAD);
    const [pwPassword, setPwPassword] = useState('testing123');
    const [pwStatus, setPwStatus] = useState<string | null>(null);

    const handleGeneratePasswordZip = async () => {
        setPwStatus('Generating encrypted archive...');
        try {
            // Wait to allow React a moment to render the status
            await new Promise(r => setTimeout(r, 150));

            // XOR Obfuscation (Evades Inline DLP Base64 Decoders during POST)
            // We use URI encoding to handle special characters before XORing
            const uriEncoded = encodeURIComponent(pwText);
            const xorString = uriEncoded.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ 0x55)).join('');
            const b64Mask = btoa(xorString);

            const res = await fetch('/api/dlp/generator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: b64Mask, 
                    password: pwPassword
                })
            });

            if (!res.ok) throw new Error(`API Error: ${res.status}`);

            const blob = await res.blob();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `protected_payload.zip`;
            a.click();
            URL.revokeObjectURL(a.href);
            setPwStatus('Success: Archive generated and downloaded.');
        } catch (error: any) {
            console.error('Password zip generation failed', error);
            const msg = error.message || String(error);
            if (error.name === 'TypeError' || msg.includes('fetch') || msg.includes('NetworkError')) {
                setPwStatus('BLOCKED: Connection Reset. The Endpoint DLP actively intercepted the generation upload or the file download.');
            } else {
                setPwStatus(`BLOCKED: File generation failed (${msg}).`);
            }
        }
    };

    // 4. Nested Archive
    const [nestedText, setNestedText] = useState(DEFAULT_PCI_PAYLOAD);
    const [nestedCount, setNestedCount] = useState<number>(3);

    const handleGenerateNestedZip = async () => {
        try {
            let currentBlob: Blob = new Blob([nestedText], { type: 'text/plain' });
            let currentName = 'payload.txt';

            for (let i = 0; i < nestedCount; i++) {
                const blobWriter = new zip.BlobWriter('application/zip');
                const zipWriter = new zip.ZipWriter(blobWriter);

                // For the inner ones, they are blobs.
                await zipWriter.add(currentName, new zip.BlobReader(currentBlob));
                await zipWriter.close();

                currentBlob = await blobWriter.getData();
                currentName = `nested_level_${i + 1}.zip`;
            }

            const a = document.createElement('a');
            a.href = URL.createObjectURL(currentBlob);
            a.download = `nested_payload_${nestedCount}_deep.zip`;
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (error) {
            console.error('Nested zip generation failed', error);
            alert('Failed to generate nested zip');
        }
    };

    // Menu Items array to easily render the sidebar
    const menuItems = [
        { id: 'renamed', label: 'Renamed Extensions', icon: <FileTextIcon width={18} height={18} /> },
        { id: 'base64', label: 'Base64 Encoder', icon: <LayersIcon width={18} height={18} /> },
        { id: 'password', label: 'Password Archiver', icon: <KeyIcon width={18} height={18} /> },
        { id: 'nested', label: 'Nested Archives', icon: <LayersIcon width={18} height={18} /> }
    ];

    const [activeGenerator, setActiveGenerator] = useState<'renamed' | 'base64' | 'password' | 'nested'>('renamed');

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '1rem', marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldIcon width={18} height={18} />
                    Instructions
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#1E3A8A' }}>
                    Select a tool below to generate customized, evasive payloads containing sensitive test data. Once generated, upload the downloaded files to the main <strong>Data Leakage Simulator</strong> section above to test detection capabilities.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: '400px' }}>

                {/* Horizontal Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', flexWrap: 'wrap' }}>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveGenerator(item.id as any)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.85rem 1.25rem',
                                fontSize: '1.05rem',
                                background: activeGenerator === item.id ? '#1E40AF' : '#F8FAFC',
                                color: activeGenerator === item.id ? 'white' : '#64748B',
                                border: '1px solid',
                                borderColor: activeGenerator === item.id ? '#1D4ED8' : '#E2E8F0',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                boxShadow: activeGenerator === item.id ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
                            }}
                            onMouseOver={(e) => {
                                if (activeGenerator !== item.id) {
                                    e.currentTarget.style.background = '#F1F5F9';
                                    e.currentTarget.style.color = '#334155';
                                    e.currentTarget.style.borderColor = '#CBD5E1';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (activeGenerator !== item.id) {
                                    e.currentTarget.style.background = '#F8FAFC';
                                    e.currentTarget.style.color = '#64748B';
                                    e.currentTarget.style.borderColor = '#E2E8F0';
                                }
                            }}
                        >
                            <span style={{ color: activeGenerator === item.id ? '#93C5FD' : '#94A3B8' }}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div>
                    {activeGenerator === 'renamed' && (
                        <div className="card fade-in" style={{ padding: '2rem', border: '1px solid #E2E8F0', height: '100%', boxSizing: 'border-box' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ background: '#EFF6FF', padding: '0.75rem', borderRadius: '8px', color: '#3B82F6' }}>
                                    <FileTextIcon width={28} height={28} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Renamed File Extensions</h3>
                            </div>
                            <p style={{ fontSize: '0.95rem', color: '#64748B', marginBottom: '2rem', lineHeight: '1.5' }}>
                                Generates a plain CSV text file containing your text, but saved with a misleading extension. This helps test if the DLP engine relies on True File Typing (Magic Number checks) rather than just reading the file extension.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '1rem', color: '#0F172A', fontWeight: 600, marginBottom: '0.25rem' }}>Payload Content to Embed</label>
                                    <p style={{ fontSize: '0.95rem', color: '#64748B', margin: '0 0 0.5rem 0' }}>Paste PCI, PII, PHI, or custom keyword test strings into the text box below. This text will be embedded into the body of the generated document.</p>
                                    <textarea
                                        value={renameText}
                                        onChange={(e) => setRenameText(e.target.value)}
                                        placeholder="E.g., Confidential Credit Card Data: 4111-2222-3333-4444"
                                        style={{ width: '100%', height: '120px', padding: '1rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontFamily: 'inherit', resize: 'vertical', fontSize: '0.95rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', background: '#F8FAFC', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '1rem', color: '#475569', fontWeight: 500, marginBottom: '0.5rem' }}>Select Target File Extension</label>
                                        <select
                                            value={fakeExt}
                                            onChange={(e) => setFakeExt(e.target.value)}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'white', fontSize: '0.95rem' }}
                                        >
                                            <option value=".jpg">.jpg (Image Mask)</option>
                                            <option value=".png">.png (Image Mask)</option>
                                            <option value=".pdf">.pdf (Document Mask)</option>
                                            <option value=".txt">.txt (Text Mask)</option>
                                        </select>
                                    </div>
                                    <button className="btn-primary" onClick={handleGenerateRenamed} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '42px', padding: '0 1.5rem', fontSize: '1rem' }}>
                                        <DownloadIcon width={18} height={18} /> Generate & Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeGenerator === 'base64' && (
                        <div className="card fade-in" style={{ padding: '2rem', border: '1px solid #E2E8F0', height: '100%', boxSizing: 'border-box' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ background: '#F3E8FF', padding: '0.75rem', borderRadius: '8px', color: '#9333EA' }}>
                                    <LayersIcon width={28} height={28} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Base64 Encoder / Decoder</h3>
                            </div>
                            <p style={{ fontSize: '0.95rem', color: '#64748B', marginBottom: '2rem', lineHeight: '1.5' }}>
                                Obfuscate data strings into Base64 format. This allows you to verify if the inline DLP engine can decode Base64 payloads natively on-the-fly before running pattern-matching rules.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '1rem', color: '#0F172A', fontWeight: 600, marginBottom: '0.25rem' }}>Enter Text to Encode or Decode</label>
                                    <p style={{ fontSize: '0.95rem', color: '#64748B', margin: '0 0 0.5rem 0' }}>Enter normal text to encode into Base64, or enter a Base64 string to decode.</p>
                                    <textarea
                                        value={b64Input}
                                        onChange={(e) => setB64Input(e.target.value)}
                                        placeholder="Input text to encode/decode..."
                                        style={{ width: '100%', height: '100px', padding: '1rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontFamily: 'inherit', resize: 'vertical', fontSize: '0.95rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="btn-outline" onClick={() => handleBase64Action('encode')} style={{ flex: 1, padding: '0.75rem', borderColor: '#D8B4FE', color: '#7E22CE', fontSize: '0.95rem', fontWeight: 600 }}>
                                        Encode to Base64
                                    </button>
                                    <button className="btn-outline" onClick={() => handleBase64Action('decode')} style={{ flex: 1, padding: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>
                                        Decode Base64
                                    </button>
                                </div>
                                {b64Output && (
                                    <div className="fade-in" style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <label style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>Result:</label>
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                <button
                                                    className="btn-ghost"
                                                    onClick={() => navigator.clipboard.writeText(b64Output)}
                                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                                                >
                                                    Copy
                                                </button>
                                                <div style={{ display: 'flex', border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
                                                    <select
                                                        value={b64Format}
                                                        onChange={(e) => setB64Format(e.target.value as any)}
                                                        style={{ border: 'none', padding: '0.35rem 0.75rem', fontSize: '0.85rem', background: '#F8FAFC', borderRight: '1px solid #CBD5E1', outline: 'none', cursor: 'pointer', color: '#334155' }}
                                                    >
                                                        <option value="eml">.eml (Email MIME)</option>
                                                        <option value="html">.html (Data URI)</option>
                                                        <option value="docx">.docx (Word Document)</option>
                                                    </select>
                                                    <button
                                                        onClick={handleDownloadBase64}
                                                        style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', padding: '0.35rem 0.75rem', fontSize: '0.85rem', background: '#3B82F6', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                                                    >
                                                        <DownloadIcon width={14} height={14} /> Download
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#0F172A', wordBreak: 'break-all', whiteSpace: 'pre-wrap', maxHeight: '150px', overflowY: 'auto' }}>
                                            {b64Output}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeGenerator === 'password' && (
                        <div className="card fade-in" style={{ padding: '2rem', border: '1px solid #E2E8F0', height: '100%', boxSizing: 'border-box' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ background: '#F3E8FF', padding: '0.75rem', borderRadius: '8px', color: '#9333EA' }}>
                                    <KeyIcon width={28} height={28} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Password-Protected Archive</h3>
                            </div>
                            <p style={{ fontSize: '0.95rem', color: '#64748B', marginBottom: '1rem', lineHeight: '1.5' }}>
                                Generates an AES-256 encrypted ZIP file. This is crucial for testing whether the DLP engine handles unreadable encrypted archives by blocking them (fail-close) or allowing them (fail-open).
                            </p>
                            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', padding: '0.75rem', marginBottom: '2rem', fontSize: '0.85rem', color: '#B45309', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <strong>Note:</strong> Native Windows Explorer does not support AES-256 ZIP decryption. You will need 7-Zip or WinRAR to manually extract this file on Windows, but the strong AES encryption is required to properly trigger strict DLP inspection policies.
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {pwStatus && (
                                    <div className="fade-in" style={{
                                        marginBottom: '0.5rem',
                                        padding: '1rem',
                                        background: pwStatus.startsWith('BLOCKED') ? '#FEF2F2' : (pwStatus.startsWith('Success') ? '#F0FDF4' : '#EFF6FF'),
                                        border: `1px solid ${pwStatus.startsWith('BLOCKED') ? '#F87171' : (pwStatus.startsWith('Success') ? '#4ADE80' : '#BFDBFE')}`,
                                        borderRadius: '8px',
                                        color: pwStatus.startsWith('BLOCKED') ? '#B91C1C' : (pwStatus.startsWith('Success') ? '#15803D' : '#1E40AF'),
                                        fontWeight: 600
                                    }}>
                                        {pwStatus}
                                    </div>
                                )}
                                <div>
                                    <label style={{ display: 'block', fontSize: '1rem', color: '#0F172A', fontWeight: 600, marginBottom: '0.25rem' }}>Payload Content to Encrypt</label>
                                    <p style={{ fontSize: '0.95rem', color: '#64748B', margin: '0 0 0.5rem 0' }}>This sensitive text will be saved as "payload.txt" inside the password-protected ZIP archive.</p>
                                    <textarea
                                        value={pwText}
                                        onChange={(e) => setPwText(e.target.value)}
                                        placeholder="E.g., Confidential Credit Card Data: 4111-2222-3333-4444"
                                        style={{ width: '100%', height: '120px', padding: '1rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontFamily: 'inherit', resize: 'vertical', fontSize: '0.95rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', background: '#F8FAFC', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '1rem', color: '#475569', fontWeight: 500, marginBottom: '0.5rem' }}>Set Archive Password</label>
                                        <input
                                            type="text"
                                            value={pwPassword}
                                            onChange={(e) => setPwPassword(e.target.value)}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'white', fontSize: '0.95rem' }}
                                        />
                                    </div>
                                    <button className="btn-primary" onClick={handleGeneratePasswordZip} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '42px', padding: '0 1.5rem', fontSize: '1rem' }}>
                                        <DownloadIcon width={18} height={18} /> Generate Encrypted ZIP
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeGenerator === 'nested' && (
                        <div className="card fade-in" style={{ padding: '2rem', border: '1px solid #E2E8F0', height: '100%', boxSizing: 'border-box' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ background: '#E0E7FF', padding: '0.75rem', borderRadius: '8px', color: '#4338CA' }}>
                                    <LayersIcon width={28} height={28} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Nested Archives</h3>
                            </div>
                            <p style={{ fontSize: '0.95rem', color: '#64748B', marginBottom: '2rem', lineHeight: '1.5' }}>
                                Wraps the sensitive data inside multiple layers of zip compression (a basic zip-bomb technique). Tests the "maximum archive depth" limitation configuration of the NGFW/DLP engine.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '1rem', color: '#0F172A', fontWeight: 600, marginBottom: '0.25rem' }}>Base Payload Content</label>
                                    <p style={{ fontSize: '0.95rem', color: '#64748B', margin: '0 0 0.5rem 0' }}>This text will be saved as "payload.txt" and then zipped multiple times according to your selection below.</p>
                                    <textarea
                                        value={nestedText}
                                        onChange={(e) => setNestedText(e.target.value)}
                                        placeholder="E.g., Confidential Credit Card Data: 4111-2222-3333-4444"
                                        style={{ width: '100%', height: '120px', padding: '1rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontFamily: 'inherit', resize: 'vertical', fontSize: '0.95rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', background: '#F8FAFC', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '1rem', color: '#475569', fontWeight: 500, marginBottom: '0.5rem' }}>Select ZIP Nesting Depth</label>
                                        <select
                                            value={nestedCount}
                                            onChange={(e) => setNestedCount(Number(e.target.value))}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'white', fontSize: '0.95rem' }}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                <option key={num} value={num}>{num} {num === 1 ? 'Layer' : 'Layers'}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button className="btn-primary" onClick={handleGenerateNestedZip} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '42px', padding: '0 1.5rem', fontSize: '1rem' }}>
                                        <DownloadIcon width={18} height={18} /> Generate Nested ZIP
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

