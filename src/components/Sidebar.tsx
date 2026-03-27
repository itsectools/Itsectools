'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MailIcon, LogoSVG, TargetIcon } from './Icons';

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

const PinIcon = ({ pinned }: { pinned: boolean }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: pinned ? 'rotate(0deg)' : 'rotate(45deg)', transition: 'transform 0.2s ease' }}>
        <path d="M12 17v5" />
        <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76z" />
    </svg>
);

export default function Sidebar() {
    const pathname = usePathname();
    const [pinned, setPinned] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('sidebar-pinned');
        if (saved === 'true') setPinned(true);
    }, []);

    const expanded = pinned || hovered;

    const togglePin = () => {
        const next = !pinned;
        setPinned(next);
        localStorage.setItem('sidebar-pinned', String(next));
    };

    const links = [
        { href: '/', label: 'Home', icon: <HomeIcon /> },
        { href: '/network-pulse', label: 'Network Pulse', icon: <NetworkPulseIcon /> },
        { href: '/dlp', label: 'DLP Validator', icon: <DLPIcon /> },
        { href: '/ngfw', label: 'NGFW Tests', icon: <ShieldIcon /> },
        { href: '/mitre', label: 'MITRE ATT&CK', icon: <TargetIcon width={20} height={20} /> },
        { href: '/threat-protection', label: 'Threat Gen', icon: <LockIcon /> },
        { href: '/blog', label: 'Blog', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg> },
        { href: '/help', label: 'Help', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg> },
        { href: '/contact', label: 'Contact Us', icon: <MailIcon width={20} height={20} /> },
    ];

    // Before mount, render expanded to avoid layout flash (SSR)
    const isExpanded = !mounted || expanded;

    return (
        <aside
            className={`sidebar ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Logo + Pin */}
            <div className="logo-area">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', flexDirection: isExpanded ? 'row' : 'column', gap: isExpanded ? '0.75rem' : '0' }}>
                    <LogoSVG />
                    <span className="nav-label" style={{ fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#0EC7A8' }}>IT</span>
                        <span style={{ color: '#483D8B' }}>Sec</span>
                        <span style={{ color: '#0EC7A8' }}>Tools</span>
                    </span>
                </div>
                {isExpanded && (
                    <button
                        onClick={togglePin}
                        className="pin-button"
                        title={pinned ? 'Unpin sidebar' : 'Pin sidebar open'}
                        aria-label={pinned ? 'Unpin sidebar' : 'Pin sidebar open'}
                    >
                        <PinIcon pinned={pinned} />
                    </button>
                )}
            </div>

            <nav style={{ padding: '0 0.5rem', flex: 1 }}>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`nav-item ${pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)) ? 'active' : ''}`}
                        title={!isExpanded ? link.label : undefined}
                    >
                        <span className="nav-icon">{link.icon}</span>
                        <span className="nav-label">{link.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#F59E0B', flexShrink: 0 }}>
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    <span className="nav-label">v1.2.0</span>
                </span>
                <span className="nav-label" style={{ marginLeft: 'auto', opacity: 0.5 }}>PRO</span>
            </div>
        </aside>
    );
}
