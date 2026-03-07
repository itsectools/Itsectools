import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const data = searchParams.get('data');

    // If data is received successfully over "unencrypted" HTTP mock
    if (data) {
        return NextResponse.json({
            status: 'success',
            message: 'Data successfully exfiltrated',
            data_received: data
        }, { status: 200 }); // Return 200 OK so the fetch() registers res.ok
    }

    return NextResponse.json({ error: 'No data provided' }, { status: 400 });
}
