'use client';

import { useState, useEffect } from 'react';
import { UploadIcon, FileTextIcon, DownloadIcon, CreditCardIcon, HeartIcon, SearchIcon, FileAlertIcon, PlayIcon, LockIcon, LayersIcon } from '@/components/Icons';
import AdvancedPayloadGenerator from '@/components/AdvancedDLP/Generators';
import RegexTools from '@/components/AdvancedDLP/RegexTools';

export default function DLPClient() {
    const [tab, setTab] = useState<'upload' | 'regex' | 'text' | 'download' | 'metadata' | 'generator'>('upload');

    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [textStatus, setTextStatus] = useState<string | null>(null);
    const [metadataStatus, setMetadataStatus] = useState<string | null>(null);
    const [textContent, setTextContent] = useState('');
    const [postProtocol, setPostProtocol] = useState<'HTTPS' | 'HTTP'>('HTTPS');

    const trackEvent = (action: string, category: string, label: string) => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', action, {
                event_category: category,
                event_label: label,
            });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, protocol: 'HTTP' | 'HTTPS' | 'FTP') => {
        if (!e.target.files?.[0]) return;
        trackEvent('file_upload', 'dlp_test', `Protocol: ${protocol}`);

        const file = e.target.files[0];

        // 10MB Limit
        if (file.size > 10 * 1024 * 1024) {
            setUploadStatus(`BLOCKED: File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the 10MB limit.`);
            return;
        }

        setUploadStatus(`Initiating ${protocol} upload...`);

        const formData = new FormData();
        formData.append('file', file);

        // 5s timeout race
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('DLP_TIMEOUT')), 5000)
        );

        try {
            const fetchPromise = fetch('/api/dlp/upload', {
                method: 'POST',
                body: formData
            });

            // Race against timeout
            const res = await Promise.race([fetchPromise, timeoutPromise]) as Response;

            if (res.ok) {
                // If we get here, the DLP Agent FAILED to block it.
                // We should warn the user if the filename looked sensitive.
                const name = file.name.toLowerCase();
                const isSensitive = name.includes('secret') || name.includes('pii') || name.includes('factory');

                if (isSensitive) {
                    setUploadStatus(`⚠️ DATA LEAKED: ${protocol} Transfer Successful (DLP Agent Failed to Block)`);
                } else {
                    setUploadStatus(`ALLOWED: ${protocol} Transfer completed successfully.`);
                }
            } else {
                setUploadStatus(`BLOCKED: Server rejected upload (${res.status}).`);
            }
        } catch (error: any) {
            if (error.message === 'DLP_TIMEOUT') {
                setUploadStatus(`BLOCKED: ${protocol} Upload Timed Out (Dropped by DLP Agent).`);
            } else {
                setUploadStatus(`BLOCKED: ${protocol} Upload Failed (Intercepted by DLP Agent).`);
            }
        }
    };

    const handleMetadataCheck = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        trackEvent('metadata_check', 'dlp_test', 'File Classification Check');
        const file = e.target.files[0];
        setMetadataStatus('Uploading to DLP Engine for deep inspection...');

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Perform Server-Side Metadata Analysis
            const res = await fetch('/api/dlp/inspect', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Inspection Failed');

            const result = await res.json();

            // Artificial delay for realism if fast local
            setTimeout(() => {
                setMetadataStatus(JSON.stringify(result));
            }, 800);

        } catch (error) {
            setMetadataStatus('Error: Failed to inspect file metadata. DLP Engine Unreachable.');
        }
    };

    const handleTextPost = async () => {
        trackEvent('text_post', 'dlp_test', `Protocol: ${postProtocol}`);
        setTextStatus(`Initiating ${postProtocol} POST egress request...`);

        const controller = new AbortController();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => {
                controller.abort();
                reject(new Error('DLP_TIMEOUT'));
            }, 3000)
        );

        try {
            const fetchPromise = fetch('/api/dlp/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: textContent,
                    protocol: postProtocol
                }),
                signal: controller.signal
            });

            const res = await Promise.race([fetchPromise, timeoutPromise]) as Response;
            const data = await res.json();

            if (res.ok) {
                // Check if we sent sensitive data but it wasn't blocked
                if (textContent.toLowerCase().includes('factorytestkeyword') || textContent.includes('secret')) {
                    setTextStatus(`⚠️ DATA LEAKED: ${postProtocol} POST Successful (DLP Agent Failed to Block). Status: ${res.status}`);
                } else {
                    setTextStatus(`SUCCESS: ${postProtocol} POST returned ${res.status} OK (Allowed).`);
                }
            } else {
                setTextStatus(`BLOCKED: ${postProtocol} POST returned ${res.status}. ${data.message || 'Access Denied'}.`);
            }
        } catch (e: any) {
            if (e.message === 'DLP_TIMEOUT' || e.name === 'AbortError') {
                setTextStatus('BLOCKED: Request timed out (likely dropped by DLP Agent).');
            } else {
                setTextStatus('BLOCKED: Network request failed (Interrupted by DLP Agent).');
            }
        }
    };

    const downloadData = (type: 'pii' | 'pci' | 'phi', format: 'csv' | 'docx' | 'pdf' | 'xlsx' = 'csv') => {
        trackEvent('file_download', 'dlp_test', `Type: ${type}, Format: ${format}`);
        // Trigger download via Server-Side API so Network DLP can inspect the traffic
        const downloadUrl = `/api/dlp/download?type=${type}&format=${format}`;

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    let metadataResult = null;
    try {
        if (metadataStatus && metadataStatus.startsWith('{')) {
            metadataResult = JSON.parse(metadataStatus);
        }
    } catch (e) { /* ignore */ }

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.2rem' }}>DLP Verification</h1>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748B' }}>
                    Test Data Loss Prevention policies by simulating sensitive data exfiltration.
                </p>
            </header>

            {/* Tabs */}
            <div className="tabs">
                <div
                    className={`tab ${tab === 'upload' ? 'active' : ''}`}
                    onClick={() => setTab('upload')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <UploadIcon width={18} height={18} /> Data Leakage Simulator
                </div>
                <div
                    className={`tab ${tab === 'metadata' ? 'active' : ''}`}
                    onClick={() => setTab('metadata')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <SearchIcon width={18} height={18} /> File Label / Classification Check
                </div>
                <div
                    className={`tab ${tab === 'regex' ? 'active' : ''}`}
                    onClick={() => setTab('regex')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FileTextIcon width={18} height={18} /> DLP Regex Builder
                </div>
                <div
                    className={`tab ${tab === 'generator' ? 'active' : ''}`}
                    onClick={() => setTab('generator')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <LayersIcon width={18} height={18} /> DLP Test Data Generator
                </div>
                <div
                    className={`tab ${tab === 'download' ? 'active' : ''}`}
                    onClick={() => setTab('download')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <DownloadIcon width={18} height={18} /> Sample Data Download
                </div>
            </div>

            {/* Content Area */}
            <div className="card" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                {tab === 'upload' && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* ... (upload content remains same, just ensuring context match) ... */}

                        {uploadStatus && (
                            <div className="fade-in" style={{
                                padding: '1rem',
                                background: uploadStatus.startsWith('BLOCKED') ? '#FEF2F2' : '#F0FDF4',
                                border: `1px solid ${uploadStatus.startsWith('BLOCKED') ? '#F87171' : '#4ADE80'}`,
                                borderRadius: '8px',
                                color: uploadStatus.startsWith('BLOCKED') ? '#B91C1C' : '#15803D',
                                fontWeight: 600,
                                textAlign: 'center',
                                maxWidth: '600px',
                                margin: '0 auto',
                                width: '100%'
                            }}>
                                {uploadStatus}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {/* HTTP Upload Card */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    border: '2px dashed #3B82F6',
                                    borderRadius: '12px',
                                    padding: '2rem',
                                    background: '#EFF6FF',
                                    marginBottom: '1rem',
                                    transition: 'transform 0.2s',
                                    height: '240px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileUpload(e, 'HTTP')}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0,
                                            cursor: 'pointer',
                                            zIndex: 10
                                        }}
                                    />
                                    <div style={{ marginBottom: '1rem', color: '#2563EB' }}>
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <UploadIcon width={48} height={48} />
                                            <span style={{ position: 'absolute', bottom: -5, right: -5, background: '#2563EB', color: 'white', fontSize: '10px', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>HTTP</span>
                                        </div>
                                    </div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E293B', fontSize: '1.1rem' }}>HTTP Upload</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>Unencrypted web transfer (Port 80)</p>

                                    <div style={{ marginTop: 'auto' }}>
                                        <span style={{ fontWeight: 500, color: '#334155', fontSize: '0.9rem' }}>Drop file or click to upload</span>
                                    </div>
                                </div>
                            </div>

                            {/* HTTPS Upload Card */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    border: '2px dashed #3B82F6',
                                    borderRadius: '12px',
                                    padding: '2rem',
                                    background: '#EFF6FF',
                                    marginBottom: '1rem',
                                    transition: 'transform 0.2s',
                                    height: '240px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileUpload(e, 'HTTPS')}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0,
                                            cursor: 'pointer',
                                            zIndex: 10
                                        }}
                                    />
                                    <div style={{ marginBottom: '1rem', color: '#2563EB' }}>
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <UploadIcon width={48} height={48} />
                                            <span style={{ position: 'absolute', bottom: -5, right: -5, background: '#2563EB', color: 'white', fontSize: '10px', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>HTTPS</span>
                                        </div>
                                    </div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E293B', fontSize: '1.1rem' }}>HTTPS Upload</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>Encrypted web transfer (Port 443)</p>

                                    <div style={{ marginTop: 'auto' }}>
                                        <span style={{ fontWeight: 500, color: '#334155', fontSize: '0.9rem' }}>Drop file or click to upload</span>
                                    </div>
                                </div>
                            </div>

                            {/* FTP Upload Card */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    border: '2px dashed #8B5CF6',
                                    borderRadius: '12px',
                                    padding: '2rem',
                                    background: '#F5F3FF',
                                    marginBottom: '1rem',
                                    transition: 'transform 0.2s',
                                    height: '240px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileUpload(e, 'FTP')}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0,
                                            cursor: 'pointer',
                                            zIndex: 10
                                        }}
                                    />
                                    <div style={{ marginBottom: '1rem', color: '#7C3AED' }}>
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <UploadIcon width={48} height={48} />
                                            <span style={{ position: 'absolute', bottom: -5, right: -5, background: '#7C3AED', color: 'white', fontSize: '10px', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>FTP</span>
                                        </div>
                                    </div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E293B', fontSize: '1.1rem' }}>FTP Upload</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>File Transfer Protocol (Port 21)</p>

                                    <div style={{ marginTop: 'auto' }}>
                                        <span style={{ fontWeight: 500, color: '#334155', fontSize: '0.9rem' }}>Drop file or click to upload</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* HTTP/S POST Simulation Section */}
                        <div style={{ width: '100%', borderTop: '1px solid #E2E8F0', paddingTop: '2rem', marginTop: '1rem' }}>
                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', color: '#0F172A' }}>HTTP/S POST Simulation</h3>
                            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem' }}>
                                Attempt to transmit data via an HTTP POST request to test egress filtering.
                            </p>
                            <div style={{ maxWidth: '600px' }}>
                                {textStatus && (
                                    <div className="fade-in" style={{
                                        marginBottom: '1rem',
                                        padding: '1rem',
                                        background: textStatus.startsWith('BLOCKED') ? '#FEF2F2' : '#F0FDF4',
                                        border: `1px solid ${textStatus.startsWith('BLOCKED') ? '#F87171' : '#4ADE80'}`,
                                        borderRadius: '8px',
                                        color: textStatus.startsWith('BLOCKED') ? '#B91C1C' : '#15803D',
                                        fontWeight: 600,
                                        wordBreak: 'break-all'
                                    }}>
                                        {textStatus}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>Protocol:</span>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="postProtocol"
                                            value="HTTP"
                                            checked={postProtocol === 'HTTP'}
                                            onChange={() => setPostProtocol('HTTP')}
                                        />
                                        HTTP (Port 80)
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="postProtocol"
                                            value="HTTPS"
                                            checked={postProtocol === 'HTTPS'}
                                            onChange={() => setPostProtocol('HTTPS')}
                                        />
                                        HTTPS (Port 443)
                                    </label>
                                </div>

                                <textarea
                                    value={textContent}
                                    onChange={(e) => setTextContent(e.target.value)}
                                    placeholder={`Enter data payload to transmit via ${postProtocol} POST...`}
                                    style={{
                                        width: '100%',
                                        height: '120px',
                                        padding: '1rem',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '8px',
                                        fontFamily: 'inherit',
                                        marginBottom: '1rem',
                                        resize: 'vertical'
                                    }}
                                />
                                <button className="btn-outline" onClick={handleTextPost}>
                                    <PlayIcon width={16} height={16} /> Send POST Request
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'download' && (
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            <div className="card" style={{ border: '1px solid #E2E8F0', padding: '1.5rem' }}>
                                <div style={{ background: '#1E293B', color: 'white', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <FileTextIcon width={24} height={24} />
                                </div>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>PII Test File</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>100+ records: Names, SSNs, Addresses</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <button className="btn-outline" onClick={() => downloadData('pii', 'csv')} style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                                        <DownloadIcon width={14} height={14} /> CSV
                                    </button>
                                    <button className="btn-outline" onClick={() => downloadData('pii', 'xlsx')} style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                                        <DownloadIcon width={14} height={14} /> XLSX
                                    </button>
                                    <button className="btn-outline" onClick={() => downloadData('pii', 'pdf')} style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                                        <DownloadIcon width={14} height={14} /> PDF
                                    </button>
                                    <button className="btn-outline" onClick={() => downloadData('pii', 'docx')} style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                                        <DownloadIcon width={14} height={14} /> DOCX
                                    </button>
                                </div>
                            </div>

                            <div className="card" style={{ border: '1px solid #E2E8F0', padding: '1.5rem' }}>
                                <div style={{ background: '#1E293B', color: 'white', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <CreditCardIcon width={24} height={24} />
                                </div>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>PCI Test File</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>100+ records: CC Numbers, CVVs</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <button className="btn-outline" onClick={() => downloadData('pci', 'csv')} style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                                        <DownloadIcon width={14} height={14} /> CSV
                                    </button>
                                    <button className="btn-outline" onClick={() => downloadData('pci', 'xlsx')} style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                                        <DownloadIcon width={14} height={14} /> XLSX
                                    </button>
                                    <button className="btn-outline" onClick={() => downloadData('pci', 'pdf')} style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                                        <DownloadIcon width={14} height={14} /> PDF
                                    </button>
                                    <button className="btn-outline" onClick={() => downloadData('pci', 'docx')} style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                                        <DownloadIcon width={14} height={14} /> DOCX
                                    </button>
                                </div>
                            </div>

                            <div className="card" style={{ border: '1px solid #E2E8F0', padding: '1.5rem' }}>
                                <div style={{ background: '#1E293B', color: 'white', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <HeartIcon width={24} height={24} />
                                </div>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>PHI Test File</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>100+ records: Medical Records</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <button className="btn-outline" onClick={() => downloadData('phi', 'csv')} style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                                        <DownloadIcon width={14} height={14} /> CSV
                                    </button>
                                    <button className="btn-outline" onClick={() => downloadData('phi', 'xlsx')} style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                                        <DownloadIcon width={14} height={14} /> XLSX
                                    </button>
                                    <button className="btn-outline" onClick={() => downloadData('phi', 'pdf')} style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                                        <DownloadIcon width={14} height={14} /> PDF
                                    </button>
                                    <button className="btn-outline" onClick={() => downloadData('phi', 'docx')} style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                                        <DownloadIcon width={14} height={14} /> DOCX
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'metadata' && (
                    <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>Classification Verification</h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '2rem', textAlign: 'center' }}>
                            Upload a document to verify its embedded security classification label.
                        </p>

                        {metadataStatus && !metadataStatus.startsWith('{') && (
                            <div style={{ marginBottom: '2rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className="animate-pulse">●</span> {metadataStatus}
                            </div>
                        )}

                        {metadataResult && (
                            <div className="fade-in" style={{
                                marginBottom: '2rem',
                                width: '100%',
                                background: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}>
                                <div style={{
                                    background: metadataResult.color,
                                    padding: '1rem',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                                        File Label: {metadataResult.label}
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem 2rem', fontSize: '0.9rem' }}>
                                        <div style={{ color: '#64748B', fontWeight: 500 }}>Filename:</div>
                                        <div style={{ color: '#0F172A' }}>{metadataResult.filename}</div>

                                        <div style={{ color: '#64748B', fontWeight: 500 }}>File Size:</div>
                                        <div style={{ color: '#0F172A' }}>{(metadataResult.size / 1024).toFixed(2)} KB</div>

                                        <div style={{ color: '#64748B', fontWeight: 500 }}>File Type:</div>
                                        <div style={{ color: '#0F172A' }}>
                                            {metadataResult.type
                                                ? metadataResult.type
                                                    .replace('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'DOCX Document')
                                                    .replace('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'XLSX Spreadsheet')
                                                    .replace('application/vnd.openxmlformats-officedocument.presentationml.presentation', 'PPTX Presentation')
                                                    .replace('application/pdf', 'PDF Document')
                                                    .replace('text/csv', 'CSV File')
                                                : 'Unknown'}
                                        </div>

                                        <div style={{ color: '#64748B', fontWeight: 500 }}>Hash (MD5/SHA256):</div>
                                        <div style={{ color: '#0F172A', wordBreak: 'break-all' }}>
                                            <div>MD5: {metadataResult.hash?.md5 || 'N/A'}</div>
                                            <div style={{ marginTop: '0.25rem' }}>SHA256: {metadataResult.hash?.sha256 || 'N/A'}</div>
                                        </div>

                                        <div style={{ color: '#64748B', fontWeight: 500 }}>Metadata: Classification:</div>
                                        <div style={{ color: '#0F172A' }}>
                                            {metadataResult.tags?.length > 0 ? (
                                                metadataResult.tags.join(', ')
                                            ) : (
                                                <>
                                                    {metadataResult.label === 'CONFIDENTIAL' && '#sensitive, #restricted'}
                                                    {metadataResult.label === 'PUBLIC' && '#public'}
                                                    {metadataResult.label === 'INTERNAL' && '#internal'}
                                                    {!['CONFIDENTIAL', 'PUBLIC', 'INTERNAL'].includes(metadataResult.label) && metadataResult.label}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{
                            border: '2px dashed #3B82F6',
                            borderRadius: '12px',
                            padding: '2rem',
                            background: '#EFF6FF',
                            width: '100%',
                            transition: 'transform 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            position: 'relative'
                        }}>
                            <input
                                type="file"
                                onChange={handleMetadataCheck}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer',
                                    zIndex: 10
                                }}
                            />
                            <div style={{ marginBottom: '1rem', color: '#2563EB' }}>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <SearchIcon width={48} height={48} />
                                </div>
                            </div>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E293B', fontSize: '1.1rem' }}>Classification Verification</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>PDF, DOCX, XLSX</p>

                            <div style={{ marginTop: 'auto' }}>
                                <span style={{ fontWeight: 500, color: '#334155', fontSize: '0.9rem' }}>Drop file or click to upload</span>
                            </div>

                            <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#DBEAFE', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                                <LockIcon width={12} height={12} />
                                <span>Secure Processing: Analyzed in-memory on the server and immediately discarded. No permanent storage.</span>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'regex' && (
                    <div style={{ width: '100%', padding: '2rem 0' }}>
                        <RegexTools />
                    </div>
                )}

                {tab === 'generator' && (
                    <div style={{ width: '100%', padding: '2rem 0' }}>
                        <AdvancedPayloadGenerator />
                    </div>
                )}
            </div>
        </div>
    );
}
