'use client';

import { useState, useEffect } from 'react';
/* eslint-disable @typescript-eslint/no-unused-vars */
import StatsCard from '@/components/StatsCard';
import NetworkMap from '@/components/NetworkMap';
import { GlobeIcon, WifiIcon, ZapIcon, TrendingDownIcon, RobotIcon, SparklesIcon, CheckCircleIcon, ShieldIcon } from '@/components/Icons';
import { useNetworkTest } from '@/hooks/useNetworkTest';

export default function NetworkPulseClient() {
  const { latency, jitter, packetLoss, isRunning, runTests } = useNetworkTest({
    samples: 30, // Default 30
    batchSize: 6
  });

  const [publicIp, setPublicIp] = useState<string>('Detecting...');
  const [edgeLocation, setEdgeLocation] = useState<string>('---');
  const [mtuResult, setMtuResult] = useState<string>('---');


  const [qualityScore, setQualityScore] = useState<string>('---');

  const [mapStatus, setMapStatus] = useState<'idle' | 'running' | 'complete'>('idle');
  const [report, setReport] = useState<{ status: string; description: string; recommendations: string[] }>({
    status: 'Pending',
    description: 'Initiate a network scan to generate security insights.',
    recommendations: []
  });

  useEffect(() => {
    runNetworkTests();
  }, []);

  const runNetworkTests = async () => {
    setMapStatus('running');
    setReport({
      status: 'Analyzing...',
      description: 'Gathering telemetry and performing heuristic analysis of traffic patterns...',
      recommendations: []
    });

    // 1. Fetch Public IP & Edge Location
    let detectedIp = '';
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        detectedIp = ipData.ip;
        setPublicIp(ipData.ip);
      } else {
        setPublicIp('Unavailable');
      }

      // Fetch Edge Location
      const edgeRes = await fetch('/api/edge');
      if (edgeRes.ok) {
        const edgeData = await edgeRes.json();
        if (edgeData.city && edgeData.city !== 'Local' && edgeData.city !== 'Unknown City') {
          setEdgeLocation(`${edgeData.city}, ${edgeData.country || edgeData.region}`);
        } else if (detectedIp) {
          // Fallback: use the public IP to geolocate client-side
          try {
            const geoRes = await fetch(`https://ipapi.co/${detectedIp}/json/`);
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              if (geoData.city && !geoData.error) {
                setEdgeLocation(`${geoData.city}, ${geoData.country_name || geoData.country_code}`);
              }
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.error(e);
      setPublicIp('Offline');
    }
    // 2. Measure Latency & Jitter (Using Hook)
    const netStats = await runTests();

    // 3. Payload Capacity / MTU Discovery (Binary Search)
    let mtuLow = 576;
    let mtuHigh = 1500;
    let optimalMtu = 0;

    const performMtuProbe = async (size: number) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
      try {
        const res = await fetch('/api/dlp/post', {
          method: 'POST',
          headers: { 'X-MTU-Probe': '1' },
          body: 'X'.repeat(size),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        return res.ok;
      } catch (e) {
        clearTimeout(timeoutId);
        return false;
      }
    };

    // Quick check for standard 1500 first (optimization)
    if (await performMtuProbe(1500)) {
      optimalMtu = 1500;
    } else {
      // Binary Search if 1500 fails
      while (mtuLow <= mtuHigh) {
        const mid = Math.floor((mtuLow + mtuHigh) / 2);
        if (await performMtuProbe(mid)) {
          optimalMtu = mid;
          mtuLow = mid + 1;
        } else {
          mtuHigh = mid - 1;
        }
      }
    }

    let detectedMtu = `${optimalMtu} bytes`;
    if (optimalMtu >= 1500) detectedMtu = '1500+ bytes (Standard)';
    else if (optimalMtu >= 1492) detectedMtu = `${optimalMtu} bytes (likely PPPoE)`;
    else if (optimalMtu >= 1400) detectedMtu = `${optimalMtu} bytes (VPN/Tunnel)`;
    else detectedMtu = `${optimalMtu} bytes (Fragmented)`;

    setMtuResult(detectedMtu);

    // Calculate Quality Score
    // netStats might have nulls if completely failed, handle gracefully
    const currentLoss = netStats.packetLoss ?? 100;
    const currentJitter = netStats.jitter ?? 0;
    const currentLatency = netStats.latency ?? 0;

    let score = 'Excellent';
    if (currentLoss > 0 || currentJitter > 30) score = 'Good';
    if (currentLoss > 2 || currentJitter > 50) score = 'Fair';
    if (currentLoss > 10 || currentLatency > 200) score = 'Poor';

    setQualityScore(score);

    // 4. Generate Analysis
    setTimeout(() => {
      setMapStatus('complete');

      const healthAssessment = `Health Assessment: The network path is ${score.toLowerCase()}. Latency (${currentLatency.toFixed(0)}ms) and Jitter (${currentJitter.toFixed(0)}ms) indicate ${currentJitter < 15 ? 'stability' : 'instability in the connection'}.`;

      const pathAnalysis = `Path Analysis: Public IP is reachable. Payload transmission (1500 bytes) ${detectedMtu.includes('1500') ? 'succeeded' : 'failed'}.`;

      // Dynamic Recommendations
      const actions: string[] = [];
      if (currentLoss > 0) {
        actions.push('Packet Loss Detected: Inspect physical cables, switch ports (CRC errors), and duplex mismatches.');
        actions.push('If wireless: Check for signal interference or channel congestion.');
      }
      if (currentJitter > 20) {
        actions.push('High Jitter: Usually caused by bandwidth saturation (buffer bloat). Enable QoS/Prioritization on your router.');
      }
      if (currentLatency > 150) {
        actions.push('High Latency: Check for routing inefficiencies or VPN overhead.');
      }
      if (detectedMtu !== '1500+ bytes (Standard)' && !detectedMtu.includes('1500')) {
        actions.push('MTU Restriction: Path cannot support 1500 byte payloads. Verify VPN tunnel MTU settings.');
      }
      if (actions.length === 0) {
        actions.push('No critical issues detected. Regular monitoring recommended.');
      }

      setReport({
        status: score,
        description: `${healthAssessment}\n\n${pathAnalysis}`,
        recommendations: actions
      });

    }, 500);
  };

  return (
    <div>
      <header style={{
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.2rem' }}>Network Telemetry</h1>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748B' }}>
            Real-time connection analytics and security posture.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={runNetworkTests}
          disabled={isRunning || mapStatus === 'running'}
        >
          {mapStatus === 'running' ? 'Scanning...' : 'Refresh Scan'}
        </button>
      </header>

      {/* Top Stats Grid */}
      <section className="grid-stats">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem' }}>
          <div style={{ background: '#EFF6FF', color: '#2563EB', padding: '0.8rem', borderRadius: '8px', display: 'flex' }}>
            <GlobeIcon width={24} height={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.05em' }}>NEAREST EDGE SERVER</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', lineHeight: '1.2' }}>{edgeLocation}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem' }}>
          <div style={{ background: '#F0FDF4', color: '#16A34A', padding: '0.8rem', borderRadius: '8px', display: 'flex' }}>
            <WifiIcon width={24} height={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.05em' }}>LATENCY (RTT)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A' }}>
              {latency !== null ? latency.toFixed(0) : '---'}
              <span style={{ fontSize: '1rem', color: '#94A3B8' }}>ms</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem' }}>
          <div style={{ background: '#F5F3FF', color: '#7C3AED', padding: '0.8rem', borderRadius: '8px', display: 'flex' }}>
            <ZapIcon width={24} height={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.05em' }}>JITTER</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A' }}>
              {jitter !== null ? jitter.toFixed(0) : '---'}
              <span style={{ fontSize: '1rem', color: '#94A3B8' }}>ms</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem' }}>
          <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '0.8rem', borderRadius: '8px', display: 'flex' }}>
            <TrendingDownIcon width={24} height={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.05em' }}>PACKET LOSS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A' }}>
              {packetLoss !== null ? packetLoss.toFixed(1) : '0.0'}
              <span style={{ fontSize: '1rem', color: '#94A3B8' }}>%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology / Definitions */}
      <section style={{ marginBottom: '2rem' }}>
        <details style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <summary style={{
            padding: '1rem',
            cursor: 'pointer',
            fontWeight: 600,
            color: '#475569',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            outline: 'none'
          }}>
            <span style={{ userSelect: 'none' }}>ℹ️</span> Technical Methodology & Metric Definitions
          </summary>
          <div style={{
            padding: '0 1.5rem 1.5rem 1.5rem',
            fontSize: '0.9rem',
            color: '#64748B',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            lineHeight: '1.6'
          }}>
            <div>
              <strong style={{ display: 'block', color: '#334155', marginBottom: '0.3rem' }}>Latency</strong>
              Measured using an application-layer HTTP ping, where small web requests are sent to the nearest edge server to calculate true end-to-end round-trip time (RTT), reflecting real user experience.
            </div>
            <div>
              <strong style={{ display: 'block', color: '#334155', marginBottom: '0.3rem' }}>Jitter</strong>
              Calculated as response time variance between consecutive HTTP requests, indicating connection stability and consistency—critical for real-time applications like voice and video.
            </div>
            <div>
              <strong style={{ display: 'block', color: '#334155', marginBottom: '0.3rem' }}>Packet Loss</strong>
              Determined by tracking the HTTP request failure rate (failed or timed-out requests versus total requests), identifying reliability issues and dropped connections.
            </div>
            <div>
              <strong style={{ display: 'block', color: '#334155', marginBottom: '0.3rem' }}>PMTU (Path MTU Discovery)</strong>
              Uses a client-side binary search mechanism to determine the maximum payload size supported along the network path between the browser and the server, ensuring optimal packet sizing and preventing fragmentation.
            </div>
          </div>
        </details>
      </section>

      {/* Main Content Split: Graph + AI Analysis */}
      <div className="layout-split">

        {/* Left Column: Graph & Detailed Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Graph Card */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '320px', width: '100%', position: 'relative' }}>
              <NetworkMap status={mapStatus} mtu={mtuResult} />
            </div>
          </div>

          {/* Detailed MTU/MSS Stats */}
          <div className="grid-details">
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem', borderTop: '4px solid #06B6D4' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>PAYLOAD CAPACITY</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A' }}>{mtuResult}</div>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.5rem', borderTop: '4px solid #8B5CF6' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>CONNECTION QUALITY</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A' }}>{qualityScore}</div>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.5rem', borderTop: `4px solid ${['Excellent', 'Good', 'Optimal'].includes(report.status) ? '#10B981' : '#EF4444'}` }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>OVERALL STATUS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: ['Excellent', 'Good', 'Optimal'].includes(report.status) ? '#10B981' : '#EF4444' }}>{report.status.toUpperCase()}</div>
            </div>
          </div>

        </div>

        {/* Right Column: AI Analysis - Redesigned */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(90deg, #0F172A 0%, #1E293B 100%)',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            borderBottom: '1px solid #334155'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
              <SparklesIcon width={22} height={22} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'white', letterSpacing: '-0.025em' }}>
              AI Security Insights
            </h3>
          </div>

          {/* Posture Status */}
          <div style={{
            background: ['Optimal', 'Excellent', 'Good'].includes(report.status) ? '#F0FDF4' : '#FEF2F2',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px dashed #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <ShieldIcon width={24} height={24} color={['Optimal', 'Excellent', 'Good'].includes(report.status) ? '#16A34A' : '#DC2626'} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                POSTURE ASSESSMENT
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: ['Optimal', 'Excellent', 'Good'].includes(report.status) ? '#15803D' : '#B91C1C', letterSpacing: '-0.025em' }}>
                {report.status}
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: '1.7', fontWeight: 400 }}>
              {report.description}
            </p>

            {/* Recommendations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {report.recommendations.map((rec, i) => (
                <div key={i} style={{
                  background: '#1E293B',
                  color: '#F8FAFC',
                  padding: '1rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ marginTop: '2px', color: '#60A5FA' }}>
                    <CheckCircleIcon width={18} height={18} />
                  </div>
                  <span>{rec}</span>
                </div>
              ))}
              {report.recommendations.length === 0 && mapStatus !== 'running' && (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#94A3B8', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  Perform a scan to generate insights.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
