'use client';

import { DownloadIcon, ShieldAlertIcon, SkullIcon, LockIcon, BugIcon } from '@/components/Icons';

const EICAR_FORMATS = [
    { format: 'com', label: '.COM', desc: 'Original DOS executable format' },
    { format: 'txt', label: '.TXT', desc: 'Plain text — tests basic content scanning' },
    { format: 'zip', label: '.ZIP', desc: 'Archive — tests archive/compression inspection' },
    { format: 'ps1', label: '.PS1', desc: 'PowerShell script — tests script file scanning' },
    { format: 'pdf', label: '.PDF', desc: 'PDF — tests document content inspection' },
    { format: 'xml', label: '.XML', desc: 'XML — tests structured data scanning' },
];

const ADVANCED_THREATS = [
    {
        id: 'malware',
        title: 'Heuristic Malware Sample',
        desc: 'Contains known malicious command strings (credential dumping, download cradles) that trigger behavioral analysis and AMSI-based engines — beyond simple signature matching.',
        icon: SkullIcon,
        color: '#EA580C',
        bg: '#FFF7ED',
        border: '#FDBA74',
        formats: [
            { format: 'exe', label: '.EXE', desc: 'Executable with malicious strings' },
            { format: 'pdf', label: '.PDF', desc: 'PDF with embedded script triggers' },
            { format: 'doc', label: '.DOC', desc: 'Document with macro-style signatures' },
        ],
        meta: 'Type: Win32/Trojan  •  Detection: Heuristic + AMSI',
    },
    {
        id: 'mimikatz',
        title: 'OLE ActiveX Exploit Document',
        desc: 'OLE Compound File embedding MSCOMCTL.ListView ActiveX CLSID with oversized cbSize — triggers CVE-2012-0158 buffer overflow detection in file-inspection engines.',
        icon: BugIcon,
        color: '#7C3AED',
        bg: '#F5F3FF',
        border: '#C4B5FD',
        formats: [
            { format: 'doc', label: '.DOC', desc: 'OLE document with ActiveX exploit' },
        ],
        meta: 'Type: Exploit-CVE-2012-0158  •  Detection: File-OLE Inspection',
    },
    {
        id: 'ransomware',
        title: 'Ransomware Simulator',
        desc: 'Scripts emulating file encryption behavior, shadow copy deletion, and ransom note generation — tests your endpoint and gateway ransomware protection policies.',
        icon: LockIcon,
        color: '#DC2626',
        bg: '#FEF2F2',
        border: '#FECACA',
        formats: [
            { format: 'vbs', label: '.VBS', desc: 'VBScript with ADODB downloader + encryption' },
            { format: 'bat', label: '.HTA', desc: 'HTML Application with exploit payload' },
            { format: 'ps1', label: '.JS', desc: 'JScript with XMLHTTP downloader + heap spray' },
        ],
        meta: 'Behavior: Mass Encryption  •  Detection: AV + Behavioral',
    },
];

export default function ThreatProtectionClient() {

    const download = (type: string, format: string) => {
        window.open(`/api/threat/download?type=${type}&format=${format}`, '_blank');
    };

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.2rem' }}>Threat Generation</h1>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748B' }}>
                    Download test files to verify your gateway antivirus (AV) and endpoint protection (EPP) are detecting threats.
                </p>
            </header>

            {/* ─── EICAR Primary Section ─── */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <div style={{ color: '#2563EB', flexShrink: 0, marginTop: '2px' }}>
                    <ShieldAlertIcon width={20} height={20} />
                </div>
                <div style={{ fontSize: '0.88rem', color: '#1E40AF', lineHeight: 1.6 }}>
                    <strong>EICAR Standard Anti-Virus Test File</strong> — an industry-standard, completely harmless 68-byte string that every compliant AV engine is required to detect and block.
                    Use these downloads to confirm your NGFW&apos;s gateway AV engine is active and scanning the selected file type.
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.875rem' }}>
                {EICAR_FORMATS.map(({ format, label, desc }) => (
                    <button
                        key={format}
                        onClick={() => download('eicar', format)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem 1.25rem',
                            background: 'white',
                            border: '1px solid #E2E8F0',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#3B82F6';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#E2E8F0';
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                        }}
                    >
                        <div style={{
                            background: '#EFF6FF',
                            color: '#2563EB',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            padding: '0.45rem 0.6rem',
                            borderRadius: '6px',
                            flexShrink: 0,
                            minWidth: '52px',
                            textAlign: 'center',
                        }}>
                            {label}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: 500, marginBottom: '0.15rem' }}>
                                EICAR {label}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.4 }}>
                                {desc}
                            </div>
                        </div>
                        <div style={{ color: '#94A3B8', flexShrink: 0 }}>
                            <DownloadIcon width={16} height={16} />
                        </div>
                    </button>
                ))}
            </div>

            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center' }}>
                Your NGFW must have SSL Inspection (DPI-SSL) enabled on this domain to inspect downloads over HTTPS.
            </p>

            {/* ─── Advanced Threats Section ─── */}
            <div style={{ marginTop: '2.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '0.3rem' }}>Advanced Threat Samples</h2>
                <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: '#64748B' }}>
                    Test beyond EICAR — validate heuristic engines, exploit detection, and ransomware behavior analysis.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    {ADVANCED_THREATS.map(threat => {
                        const IconComponent = threat.icon;
                        return (
                            <div
                                key={threat.id}
                                className="card"
                                style={{
                                    padding: '1.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: `1px solid ${threat.border}`,
                                    borderRadius: '12px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                    <div style={{ background: threat.bg, padding: '0.6rem', borderRadius: '10px', color: threat.color, display: 'flex' }}>
                                        <IconComponent width={24} height={24} />
                                    </div>
                                    <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F172A' }}>{threat.title}</h3>
                                </div>

                                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1rem', flex: 1 }}>
                                    {threat.desc}
                                </p>

                                {/* Download buttons */}
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                    {threat.formats.map(fmt => (
                                        <button
                                            key={fmt.format}
                                            onClick={() => download(threat.id, fmt.format)}
                                            title={fmt.desc}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                padding: '0.45rem 0.75rem',
                                                background: threat.bg,
                                                color: threat.color,
                                                border: `1px solid ${threat.border}`,
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                transition: 'all 0.15s',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = threat.color;
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = threat.bg;
                                                e.currentTarget.style.color = threat.color;
                                            }}
                                        >
                                            <DownloadIcon width={13} height={13} /> {fmt.label}
                                        </button>
                                    ))}
                                </div>

                                <div style={{ fontSize: '0.75rem', color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem' }}>
                                    {threat.meta}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
