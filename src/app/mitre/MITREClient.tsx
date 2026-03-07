'use client';

import { useState } from 'react';
import { TargetIcon, PlayIcon, CheckCircleIcon, ShieldAlertIcon, TrashIcon, PulseIcon, LockIcon, UploadIcon, PlayOutlineIcon } from '@/components/Icons';

type TestResult = 'idle' | 'running' | 'blocked' | 'allowed' | 'error';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface LogLike { timestamp: string; type: string; message: string; }

export default function MITREClient() {
    const [result, setResult] = useState<TestResult>('idle');
    const [logs, setLogs] = useState<{ timestamp: string; type: string; message: string; }[]>([]);

    const addLog = (type: string, message: string) => {
        const now = new Date().toISOString().split('T')[1].slice(0, 8);
        setLogs(prev => [...prev.slice(-14), { timestamp: now, type, message }]);
    };

    const runSimulation = async (url: string, description: string, mitreId: string, options: RequestInit = {}) => {
        setResult('running');
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            addLog('MITRE', `Executing ${mitreId}: ${description}...`);
            const res = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.status === 403 || res.status === 503) {
                addLog('Result', `Success - Blocked by firewall (HTTP ${res.status}): ${description}`);
                return 'blocked';
            } else if (res.type === 'opaque' || res.status === 0) {
                addLog('Result', `Failed - Payload reached destination (Opaque response): ${description}`);
                return 'allowed';
            } else if (res.ok) {
                addLog('Result', `Failed - Payload reached destination (HTTP 200): ${description}`);
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
        const tests = [
            // Initial Access (T1190)
            {
                url: '/api/ngfw/test',
                options: { method: 'GET', headers: { 'X-Api-Version': atob('JHtqbmRpOmxkYXA6Ly8xMjcuMC4wLjEvYX0=') } },
                desc: 'Exploit Public-Facing Application (Log4j)',
                mitreId: 'T1190'
            },
            // Execution (T1059.001)
            {
                url: '/api/threat/download?type=powershell',
                options: { method: 'GET' },
                desc: 'PowerShell Download Cradle',
                mitreId: 'T1059.001'
            },
            // Credential Access (T1003.001)
            {
                url: '/api/threat/download?type=mimikatz',
                options: { method: 'GET' },
                desc: 'OS Credential Dumping (Mimikatz)',
                mitreId: 'T1003.001'
            },
            // Exfiltration (T1048.003)
            {
                url: '/api/mock-exfiltration?data=root:x:0:0:root:/root:/bin/bash',
                options: { method: 'GET' },
                desc: 'Exfiltration Over Unencrypted Protocol',
                mitreId: 'T1048.003'
            }
        ];

        let blockedCount = 0;
        for (const test of tests) {
            const res = await runSimulation(test.url, test.desc, test.mitreId, test.options as RequestInit);
            if (res === 'blocked') blockedCount++;
            await new Promise(r => setTimeout(r, 1200));
        }

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
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Log4j RCE payload against an external interface.</p>
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
                                <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>PowerShell (T1059.001)</div>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Attempts to pull a malicious .ps1 payload using a download cradle.</p>
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
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Transmits Mimikatz strings used to dump LSASS memory.</p>
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
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Extracts sensitive /etc/passwd contents via cleartext query.</p>
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
                                                    log.type === 'Result' && log.message.includes('Failed') ? '#FCD34D' : '#38BDF8',
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
        </div>
    );
}
