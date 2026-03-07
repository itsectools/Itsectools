import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    // Simple reflection
    const url = new URL(req.url);
    const q = url.searchParams.get('q');

    // Actually, let's log it or just return success.
    // The firewall is supposed to intercept this request.

    return NextResponse.json({
        status: 'allowed',
        message: 'Request reached the origin server successfully.',
        payload_received: q
    });
}

export async function POST(req: Request) {
    let payload = '';
    try {
        payload = await req.text();
    } catch (e) {
        // ignore
    }

    return NextResponse.json({
        status: 'allowed',
        message: 'POST request reached the origin server successfully.',
        payload_received: payload.substring(0, 200)
    });
}
