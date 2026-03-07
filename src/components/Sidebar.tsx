'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MailIcon, LogoSVG, TargetIcon } from './Icons';

// SVG Icons matching the clean style request
const NetworkPulseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

const DLPIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="12" y1="12" x2="12.01" y2="12" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const LockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);



const HomeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Home', icon: <HomeIcon /> },
        { href: '/network-pulse', label: 'Network Pulse', icon: <NetworkPulseIcon /> },
        { href: '/dlp', label: 'DLP Validator', icon: <DLPIcon /> },
        { href: '/ngfw', label: 'NGFW Tests', icon: <ShieldIcon /> },
        { href: '/mitre', label: 'MITRE ATT&CK', icon: <TargetIcon width={20} height={20} /> },
        { href: '/threat-protection', label: 'Threat Gen', icon: <LockIcon /> },
        { href: '/help', label: 'Help', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg> },
        { href: '/contact', label: 'Contact Us', icon: <MailIcon width={20} height={20} /> },
    ];

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="logo-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
                <LogoSVG />
                <div style={{ fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>
                    <span style={{ color: '#0EC7A8' }}>IT</span>
                    <span style={{ color: '#483D8B' }}>Sec</span>
                    <span style={{ color: '#0EC7A8' }}>Tools</span>
                </div>
            </div>

            <nav style={{ padding: '0 1rem' }}>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`nav-item ${pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)) ? 'active' : ''}`}
                    >
                        <span style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>{link.icon}</span>
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#F59E0B' }}>
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                        v1.2.0
                    </span>
                    <span style={{ marginLeft: 'auto', opacity: 0.5 }}>PRO</span>
                </div>
            </div>
        </aside>
    );
}
