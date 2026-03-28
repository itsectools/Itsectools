import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
    PulseIcon,
    ShieldIcon,
    FileAlertIcon,
    LockIcon,
    ArrowRightIcon,
    LogoSVG,
    EyeOffIcon,
    CheckCircleIcon,
    TargetIcon
} from '@/components/Icons';

const IpWidget = dynamic(() => import('@/components/IpWidget'), {
    ssr: false,
    loading: () => <div style={{ height: '80px', width: '250px', background: '#f1f5f9', borderRadius: '12px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
});

export default function Home() {
    return (
        <div className="page-container">
            <header className="home-header">
                <div className="logo-container">
                    <LogoSVG width={60} height={60} />
                    <span className="logo-text">
                        <span style={{ color: '#0EC7A8' }}>IT</span>
                        <span style={{ color: '#483D8B' }}>Sec</span>
                        <span style={{ color: '#0EC7A8' }}>Tools</span>
                    </span>
                </div>
                <div className="header-widget-area">
                    <IpWidget />
                </div>
            </header>

            {/* Hero Section */}
            <div className="hero-section">
                <h1 className="hero-title">IT Security Validation Suite</h1>
                <p className="hero-subtitle">
                    A comprehensive security validation toolkit designed to safely simulate cyber threats, verify data protection policies, and stress-test network defense controls. Empower your organization to proactively identify misconfigurations, validate egress filtering, and close vulnerabilities before they are exploited.
                </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="feature-grid">
                {/* Network Pulse */}
                <Link href="/network-pulse" className="feature-card theme-blue">
                    <div className="icon-box">
                        <PulseIcon width={24} height={24} />
                    </div>
                    <h3 className="card-title">Network Pulse</h3>
                    <p className="card-desc">
                        Real-time telemetry, latency analysis, and connection health monitoring for critical infrastructure.
                    </p>
                    <div className="card-link">
                        Analyze Connection <ArrowRightIcon width={16} height={16} className="ml-2" />
                    </div>
                </Link>

                {/* Threat Gen */}
                <Link href="/threat-protection" className="feature-card theme-rose">
                    <div className="icon-box">
                        <ShieldIcon width={24} height={24} />
                    </div>
                    <h3 className="card-title">Threat Gen</h3>
                    <p className="card-desc">
                        Safe malware simulation (EICAR and ransomware behavior) to rigorously test your network and endpoint solutions.
                    </p>
                    <div className="card-link">
                        Simulate Attacks <ArrowRightIcon width={16} height={16} className="ml-2" />
                    </div>
                </Link>

                {/* DLP Validator */}
                <Link href="/dlp" className="feature-card theme-indigo">
                    <div className="icon-box">
                        <FileAlertIcon width={24} height={24} />
                    </div>
                    <h3 className="card-title">DLP Validator</h3>
                    <p className="card-desc">
                        Test DLP across HTTP, HTTPS, and FTP. Includes Advanced DLP Tests with Nested JSON Exfiltration — the only free tool that tests whether DLP detects sensitive data inside MCP/API payloads.
                    </p>
                    <div className="card-link">
                        Start Inspection <ArrowRightIcon width={16} height={16} className="ml-2" />
                    </div>
                </Link>

                {/* MITRE ATT&CK Simulator */}
                <Link href="/mitre" className="feature-card theme-amber">
                    <div className="icon-box">
                        <TargetIcon width={24} height={24} />
                    </div>
                    <h3 className="card-title">MITRE ATT&CK</h3>
                    <p className="card-desc">
                        Execute a sequential adversary Kill Chain simulating complete attack lifecycles from Initial Access to Exfiltration.
                    </p>
                    <div className="card-link">
                        Launch Simulator <ArrowRightIcon width={16} height={16} className="ml-2" />
                    </div>
                </Link>

                {/* NGFW Tests */}
                <Link href="/ngfw" className="feature-card theme-emerald">
                    <div className="icon-box">
                        <LockIcon width={24} height={24} />
                    </div>
                    <h3 className="card-title">NGFW Tests</h3>
                    <p className="card-desc">
                        Verify Firewall efficacy against IPS signatures, evasions, and Command & Control (C2) traffic patterns.
                    </p>
                    <div className="card-link">
                        Run Validation <ArrowRightIcon width={16} height={16} className="ml-2" />
                    </div>
                </Link>
            </div>

            {/* Policy & Footer Section */}
            <div>
                <div className="policy-card">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Open Security Validation Initiative</h2>
                        <p>Transparency and security for the modern web.</p>
                    </div>

                    <div className="policy-grid">
                        <div className="policy-item">
                            <div style={{ minWidth: '24px', height: '24px', borderRadius: '50%', border: '2px solid #3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#3B82F6', marginTop: '2px' }}>
                                <CheckCircleIcon width={14} height={14} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4>Free to Use</h4>
                                <p>Free to use tools available for security researchers and admins.</p>
                            </div>
                        </div>
                        <div className="policy-item">
                            <div style={{ minWidth: '24px', height: '24px', borderRadius: '50%', border: '2px solid #3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#3B82F6', marginTop: '2px' }}>
                                <LockIcon width={14} height={14} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4>Safe Simulation</h4>
                                <p>All malware samples are benign simulators designed for detection testing only.</p>
                            </div>
                        </div>
                        <div className="policy-item">
                            <div style={{ minWidth: '24px', height: '24px', borderRadius: '50%', border: '2px solid #3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#3B82F6', marginTop: '2px' }}>
                                <EyeOffIcon width={14} height={14} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4>Privacy First</h4>
                                <p>Analysis occurs locally or via ephemeral stateless functions.</p>
                            </div>
                        </div>
                    </div>

                    <div className="policy-footer" style={{ borderTop: 'none', justifyContent: 'center' }}>
                        <Link href="/contact" className="btn-outline-clean">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
