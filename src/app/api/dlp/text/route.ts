import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { content } = await req.json();
        if (!content) return NextResponse.json({ success: false, message: 'No content provided' }, { status: 400 });

        const sensitivePatterns = [
            /\b\d{3}-\d{2}-\d{4}\b/, // SSN regex
            /\b(?:\d{4}[- ]?){3}\d{4}\b/ // Credit Card regex
        ];

        if (sensitivePatterns.some(p => p.test(content))) {
            return NextResponse.json({ success: false, message: 'DLP VIOLATION: Sensitive data (PII/PCI) detected.' }, { status: 403 });
        }

        if (content.toLowerCase().includes('confidential') || content.toLowerCase().includes('secret')) {
            return NextResponse.json({ success: false, message: 'DLP VIOLATION: Confidential keyword detected.' }, { status: 403 });
        }

        return NextResponse.json({ success: true, message: 'Content posted successfully.' });
    } catch (e) {
        return NextResponse.json({ success: false, message: 'Processing failed' }, { status: 500 });
    }
}
