'use client';

import { useState, useRef, useEffect } from 'react';
import { UploadIcon, FileTextIcon, DownloadIcon, CreditCardIcon, HeartIcon, SearchIcon, FileAlertIcon, PlayIcon, LockIcon, LayersIcon } from '@/components/Icons';
import AdvancedPayloadGenerator from '@/components/AdvancedDLP/Generators';
import RegexTools from '@/components/AdvancedDLP/RegexTools';
import { generateDLPReport, type DLPTestResult } from '@/lib/reportGenerator';

export default function DLPClient() {
    const [tab, setTab] = useState<'upload' | 'regex' | 'text' | 'download' | 'metadata' | 'generator' | 'advanced'>('upload');

    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [textStatus, setTextStatus] = useState<string | null>(null);
    const [metadataStatus, setMetadataStatus] = useState<string | null>(null);
    const [textContent, setTextContent] = useState('');
    const [postProtocol, setPostProtocol] = useState<'HTTPS' | 'HTTP'>('HTTPS');

    // MCP Protocol Testing state
    const [mcpDataType, setMcpDataType] = useState<'pii' | 'pci' | 'phi'>('pii');
    const [mcpDepth, setMcpDepth] = useState<2 | 4 | 6>(4);
    const [mcpProtocol, setMcpProtocol] = useState<'HTTP' | 'HTTPS'>('HTTPS');
    const [mcpStatus, setMcpStatus] = useState<string | null>(null);
    const [mcpPreview, setMcpPreview] = useState<string | null>(null);
    const [testHistory, setTestHistory] = useState<DLPTestResult[]>([]);
    const [ipData, setIpData] = useState<{ ip: string; country: string } | null>(null);
    const testIdRef = useRef(0);

    useEffect(() => {
        fetch('/api/my-ip').then(r => r.json()).then(d => setIpData(d)).catch(() => {});
    }, []);

    const addTestResult = (category: 'upload' | 'post' | 'mcp', protocol: string, result: 'blocked' | 'leaked', file?: string, content?: string) => {
        testIdRef.current += 1;
        setTestHistory(prev => [...prev, {
            id: testIdRef.current,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            category, protocol, file, content, result,
        }]);
    };

    const handleGenerateReport = async () => {
        const pdfBytes = await generateDLPReport(testHistory, ipData || undefined);
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DLP-Validation-Report-${new Date().toISOString().slice(0, 10)}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const httpInputRef  = useRef<HTMLInputElement>(null);
    const httpsInputRef = useRef<HTMLInputElement>(null);
    const ftpInputRef   = useRef<HTMLInputElement>(null);

    // Track whether our upload handler actually ran (used to detect Forcepoint blocks)
    const handlerRanRef = useRef(false);
    const pendingProtocolRef = useRef<'HTTP' | 'HTTPS' | 'FTP' | null>(null);
    const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dlpBlockCountRef = useRef<Record<string, number>>({ HTTP: 0, HTTPS: 0, FTP: 0 });

    const trackEvent = (action: string, category: string, label: string) => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', action, {
                event_category: category,
                event_label: label,
            });
        }
    };

    // ─── Strategy: onClick + window.focus detection ───────────────────────────
    // WHY ELEMENT-LEVEL CAPTURE DOESN'T WORK:
    // Forcepoint registers on the WINDOW in capture phase (eventPhase 1) — the very
    // first point in the event propagation chain. stopImmediatePropagation() at that
    // level prevents the event from ever reaching the target element. There is no way
    // to register a listener that runs BEFORE a window-capture listener (extensions
    // inject at document_start, before any page script).
    //
    // SOLUTION: Bypass the event system entirely.
    // 1. Card onClick fires BEFORE the file picker opens → show status immediately.
    // 2. window.focus fires when the file picker dialog CLOSES (browser regains focus).
    // 3. If our handler ran (Forcepoint didn't block): normal result is shown.
    // 4. If our handler did NOT run (Forcepoint blocked the event): show BLOCKED.
    // ─────────────────────────────────────────────────────────────────────────

    // ─── Cancel vs DLP Block Detection ──────────────────────────────────────
    // Problem: Both "user cancels file picker" and "DLP blocks upload" result
    // in our React onChange never firing. We need to distinguish them.
    //
    // Why we can't use document-level 'input' event listeners:
    // Forcepoint registers on WINDOW in capture phase (eventPhase 1).
    // Propagation order: window(capture) → document(capture) → ... → target.
    // Forcepoint's stopImmediatePropagation() at window prevents the event
    // from EVER reaching document — so a document listener won't fire either.
    //
    // Solution: The 'cancel' event on <input type="file">.
    // - Fires when user dismisses the file picker WITHOUT selecting a file.
    // - Does NOT fire when a file is selected (whether DLP blocks or not).
    // - Forcepoint only intercepts 'input'/'change' events, NOT 'cancel'.
    // - Supported: Chrome 113+, Firefox 91+, Safari 16.4+.
    //
    // Flow:
    //   User cancels  → 'cancel' fires → clear pending state, no BLOCKED msg
    //   DLP blocks    → no 'cancel', no onChange → focus handler shows BLOCKED
    //   Normal upload → onChange fires → normal upload proceeds
    // ─────────────────────────────────────────────────────────────────────────

    // Listen for 'cancel' events on file inputs (user dismissed the picker)
    useEffect(() => {
        const handleCancel = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target?.type === 'file' && pendingProtocolRef.current) {
                // User cancelled — clear pending state before focus handler runs
                pendingProtocolRef.current = null;
                if (focusTimerRef.current) {
                    clearTimeout(focusTimerRef.current);
                    focusTimerRef.current = null;
                }
                setUploadStatus(null);
            }
        };
        // 'cancel' event is NOT intercepted by Forcepoint (it only targets input/change)
        document.addEventListener('cancel', handleCancel, true);
        return () => document.removeEventListener('cancel', handleCancel, true);
    }, []);

    useEffect(() => {
        const handleWindowFocus = () => {
            // File picker just closed — check if our handler was called
            const protocol = pendingProtocolRef.current;
            if (!protocol) return; // null if cancel event already cleared it

            if (!handlerRanRef.current) {
                // Our handler never ran AND it wasn't a cancel → DLP block
                if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
                focusTimerRef.current = setTimeout(() => {
                    if (!handlerRanRef.current && pendingProtocolRef.current) {
                        // Try to read filename from the native input — Forcepoint blocks the JS event
                        // but the browser may still have populated input.files before the block
                        const inputRef = pendingProtocolRef.current === 'HTTP' ? httpInputRef
                            : pendingProtocolRef.current === 'HTTPS' ? httpsInputRef : ftpInputRef;
                        const selectedFile = inputRef.current?.files?.[0]?.name || null;

                        setUploadStatus(`🚫 BLOCKED: ${pendingProtocolRef.current} Upload intercepted by Endpoint DLP agent before data reached the browser.`);
                        // Use sequential numbering per protocol for DLP agent blocks (ref avoids stale closure)
                        const blockProtocol = pendingProtocolRef.current;
                        if (!selectedFile) {
                            dlpBlockCountRef.current[blockProtocol] = (dlpBlockCountRef.current[blockProtocol] || 0) + 1;
                        }
                        const blockLabel = selectedFile || `${blockProtocol} Upload #${dlpBlockCountRef.current[blockProtocol]} (Endpoint DLP Block)`;
                        addTestResult('upload', blockProtocol, 'blocked', blockLabel);

                        // Reset the input so the same file can be re-tested
                        if (inputRef.current) inputRef.current.value = '';
                    }
                    pendingProtocolRef.current = null;
                }, 1500);
            }
        };

        window.addEventListener('focus', handleWindowFocus);
        return () => window.removeEventListener('focus', handleWindowFocus);
    }, []);

    // Called when the user clicks a card (before file picker opens)
    const handleCardClick = (protocol: 'HTTP' | 'HTTPS' | 'FTP') => {
        handlerRanRef.current = false;
        pendingProtocolRef.current = protocol;
        setUploadStatus(`⏳ ${protocol} Upload: Select a file from the dialog...`);
    };

    // Called by React onChange — Forcepoint may have already intercepted the input event,
    // but the onChange (change event) may still fire if Forcepoint only stops `input`.
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, protocol: 'HTTP' | 'HTTPS' | 'FTP') => {
        const target = e.target;
        if (!target.files?.[0]) return;

        handlerRanRef.current = true;
        pendingProtocolRef.current = null;
        if (focusTimerRef.current) clearTimeout(focusTimerRef.current);

        const file = target.files[0];
        trackEvent('file_upload', 'dlp_test', `Protocol: ${protocol}`);

        if (file.size > 10 * 1024 * 1024) {
            setUploadStatus(`🚫 BLOCKED: File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds limit.`);
            target.value = '';
            return;
        }

        setUploadStatus(`⏳ Uploading via ${protocol}...`);
        target.value = '';
        await new Promise<void>(resolve => setTimeout(resolve, 50));

        let fileBuffer: ArrayBuffer;
        try {
            fileBuffer = await file.arrayBuffer();
        } catch {
            setUploadStatus(`🚫 BLOCKED: DLP agent prevented file read.`);
            return;
        }

        const blob = new Blob([fileBuffer], { type: file.type || 'application/octet-stream' });
        const controller = new AbortController();
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => { controller.abort(); reject(new Error('DLP_TIMEOUT')); }, 3000)
        );

        try {
            const formData = new FormData();
            formData.append('file', blob, file.name);
            const uploadToken = crypto.randomUUID();
            const fetchPromise = fetch(`/api/dlp/upload/${uploadToken}`, {
                method: 'POST', body: formData, signal: controller.signal
            });
            const res = await Promise.race([fetchPromise, timeoutPromise]) as Response;
            if (res.ok) {
                const isSensitive = /secret|pii|pci|phi|factory|medical|transaction|hipaa|sensitive|confidential|ssn|credit.?card/.test(file.name.toLowerCase());
                setUploadStatus(isSensitive
                    ? `✅ DATA LEAKED: ${protocol} Transfer Successful (DLP Agent Failed to Block)`
                    : `✅ ALLOWED: ${protocol} Transfer completed successfully.`);
                addTestResult('upload', protocol, 'leaked', file.name);
            } else {
                setUploadStatus(`🚫 BLOCKED: ${protocol} upload rejected — HTTP ${res.status}.`);
                addTestResult('upload', protocol, 'blocked', file.name);
            }
        } catch (err: any) {
            if (err.message === 'DLP_TIMEOUT' || err.name === 'AbortError') {
                setUploadStatus(`🚫 BLOCKED: ${protocol} Upload Timed Out (dropped by DLP Agent).`);
            } else {
                setUploadStatus('🚫 BLOCKED: Network request failed (Intercepted by DLP Agent).');
            }
            addTestResult('upload', protocol, 'blocked', file.name);
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
                if (/factorytestkeyword|secret|\d{3}-\d{2}-\d{4}|\b\d{13,16}\b/.test(textContent.toLowerCase())) {
                    setTextStatus(`✅ DATA LEAKED: ${postProtocol} POST Successful (DLP Agent Failed to Block). Status: ${res.status}`);
                } else {
                    setTextStatus(`SUCCESS: ${postProtocol} POST returned ${res.status} OK (Allowed).`);
                }
                addTestResult('post', postProtocol, 'leaked', undefined, textContent.substring(0, 50));
            } else {
                setTextStatus(`BLOCKED: ${postProtocol} POST returned ${res.status}. ${data.message || 'Access Denied'}.`);
                addTestResult('post', postProtocol, 'blocked', undefined, textContent.substring(0, 50));
            }
        } catch (e: any) {
            if (e.message === 'DLP_TIMEOUT' || e.name === 'AbortError') {
                setTextStatus('BLOCKED: Request timed out (likely dropped by DLP Agent).');
            } else {
                setTextStatus('BLOCKED: Network request failed (Interrupted by DLP Agent).');
            }
            addTestResult('post', postProtocol, 'blocked', undefined, textContent.substring(0, 50));
        }
    };

    const handleMcpTest = async () => {
        trackEvent('mcp_test', 'dlp_test', `Type: ${mcpDataType}, Depth: ${mcpDepth}, Protocol: ${mcpProtocol}`);
        setMcpStatus(`⏳ Generating ${mcpDataType.toUpperCase()} payload at depth ${mcpDepth}...`);
        setMcpPreview(null);

        try {
            // Step 1: Get server-generated nested JSON payload
            const genRes = await fetch(`/api/dlp/mcp?type=${mcpDataType}&depth=${mcpDepth}`);
            if (!genRes.ok) { setMcpStatus('ERROR: Failed to generate MCP payload.'); return; }
            const mcpPayload = await genRes.json();
            setMcpPreview(JSON.stringify(mcpPayload, null, 2));
            setMcpStatus(`⏳ Sending ${mcpProtocol} POST with nested JSON (depth ${mcpDepth})...`);

            // Step 2: POST the payload — DLP must inspect this
            const controller = new AbortController();
            const timeout = setTimeout(() => { controller.abort(); }, 3000);

            const testRes = await fetch('/api/dlp/mcp-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mcpPayload),
                signal: controller.signal,
            });
            clearTimeout(timeout);

            if (testRes.ok) {
                setMcpStatus(`✅ DATA LEAKED: ${mcpProtocol} MCP POST Successful — DLP failed to detect ${mcpDataType.toUpperCase()} data at nesting depth ${mcpDepth}.`);
                addTestResult('mcp', mcpProtocol, 'leaked', `MCP ${mcpDataType.toUpperCase()} (depth ${mcpDepth})`);
            } else {
                setMcpStatus(`🚫 BLOCKED: ${mcpProtocol} MCP POST rejected — HTTP ${testRes.status}. DLP detected nested ${mcpDataType.toUpperCase()} data.`);
                addTestResult('mcp', mcpProtocol, 'blocked', `MCP ${mcpDataType.toUpperCase()} (depth ${mcpDepth})`);
            }
        } catch (err: any) {
            if (err.name === 'AbortError') {
                setMcpStatus(`🚫 BLOCKED: ${mcpProtocol} MCP POST timed out (dropped by DLP Agent).`);
            } else {
                setMcpStatus(`🚫 BLOCKED: ${mcpProtocol} MCP POST failed — intercepted by DLP Agent.`);
            }
            addTestResult('mcp', mcpProtocol, 'blocked', `MCP ${mcpDataType.toUpperCase()} (depth ${mcpDepth})`);
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
                <div
                    className={`tab ${tab === 'advanced' ? 'active' : ''}`}
                    onClick={() => setTab('advanced')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FileAlertIcon width={18} height={18} /> Advanced DLP Tests
                </div>
            </div>

            {/* Content Area */}
            <div className="card" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                {tab === 'upload' && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {uploadStatus && (
                            <div className="fade-in" style={{
                                padding: '1rem',
                                background: uploadStatus.startsWith('🚫') || uploadStatus.startsWith('BLOCKED') ? '#FEF2F2' : (uploadStatus.startsWith('✅') ? '#F0FDF4' : (uploadStatus.startsWith('⚠') ? '#FFFBEB' : '#EFF6FF')),
                                border: `1px solid ${uploadStatus.startsWith('🚫') || uploadStatus.startsWith('BLOCKED') ? '#F87171' : (uploadStatus.startsWith('✅') ? '#4ADE80' : (uploadStatus.startsWith('⚠') ? '#FDE68A' : '#BFDBFE'))}`,
                                borderRadius: '8px',
                                color: uploadStatus.startsWith('🚫') || uploadStatus.startsWith('BLOCKED') ? '#B91C1C' : (uploadStatus.startsWith('✅') ? '#15803D' : (uploadStatus.startsWith('⚠') ? '#92400E' : '#1E40AF')),
                                fontWeight: 600,
                                textAlign: 'center',
                                maxWidth: '600px',
                                margin: '0 auto',
                                width: '100%',
                                fontSize: '1rem'
                            }}>
                                {uploadStatus}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {/* HTTP Upload Card */}
                            <div style={{ textAlign: 'center' }} onClick={() => handleCardClick('HTTP')}>
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
                                        ref={httpInputRef}
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
                            <div style={{ textAlign: 'center' }} onClick={() => handleCardClick('HTTPS')}>
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
                                        ref={httpsInputRef}
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
                            <div style={{ textAlign: 'center' }} onClick={() => handleCardClick('FTP')}>
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
                                        ref={ftpInputRef}
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

                {tab === 'advanced' && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <h3 style={{ marginBottom: '0.25rem', fontSize: '1.2rem', color: '#0F172A' }}>Advanced DLP Tests</h3>
                            <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0 }}>
                                Test your DLP against modern exfiltration techniques that bypass traditional inspection.
                            </p>
                        </div>

                        {/* MCP Protocol Testing */}
                        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <div style={{ background: '#EEF2FF', color: '#4F46E5', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                        <line x1="12" y1="22.08" x2="12" y2="12" />
                                    </svg>
                                </div>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0F172A' }}>MCP Protocol Testing (JSON Exfiltration)</h4>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem', marginTop: '0.25rem' }}>
                                Tests whether your DLP can detect sensitive data buried inside nested JSON-RPC payloads used by AI agents (MCP) and modern APIs.
                                Data is generated server-side — the DLP engine must parse the network traffic to find it.
                            </p>

                            {/* Status */}
                            {mcpStatus && (
                                <div className="fade-in" style={{
                                    marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px', fontWeight: 600, textAlign: 'center',
                                    background: mcpStatus.startsWith('🚫') || mcpStatus.startsWith('BLOCKED') ? '#FEF2F2' : (mcpStatus.startsWith('✅') ? '#F0FDF4' : '#EFF6FF'),
                                    border: `1px solid ${mcpStatus.startsWith('🚫') || mcpStatus.startsWith('BLOCKED') ? '#F87171' : (mcpStatus.startsWith('✅') ? '#4ADE80' : '#BFDBFE')}`,
                                    color: mcpStatus.startsWith('🚫') || mcpStatus.startsWith('BLOCKED') ? '#B91C1C' : (mcpStatus.startsWith('✅') ? '#15803D' : '#1E40AF'),
                                }}>
                                    {mcpStatus}
                                </div>
                            )}

                            <div style={{ maxWidth: '600px' }}>
                                {/* Data Type */}
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500, minWidth: '100px' }}>Data Type:</span>
                                    {(['pii', 'pci', 'phi'] as const).map(t => (
                                        <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                                            <input type="radio" name="mcpDataType" value={t} checked={mcpDataType === t} onChange={() => setMcpDataType(t)} />
                                            {t.toUpperCase()}
                                        </label>
                                    ))}
                                </div>

                                {/* Nesting Depth */}
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500, minWidth: '100px' }}>Nesting Depth:</span>
                                    {([2, 4, 6] as const).map(d => (
                                        <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                                            <input type="radio" name="mcpDepth" value={d} checked={mcpDepth === d} onChange={() => setMcpDepth(d)} />
                                            {d} levels
                                        </label>
                                    ))}
                                </div>

                                {/* Protocol */}
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500, minWidth: '100px' }}>Protocol:</span>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                                        <input type="radio" name="mcpProtocol" value="HTTP" checked={mcpProtocol === 'HTTP'} onChange={() => setMcpProtocol('HTTP')} />
                                        HTTP (Port 80)
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                                        <input type="radio" name="mcpProtocol" value="HTTPS" checked={mcpProtocol === 'HTTPS'} onChange={() => setMcpProtocol('HTTPS')} />
                                        HTTPS (Port 443)
                                    </label>
                                </div>

                                <button className="btn-outline" onClick={handleMcpTest}>
                                    <PlayIcon width={16} height={16} /> Send MCP Request
                                </button>
                            </div>

                            {/* JSON Preview */}
                            {mcpPreview && (
                                <div style={{ marginTop: '1.5rem' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        JSON Payload Sent
                                    </div>
                                    <pre style={{
                                        background: '#0F172A', color: '#38BDF8', padding: '1rem', borderRadius: '8px',
                                        fontSize: '0.75rem', lineHeight: 1.5, overflow: 'auto', maxHeight: '300px',
                                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                                    }}>
                                        {mcpPreview}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Report Bar */}
            {testHistory.length > 0 && (
                <div style={{
                    position: 'fixed', bottom: 0, left: 72, right: 0,
                    background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(8px)',
                    padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem',
                    zIndex: 100, borderTop: '1px solid rgba(255,255,255,0.1)',
                }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        {testHistory.length} test{testHistory.length > 1 ? 's' : ''} completed
                    </span>
                    <span style={{ color: '#10B981', fontSize: '0.85rem' }}>
                        {testHistory.filter(t => t.result === 'blocked').length} blocked
                    </span>
                    <span style={{ color: '#EF4444', fontSize: '0.85rem' }}>
                        {testHistory.filter(t => t.result === 'leaked').length} leaked
                    </span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={() => { setTestHistory([]); testIdRef.current = 0; }}
                            style={{
                                background: 'transparent', border: '1px solid #475569', color: '#94A3B8',
                                padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
                            }}
                        >
                            Clear Results
                        </button>
                        <button
                            onClick={handleGenerateReport}
                            style={{
                                background: '#2563EB', border: 'none', color: 'white',
                                padding: '0.5rem 1.25rem', borderRadius: '6px', cursor: 'pointer',
                                fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem',
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Generate Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
