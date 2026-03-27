import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get('host') || '';

    // Redirect Firebase default domains to the primary custom domain
    if (
        hostname.includes('.web.app') ||
        hostname.includes('.firebaseapp.com') ||
        hostname === 'itsectools.web.app' // Optional safety check
    ) {
        url.hostname = 'itsectools.com';
        url.port = ''; // Ensure port is stripped when redirecting to standard https
        url.protocol = 'https:';

        return NextResponse.redirect(url, 301); // 301 Permanent Redirect
    }

    return NextResponse.next();
}
