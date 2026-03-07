import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Network Pulse Guide — IP Detection, Latency & MTU Testing | ITSecTools',
    description: 'Learn how to use ITSecTools Network Pulse: detect your public IP, measure latency/jitter/packet loss, discover Path MTU, and get AI security insights.',
    alternates: { canonical: 'https://itsectools.com/help/network-pulse' },
};

export default function NetworkPulseGuide() {
    return (
        <div>
            <nav style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <Link href="/help" style={{ color: '#10B981', textDecoration: 'none' }}>← Back to Help</Link>
            </nav>

            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.5rem' }}>Network Pulse — Complete Guide</h1>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
                    Real-time network diagnostics and connection health monitoring from your browser.
                </p>
            </header>

            {/* How to Use */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #ECFDF5' }}>How to Use</h2>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <ol style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li>Navigate to <strong>Network Pulse</strong>. Tests start <strong>automatically</strong> on page load.</li>
                        <li>Wait for all metrics to populate (approximately 10-15 seconds).</li>
                        <li>Review the stats cards, graph visualization, and AI security insights.</li>
                        <li>Click <strong>Refresh Scan</strong> to re-run all tests.</li>
                    </ol>
                </div>
            </section>

            {/* Metrics */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid #ECFDF5' }}>Metrics Explained</h2>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.5rem' }}>Public IP Address</h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                            The external IP address that websites and servers see when your device connects. Useful for verifying <strong>VPN tunnels</strong> (if IP changes after connecting to VPN), <strong>proxy configurations</strong>, and <strong>DNS-based geo-restrictions</strong>.
                        </p>
                    </div>

                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.5rem' }}>Nearest Edge Server</h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                            Identifies which data center (PoP) is serving your requests. Supports 35+ global locations across Vercel, Cloudflare, and Google Cloud edge networks. If it shows an unexpected location, your traffic may be routing through a proxy or VPN.
                        </p>
                    </div>

                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.5rem' }}>Latency (RTT)</h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                            Measured using application-layer HTTP ping (not ICMP). Reflects real end-to-end round-trip time including DNS, TLS, and HTTP overhead — what users actually experience.
                        </p>
                        <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                            <strong>Benchmarks:</strong> &lt;50ms Excellent · 50–100ms Good · 100–200ms Fair · &gt;200ms Poor
                        </div>
                    </div>

                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.5rem' }}>Jitter</h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                            Response time variance between consecutive requests. High jitter indicates unstable connections — critical for <strong>VoIP</strong>, <strong>video conferencing</strong>, and real-time applications.
                        </p>
                        <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                            <strong>Benchmarks:</strong> &lt;15ms Stable · 15-30ms Acceptable · &gt;30ms Unstable
                        </div>
                    </div>

                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.5rem' }}>Packet Loss</h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                            HTTP request failure rate — tracks failed or timed-out requests vs. total. Even 1% loss can cause noticeable impact on TCP performance.
                        </p>
                        <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                            <strong>Benchmarks:</strong> 0% Ideal · &lt;1% Acceptable · &gt;2% Investigate
                        </div>
                    </div>

                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.5rem' }}>Path MTU Discovery (PMTUD)</h3>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                            Uses a client-side binary search (576–1500 bytes) to find the maximum payload your path supports. <strong>1500 bytes</strong> = standard Ethernet. <strong>1492 bytes</strong> = PPPoE overhead. <strong>&lt;1400 bytes</strong> = VPN/tunnel encapsulation. Lower values may cause fragmentation and performance issues.
                        </p>
                    </div>
                </div>
            </section>

            {/* AI Insights */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #ECFDF5' }}>AI Security Insights</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    After all metrics are collected, the AI analysis panel generates a <strong>posture assessment</strong> and <strong>actionable recommendations</strong> based on the results:
                </p>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                    <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
                        <li><strong>Packet loss detected</strong> → Inspect physical cables, switch ports, duplex mismatches</li>
                        <li><strong>High jitter</strong> → Enable QoS/prioritization, check bandwidth saturation</li>
                        <li><strong>High latency</strong> → Check for routing inefficiencies or VPN overhead</li>
                        <li><strong>MTU restriction</strong> → Verify VPN tunnel MTU settings, check for fragmentation</li>
                        <li><strong>No issues</strong> → Regular monitoring recommended</li>
                    </ul>
                </div>
            </section>

            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Link href="/network-pulse" style={{ background: '#10B981', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                    Open Network Pulse →
                </Link>
            </div>
        </div>
    );
}
