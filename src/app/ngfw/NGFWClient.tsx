'use client';

import { useState, useEffect } from 'react';
import { ShieldAlertIcon, EyeOffIcon, ServerIcon, RadioIcon, TrashIcon, PlayIcon, GlobeIcon, BugIcon, TargetIcon } from '@/components/Icons';

type TestResult = 'idle' | 'running' | 'blocked' | 'allowed' | 'error';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface LogLike { timestamp: string; type: string; message: string; }

export default function NGFWClient() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [results, setResults] = useState<{ [key: string]: TestResult }>({
        evasion: 'idle',
        ips: 'idle',
        c2c: 'idle',
    });
    const [logs, setLogs] = useState<{ timestamp: string; type: string; message: string; }[]>([]);

    const addLog = (type: string, message: string) => {
        const now = new Date().toISOString().split('T')[1].slice(0, 8);
        setLogs(prev => [...prev.slice(-9), { timestamp: now, type, message }]);
    };

    const runSimulation = async (testName: string, url: string, description: string, headers: HeadersInit = {}, mode?: RequestMode) => {
        setResults(prev => ({ ...prev, [testName]: 'running' }));

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const fetchOpts: RequestInit = { headers, signal: controller.signal };
            if (mode) fetchOpts.mode = mode;

            const res = await fetch(url, fetchOpts);
            clearTimeout(timeoutId);

            if (res.status === 403 || res.status === 503) {
                setResults(prev => ({ ...prev, [testName]: 'blocked' }));
                addLog('Result', `Success - Blocked by firewall (HTTP ${res.status}): ${description}`);
                return 'blocked';
            } else if (res.ok || res.type === 'opaque') {
                setResults(prev => ({ ...prev, [testName]: 'allowed' }));
                addLog('Result', `Failed - Payload reached destination (HTTP ${res.status || 'Opaque'}): ${description}`);
                return 'allowed';
            } else {
                setResults(prev => ({ ...prev, [testName]: 'error' }));
                addLog('Result', `Error - Unexpected status ${res.status}: ${description}`);
                return 'error';
            }
        } catch (e) {
            setResults(prev => ({ ...prev, [testName]: 'blocked' }));
            addLog('Result', `Success - Connection dropped/timeout: ${description}`);
            return 'blocked';
        }
    };

    const logSummary = (blocked: number, total: number) => {
        addLog('INFO', `SUMMARY: ${blocked}/${total} attacks blocked successfully.`);
    };

    const handleIPS = async () => {
        const tests = [
            { url: '/api/ngfw/test?q=\' OR 1=1; --', desc: 'SQL Injection', scenario: 'SQL Injection vector injected into HTTP query strings on port 80/443, testing IPS signature detection for database manipulation attempts.' },
            { url: '/api/ngfw/test?q=<script>alert(1)</script>', desc: 'Cross-Site Scripting (XSS)', scenario: 'Malicious script tag injected into HTTP parameters on Standard Web Ports, testing IPS ability to sanitize client-side execution vectors.' },
            { url: '/api/ngfw/test?q=../../etc/passwd', desc: 'Directory Traversal', scenario: 'Path traversal attempt (../../) sent via HTTP, testing if IPS prevents unauthorized access to system files outside the web root.' }
        ];

        let blockedCount = 0;
        for (const test of tests) {
            addLog('Test', test.scenario);
            const result = await runSimulation('ips', test.url, test.desc);
            if (result === 'blocked') blockedCount++;
            await new Promise(r => setTimeout(r, 800));
        }
        logSummary(blockedCount, tests.length);
    };

    const handleEvasion = async () => {
        const tests = [
            // Log4j (Header Injection) - Highly Detectable
            {
                url: '/api/ngfw/test',
                headers: { 'X-Api-Version': atob('JHtqbmRpOmxkYXA6Ly8xMjcuMC4wLjEvYX0=') },
                desc: 'Log4j JNDI Injection (Header)',
                scenario: 'Injecting Log4j signature (JNDI/LDAP) into HTTP Headers. Tests Deep Packet Inspection of non-standard headers.'
            },
            // Obfuscated SQL Injection (AET - Hex/URL Encoding)
            {
                url: '/api/ngfw/test?id=%31%20%75%6e%69%6f%6e%20%73%65%6c%65%63%74%20%31%2c%32%2c%33%20%2d%2d',
                headers: {},
                desc: 'Hex/URL Encoded SQLi',
                scenario: 'Sending a heavily Hex/URL encoded SQL Injection vector (%31%20%75...). Tests if the IPS normalizes and decodes complex character representations before signature matching.'
            },
            // Shellshock (Header Injection)
            {
                url: '/api/ngfw/test',
                headers: { 'X-Custom-UA': atob('KCkgeyA6O307IC9iaW4vY2F0IC9ldGMvcGFzc3dk') },
                desc: 'Shellshock RCE (Header)',
                scenario: 'Injecting Shellshock vector (Bash Function) into custom headers. Tests signatures against Bash environment variable injection.'
            }
        ];

        let blockedCount = 0;
        for (const test of tests) {
            addLog('Test', test.scenario);
            const result = await runSimulation('evasion', test.url, test.desc, test.headers as HeadersInit);
            if (result === 'blocked') blockedCount++;
            await new Promise(r => setTimeout(r, 800));
        }
        logSummary(blockedCount, tests.length);
    };

    const handleC2C = async () => {
        const tests: { url: string; headers: HeadersInit; desc: string; scenario: string; mode?: RequestMode }[] = [
            // Out-of-Band (OOB) Data Exfiltration Simulation
            {
                url: '/api/ngfw/test?leak=root:x:0:0:root:/root:/bin/bash',
                headers: {},
                desc: 'OOB Data Exfiltration',
                scenario: 'Simulating extraction of sensitive system files (/etc/passwd contents) via outbound query parameters. Tests DLP and Application Control.'
            },
            // Web Shell Simulation (Simulating outbound command beacon)
            {
                url: '/api/ngfw/test?cmd=cat%20/etc/passwd',
                headers: {},
                desc: 'External Web Shell Beacon',
                scenario: 'Sending standard Linux enumeration commands (cat /etc/passwd) to an external server. Tests Application Control for interactive shell traffic.'
            },
            // Python Reverse Shell Stager / Cradle
            {
                url: '/api/threat/download?type=malware',
                headers: { 'User-Agent': 'python-requests/2.25.1' },
                desc: 'Python Stager Download',
                scenario: 'Attempting to fetch a .py payload using the Python Requests library user-agent to a non-standard web port. Tests IPS detection of automated exploit fetching.'
            }
        ];

        let blockedCount = 0;
        for (const test of tests) {
            addLog('Test', test.scenario);
            const result = await runSimulation('c2c', test.url, test.desc, test.headers, test.mode);
            if (result === 'blocked') blockedCount++;
            await new Promise(r => setTimeout(r, 800));
        }
        logSummary(blockedCount, tests.length);
    };



    return (
        <div>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.2rem' }}>NGFW Validation</h1>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748B' }}>
                        Execute active traffic simulations to test Firewall policies and IPS engines.
                    </p>
                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#FFF7ED', borderLeft: '4px solid #F97316', borderRadius: '4px', fontSize: '0.85rem', color: '#9A3412' }}>
                        <strong>⚠️ Important:</strong> These tests run over HTTPS (Port 443). Your firewall <u>must</u> have <strong>SSL Decryption (DPI-SSL)</strong> enabled for this domain to inspect the payloads. Without decryption, the firewall cannot see the attack signatures inside the encrypted tunnel.
                    </div>
                </div>


            </header>

            <div className="layout-ngfw">

                {/* Test Modules List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* IPS Test Card */}
                    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#1E293B', color: 'white', padding: '0.8rem', borderRadius: '8px', display: 'flex' }}>
                                <ShieldAlertIcon width={24} height={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>Intrusion Prevention (IPS) Signature</h3>
                                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>SQLi, XSS, Path Traversal</div>
                            </div>
                        </div>
                        <button
                            className="btn-outline"
                            onClick={handleIPS}
                        >
                            <PlayIcon width={16} height={16} /> Execute
                        </button>
                    </div>

                    {/* Evasion Test Card */}
                    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#1E293B', color: 'white', padding: '0.8rem', borderRadius: '8px', display: 'flex' }}>
                                <EyeOffIcon width={24} height={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>Advanced Evasion Technique (AET)</h3>
                                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Obfuscation, URL/Hex Encoding</div>
                            </div>
                        </div>
                        <button
                            className="btn-outline"
                            onClick={handleEvasion}
                        >
                            <PlayIcon width={16} height={16} /> Execute
                        </button>
                    </div>

                    {/* C2C Test Card */}
                    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#1E293B', color: 'white', padding: '0.8rem', borderRadius: '8px', display: 'flex' }}>
                                <RadioIcon width={24} height={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>Command & Control (C2C) Beacon</h3>
                                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>OOB Exfil, Web Shells, Stagers</div>
                            </div>
                        </div>
                        <button
                            className="btn-outline"
                            onClick={handleC2C}
                        >
                            <PlayIcon width={16} height={16} /> Execute
                        </button>
                    </div>



                </div>

                {/* Console Output */}
                <div style={{
                    background: '#0F172A',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    color: '#38BDF8',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    height: '500px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>&gt;_ Console Output</span>
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
                                    <span style={{
                                        color: log.type === 'SUCCESS' ? '#4ADE80' : log.type === 'FAIL' ? '#F87171' : '#FCD34D',
                                        fontWeight: 'bold',
                                        marginRight: '0.5rem'
                                    }}>{log.type}:</span>
                                    <span style={{ color: '#E2E8F0' }}>{log.message}</span>
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
