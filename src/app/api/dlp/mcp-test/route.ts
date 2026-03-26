import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        return NextResponse.json({
            received: true,
            timestamp: new Date().toISOString(),
            method: body?.method || 'unknown',
        });
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
}
