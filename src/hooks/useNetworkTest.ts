
import { useState, useCallback } from 'react';

interface NetworkStats {
    latency: number | null;
    jitter: number | null;
    packetLoss: number | null;
    isRunning: boolean;
    progress: number;
}

interface UseNetworkTestOptions {
    url?: string;
    samples?: number;
    batchSize?: number;
    timeout?: number;
}

export const useNetworkTest = ({
    url = '/ping.json',
    samples = 30,
    batchSize = 6,
    timeout = 1500,
}: UseNetworkTestOptions = {}) => {
    const [stats, setStats] = useState<NetworkStats>({
        latency: null,
        jitter: null,
        packetLoss: null,
        isRunning: false,
        progress: 0,
    });

    const performPing = async (signal: AbortSignal): Promise<{ success: boolean; rtt: number }> => {
        const start = performance.now();
        try {
            const response = await fetch(url, {
                cache: 'no-store',
                signal,
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const end = performance.now();
            return { success: true, rtt: end - start };
        } catch {
            return { success: false, rtt: 0 };
        }
    };

    const runTests = useCallback(async () => {
        setStats({
            latency: null,
            jitter: null,
            packetLoss: null,
            isRunning: true,
            progress: 0,
        });

        const latencies: number[] = [];
        let packetLossCount = 0;

        for (let i = 0; i < samples; i += batchSize) {
            const currentBatchSize = Math.min(batchSize, samples - i);
            const promises = [];

            for (let j = 0; j < currentBatchSize; j++) {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);

                promises.push(
                    performPing(controller.signal).then((result) => {
                        clearTimeout(timeoutId);
                        return result;
                    })
                );
            }

            const results = await Promise.all(promises);

            results.forEach((res) => {
                if (res.success) {
                    latencies.push(res.rtt);
                } else {
                    packetLossCount++;
                }
            });

            setStats((prev) => ({
                ...prev,
                progress: Math.min(100, Math.round(((i + currentBatchSize) / samples) * 100)),
            }));

            // Small delay between batches
            if (i + currentBatchSize < samples) {
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
        }

        // Calculate metrics
        let avgLatency = 0;
        let jitter = 0;
        let lossPercent = 100;

        if (latencies.length > 0) {
            avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;

            // RFC 3550 Jitter Calculation: J(i) = J(i-1) + (|D(i-1, i)| - J(i-1)) / 16
            // Simplified for non-streaming: Mean Deviation of consecutive RTT differences
            if (latencies.length > 1) {
                let jitterSum = 0;
                for (let k = 0; k < latencies.length - 1; k++) {
                    jitterSum += Math.abs(latencies[k + 1] - latencies[k]);
                }
                jitter = jitterSum / (latencies.length - 1);
            } else {
                jitter = 0;
            }

            lossPercent = (packetLossCount / samples) * 100;
        } else {
            // 100% Packet Loss
            if (packetLossCount === samples) {
                lossPercent = 100;
            }
        }

        const resultStats = {
            latency: latencies.length > 0 ? avgLatency : null,
            jitter: latencies.length > 1 ? jitter : 0,
            packetLoss: lossPercent,
        };

        setStats({
            ...resultStats,
            isRunning: false,
            progress: 100,
        });

        return resultStats;
    }, [url, samples, batchSize, timeout]);

    return { ...stats, runTests };
};
