'use client';

import { useState, useEffect } from 'react';

// Custom Icons for Widget
const NetworkTreeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="9" y="3" width="6" height="6" rx="1" />
        <rect x="2" y="15" width="6" height="6" rx="1" />
        <rect x="16" y="15" width="6" height="6" rx="1" />
        <path d="M12 9v3" />
        <path d="M5 15v-1a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1" />
    </svg>
);

const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function IpWidget() {
    const [ipData, setIpData] = useState<{ ip: string; country?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/my-ip');
                if (res.ok) {
                    const data = await res.json();
                    setIpData({ ip: data.ip, country: data.country });
                } else {
                    setIpData({ ip: 'Unavailable', country: 'Unknown' });
                }
            } catch (error) {
                console.error('Failed to fetch IP data', error);
                setIpData({ ip: 'Unavailable', country: 'Unknown' });
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleCopy = () => {
        if (ipData?.ip) {
            navigator.clipboard.writeText(ipData.ip);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="ip-widget animate-pulse" style={{ width: 'fit-content' }}>
                <div className="ip-section">
                    <div className="icon-circle bg-gray-100"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                        <div className="h-5 bg-gray-200 rounded w-32"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ip-widget fade-in">
            {/* IP Section */}
            <div className="ip-section">
                <div className="icon-circle" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                    <NetworkTreeIcon width={20} height={20} />
                </div>
                <div>
                    <div className="widget-label">PUBLIC IP</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="widget-value font-mono">{ipData?.ip || '---'}</div>
                        <button
                            onClick={handleCopy}
                            className="copy-button"
                            title="Copy IP Address"
                        >
                            {copied ? (
                                <CheckIcon width={14} height={14} style={{ color: '#16A34A' }} />
                            ) : (
                                <CopyIcon width={14} height={14} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="widget-spacer"></div>

            {/* Location Section */}
            <div className="ip-section">
                <div className="icon-circle" style={{ backgroundColor: '#F3E8FF', color: '#9333EA' }}>
                    <MapPinIcon width={20} height={20} />
                </div>
                <div>
                    <div className="widget-label">LOCATION</div>
                    <div className="widget-value">{ipData?.country || 'Unknown'}</div>
                </div>
            </div>
        </div>
    );
}
