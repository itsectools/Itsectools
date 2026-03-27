import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        let bodyText = await request.text();
        let requestedProtocol = 'HTTPS';

        try {
            // Attempt to parse as JSON (new format)
            const jsonBody = JSON.parse(bodyText);
            if (jsonBody.text) {
                bodyText = jsonBody.text;
                requestedProtocol = jsonBody.protocol || 'HTTPS';
            }
        } catch (e) {
            // Fallback for raw text (old format or direct API usage)
        }

        // Simulate processing delay (skip for MTU probes)
        if (!request.headers.get('X-MTU-Probe')) {
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        // --- HTTP Egress Simulation ---
        // If the user requested HTTP, we make a quick outbound unencrypted request.
        // This allows an inline NGFW/DLP positioned *behind* the Next.js server to 
        // inspect the raw egress traffic crossing port 80.
        if (requestedProtocol === 'HTTP') {
            try {
                // We send it to a non-existent or dummy endpoint over port 80.
                // The point isn't to get a response, but to put the payload on the wire unencrypted.
                fetch('http://neverssl.com', {
                    method: 'POST',
                    body: bodyText,
                    // Keep short timeout so we don't hang the API response if the firewall drops it
                    signal: AbortSignal.timeout(1500)
                }).catch(() => {}); // Ignore errors, we just want it on the wire
            } catch (err) {
                // Ignore fetch errors
            }
        }

        // Basic DLP Logic Simulation (Server-Side Mock)
        if (bodyText.includes('XXX-XX') || bodyText.toLowerCase().includes('confidential')) {
            return NextResponse.json(
                { status: 'BLOCKED', rule: 'DLP Rule #209 (Sensitive Text)', timestamp: new Date().toISOString() },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { status: 'ALLOWED', message: 'Content processed successfully', timestamp: new Date().toISOString() },
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json(
            { status: 'ERROR', message: 'Invalid request' },
            { status: 400 }
        );
    }
}
