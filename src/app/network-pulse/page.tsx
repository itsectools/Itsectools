import NetworkPulseClient from './NetworkPulseClient';

export default function NetworkPulsePage() {
  return (
    <>
      <NetworkPulseClient />

      {/* SEO Content Section - Server-rendered, collapsible for clean UI */}
      <details className="seo-details">
        <summary>Learn more about this tool</summary>
        <div className="seo-content">
          <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '1rem' }}>Free Network Telemetry &amp; Public IP Identifier Tool</h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Instantly identify the public IP address of your network, measure real-time latency, jitter, and packet loss, and discover your Path MTU — all from your browser. ITSecTools Network Pulse provides comprehensive network diagnostics with AI-powered security insights, helping you verify VPN connections, troubleshoot routing issues, and validate firewall configurations.
          </p>

          <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>What You Can Measure</h3>
          <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: '0 0 1.5rem 0' }}>
            <li><strong>Public IP Address Detection</strong> — Instantly see the external IP address that websites and servers see when your device connects. Useful for verifying VPN tunnels, proxy configurations, and DNS-based geo-restrictions.</li>
            <li><strong>Nearest Edge Server</strong> — Identifies which data center (PoP) is serving your requests, supporting 35+ global locations across Vercel, Cloudflare, and Google Cloud edge networks.</li>
            <li><strong>Latency (RTT)</strong> — Application-layer HTTP ping measuring true end-to-end round-trip time, reflecting real user browsing experience rather than ICMP-based measurements.</li>
            <li><strong>Jitter</strong> — Response time variance between consecutive requests, critical for VoIP, video conferencing, and real-time application quality assessment.</li>
            <li><strong>Packet Loss</strong> — HTTP request failure rate tracking to identify connection reliability issues and dropped packets.</li>
            <li><strong>Path MTU Discovery (PMTUD)</strong> — Binary search algorithm testing payload sizes from 576 to 1500 bytes to detect VPN tunnel overhead, PPPoE encapsulation, or fragmentation issues.</li>
          </ul>

          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
            All measurements run directly from your browser — no agents, no downloads, no sign-up required. Results include AI-generated security recommendations for issues like high jitter, packet loss, or restricted MTU paths.
          </p>
        </div>
      </details>
    </>
  );
}
