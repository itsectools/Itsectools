'use client';

import { BugIcon, SkullIcon, LockIcon, AlertTriangleIcon, DownloadIcon } from '@/components/Icons';

export default function ThreatProtectionClient() {

    const downloadThreat = (type: 'eicar' | 'malware' | 'ransomware', format: string) => {
        // Direct link to initiate download via network (triggers Gateway AV)
        const downloadUrl = `/api/threat/download?type=${type}&format=${format}`;

        // Use a hidden iframe or anchor click to trigger download without navigation
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = ''; // prompt browser to save
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const renderDownloadButtons = (type: 'eicar' | 'malware' | 'ransomware', formats: string[], color: string) => (
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: 'auto' }}>
            {formats.map(fmt => (
                <button
                    key={fmt}
                    className="btn-outline"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem', color: color, borderColor: color }}
                    onClick={() => downloadThreat(type, fmt)}
                >
                    <DownloadIcon width={14} height={14} /> .{fmt.toUpperCase()}
                </button>
            ))}
        </div>
    );

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.2rem' }}>Threat Generation</h1>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748B' }}>
                    Download test files to verify your endpoint protection (EPP) or gateway antivirus (AV).
                </p>
            </header>

            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ color: '#DC2626' }}>
                    <AlertTriangleIcon width={32} height={32} />
                </div>
                <div>
                    <strong style={{ color: '#B91C1C', display: 'block', marginBottom: '0.2rem' }}>Active Threat Simulation</strong>
                    <span style={{ fontSize: '0.9rem', color: '#7F1D1D' }}>These files are harmless but designed to trigger security alerts. Your AV might block them immediately.</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* EICAR Card */}
                <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ background: '#EFF6FF', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', color: '#2563EB', display: 'flex' }}>
                        <BugIcon width={32} height={32} />
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#0F172A' }}>EICAR Standard Test File</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                        Industry standard string for testing antivirus software. Harmless ASCII string detected as a virus.
                    </p>

                    {renderDownloadButtons('eicar', ['com', 'txt', 'zip'], '#2563EB')}

                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem', width: '100%' }}>
                        Hashes: MD5 | SHA256
                    </div>
                </div>

                {/* Advanced Malware Card */}
                <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ background: '#FFF7ED', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', color: '#EA580C', display: 'flex' }}>
                        <SkullIcon width={32} height={32} />
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#0F172A' }}>Heuristic Malware Sample</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                        Simulates a polymorphic malware signature to test behavioral analysis engines.
                    </p>

                    {renderDownloadButtons('malware', ['exe', 'pdf', 'doc'], '#EA580C')}

                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem', width: '100%' }}>
                        Type: Win32/Trojan
                    </div>
                </div>

                {/* Ransomware Card */}
                <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ background: '#FEF2F2', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', color: '#DC2626', display: 'flex' }}>
                        <LockIcon width={32} height={32} />
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#0F172A' }}>Ransomware Simulator</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                        Script emulating file encryption behavior to verify ransomware protection policies.
                    </p>

                    {renderDownloadButtons('ransomware', ['vbs'], '#DC2626')}

                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem', width: '100%' }}>
                        Behavior: Mass Encryption
                    </div>
                </div>

            </div>
        </div>
    );
}
