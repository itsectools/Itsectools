'use client';

import { useEffect, useRef, useState } from 'react';

interface Point {
    x: number;
    y: number;
    label: string;
}

export default function NetworkMap({ status, mtu }: { status: 'idle' | 'running' | 'complete', mtu?: string | number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nodesRef = useRef<Point[]>([]);
    const [hoveredNode, setHoveredNode] = useState<{ x: number, y: number, label: string } | null>(null);

    // Initial setup and drawing loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = (time: number) => {
            // Handle High DPI displays
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();

            // Set canvas size (if changed)
            if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
            }

            const width = rect.width;
            const height = rect.height;

            // Updated nodes logic: Define positions relative to current width/height
            const currentNodes: Point[] = [
                { x: width * 0.1, y: height * 0.7, label: 'Client' },
                { x: width * 0.4, y: height * 0.3, label: 'ISP' },
                { x: width * 0.7, y: height * 0.6, label: 'Backbone' },
                { x: width * 0.9, y: height * 0.4, label: 'Server' },
            ];
            nodesRef.current = currentNodes;

            ctx.clearRect(0, 0, width, height);

            // Draw Grid
            ctx.strokeStyle = '#F1F5F9';
            ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
            }

            // Draw Path (Spline)
            if (currentNodes.length > 0) {
                const gradient = ctx.createLinearGradient(0, 0, width, 0);
                gradient.addColorStop(0, '#3b82f6');
                gradient.addColorStop(1, '#8b5cf6');
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 5;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                ctx.beginPath();
                ctx.moveTo(currentNodes[0].x, currentNodes[0].y);

                for (let i = 0; i < currentNodes.length - 1; i++) {
                    const p0 = i > 0 ? currentNodes[i - 1] : currentNodes[0];
                    const p1 = currentNodes[i];
                    const p2 = currentNodes[i + 1];
                    const p3 = i < currentNodes.length - 2 ? currentNodes[i + 2] : currentNodes[i + 1];

                    // Increase tension for more "curvy" look (0.5 is standard, 1.0 is looser/wider curves)
                    // Let's try 0.8
                    const tension = 0.8;
                    const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
                    const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
                    const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
                    const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
                }
                ctx.stroke();

                // Area Fill
                ctx.lineTo(currentNodes[currentNodes.length - 1].x, height);
                ctx.lineTo(currentNodes[0].x, height);
                ctx.closePath();
                ctx.fillStyle = 'rgba(59, 130, 246, 0.04)';
                ctx.fill();
            }

            // Draw Nodes
            currentNodes.forEach((point, index) => {
                // Pulse effect
                ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
                ctx.beginPath();
                const pulse = status === 'running' ? Math.sin(time / 200 + index) * 4 : 0;
                ctx.arc(point.x, point.y, 8 + Math.abs(pulse), 0, Math.PI * 2);
                ctx.fill();

                // Inner dot
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Label
                ctx.fillStyle = '#64748B';
                ctx.font = '600 11px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(point.label, point.x, point.y + 25);
            });

            // Draw Packet Animation
            if (status === 'running') {
                const speed = 0.0015;
                const progress = (time * speed) % 1;
                const totalSegments = currentNodes.length - 1;
                const segmentProgress = progress * totalSegments;
                const currentSegmentIndex = Math.floor(segmentProgress);
                const t = segmentProgress - currentSegmentIndex;

                if (currentSegmentIndex < totalSegments) {
                    const p1 = currentNodes[currentSegmentIndex];
                    const p2 = currentNodes[currentSegmentIndex + 1];
                    const p0 = currentSegmentIndex > 0 ? currentNodes[currentSegmentIndex - 1] : currentNodes[0];
                    const p3 = currentSegmentIndex < currentNodes.length - 2 ? currentNodes[currentSegmentIndex + 2] : currentNodes[currentSegmentIndex + 1];

                    // Catmull-Rom to Bezier logic with updated tension
                    const tension = 0.8;
                    const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
                    const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
                    const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
                    const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

                    const k = 1 - t;
                    const x = (k * k * k * p1.x) + (3 * k * k * t * cp1x) + (3 * k * t * t * cp2x) + (t * t * t * p2.x);
                    const y = (k * k * k * p1.y) + (3 * k * k * t * cp1y) + (3 * k * t * t * cp2y) + (t * t * t * p2.y);

                    ctx.fillStyle = '#2563EB';
                    ctx.beginPath();
                    ctx.arc(x, y, 6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowColor = 'rgba(37, 99, 235, 0.5)';
                    ctx.shadowBlur = 12;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrameId);
    }, [status]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check proximity to any node (20px radius)
        const hit = nodesRef.current.find(node => {
            const dx = x - node.x;
            const dy = y - node.y;
            return Math.sqrt(dx * dx + dy * dy) < 20;
        });

        if (hit) {
            setHoveredNode({ x: hit.x, y: hit.y, label: hit.label });
        } else {
            setHoveredNode(null);
        }
    };

    const handleMouseLeave = () => {
        setHoveredNode(null);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#FFFFFF', borderRadius: 'inherit' }}>
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', cursor: hoveredNode ? 'pointer' : 'default' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            />

            {/* Tooltip */}
            {hoveredNode && (
                <div style={{
                    position: 'absolute',
                    left: hoveredNode.label === 'Server' ? undefined : hoveredNode.x + 15,
                    right: hoveredNode.label === 'Server' ? '20px' : undefined,
                    top: hoveredNode.y - 45,
                    background: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #E2E8F0',
                    zIndex: 10,
                    pointerEvents: 'none',
                    minWidth: '160px'
                }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.25rem' }}>{hoveredNode.label}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>
                        Path MTU: 1500 bytes
                    </div>
                </div>
            )}

            {/* Status Overlay - Bottom Bar matching map background */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40px',
                background: '#F8FAFC', // Light background for status bar
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 1.5rem',
                pointerEvents: 'none' // Let clicks pass through if needed, though mostly visual
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: status === 'complete' ? '#10b981' : status === 'running' ? '#F59E0B' : '#94a3b8',
                    }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                        {status === 'complete' ? 'Trace Complete' : status === 'running' ? 'Tracing Route...' : 'Ready'}
                    </span>
                </div>

                {status === 'complete' && mtu && (
                    <div className="fade-in" style={{
                        fontSize: '0.75rem',
                        color: typeof mtu === 'string' && mtu.includes('1500') ? '#10B981' : '#F59E0B',
                        fontWeight: 700,
                        letterSpacing: '0.05em'
                    }}>
                        {typeof mtu === 'string' && mtu.includes('1500') ? '✓ NO FRAGMENTATION DETECTED' : '⚠ MTU RESTRICTION DETECTED'}
                    </div>
                )}
            </div>
        </div>
    );
}
