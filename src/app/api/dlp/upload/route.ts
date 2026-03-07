import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ message: 'No file received' }, { status: 400 });
        }

        // We don't actually process the file; we just acknowledge receipt
        // This is enough to establish an HTTP DATA stream that DLP engines can inspect
        return NextResponse.json({ message: 'Upload received' }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
    }
}
