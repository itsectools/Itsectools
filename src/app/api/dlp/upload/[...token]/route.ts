import { NextResponse } from 'next/server';

// Catch-all dynamic segment route: /api/dlp/upload/<any-random-token>
// Each upload request from the client uses a unique random URL, defeating
// Forcepoint's URL Shunning cache which pre-blocks repeat uploads to the 
// same endpoint after the first inspection triggers a block.
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ message: 'No file received' }, { status: 400 });
        }

        // Acknowledge receipt — the purpose is the DLP agent inspecting the stream
        return NextResponse.json({ message: 'Upload received' }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
    }
}
