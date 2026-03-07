
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useNetworkTest } from './useNetworkTest';

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('useNetworkTest', () => {
    beforeEach(() => {
        fetchMock.mockReset();
        // Use real timers for simplicity and to avoid Promise/setTimeout race conditions in tests
        vi.useRealTimers();
    });

    it('should initialize with default states', () => {
        const { result } = renderHook(() => useNetworkTest());

        expect(result.current.latency).toBeNull();
        expect(result.current.jitter).toBeNull();
        expect(result.current.packetLoss).toBeNull();
        expect(result.current.isRunning).toBe(false);
        expect(result.current.progress).toBe(0);
    });

    it('should calculate latency and packet loss correctly for perfect network', async () => {
        // Mock successful fetch with slight delay
        fetchMock.mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        json: async () => ({}),
                    } as Response);
                }, 10);
            });
        });

        const { result } = renderHook(() => useNetworkTest({ samples: 2, batchSize: 2 }));

        await act(async () => {
            // triggered async
            result.current.runTests();
        });

        expect(result.current.isRunning).toBe(true);

        // Wait for completion
        await waitFor(() => expect(result.current.isRunning).toBe(false), { timeout: 2000 });

        expect(result.current.packetLoss).toBe(0);
        // Latency should be approx 10ms
        expect(result.current.latency).not.toBeNull();
        expect(result.current.latency).toBeGreaterThan(0);
    });

    it('should detect 100% packet loss', async () => {
        fetchMock.mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useNetworkTest({ samples: 2, batchSize: 2 }));

        await act(async () => {
            result.current.runTests();
        });

        await waitFor(() => expect(result.current.isRunning).toBe(false), { timeout: 2000 });

        expect(result.current.packetLoss).toBe(100);
        expect(result.current.latency).toBeNull();
        expect(result.current.jitter).toBe(0);
    });

    it('should calculate mixed results correctly', async () => {
        let callCount = 0;
        fetchMock.mockImplementation(() => {
            callCount++;
            return new Promise((resolve, reject) => {
                if (callCount % 2 === 0) {
                    // Fail every second request
                    reject(new Error('Fail'));
                } else {
                    // Succeed
                    setTimeout(() => {
                        resolve({
                            ok: true,
                            json: async () => ({}),
                        } as Response);
                    }, 5);
                }
            });
        });

        const { result } = renderHook(() => useNetworkTest({ samples: 4, batchSize: 4 }));

        await act(async () => {
            result.current.runTests();
        });

        await waitFor(() => expect(result.current.isRunning).toBe(false), { timeout: 2000 });

        // 4 samples: 1(ok), 2(fail), 3(ok), 4(fail). 
        // 2 failures = 50% loss
        expect(result.current.packetLoss).toBe(50);
        expect(result.current.latency).toBeGreaterThan(0);
    });
});
