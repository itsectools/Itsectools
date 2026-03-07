import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Try to get IP from headers first if behind a proxy like Vercel/Cloudflare
        const forwardedFor = request.headers.get('x-forwarded-for');
        let ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';

        // Try to get country from Vercel or Cloudflare headers first
        let countryCode = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry');
        let country = 'Unknown';

        // Helper to convert 2-letter country code to full name
        const getCountryName = (code: string) => {
            try {
                const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
                return regionNames.of(code) || code;
            } catch (e) {
                return code;
            }
        };

        if (countryCode) {
            country = getCountryName(countryCode);
        }

        // Fallback to external service if local or headers missing
        if (ip === '127.0.0.1' || ip === '::1' || !countryCode) {
            // Using ipinfo.io as fallback, more reliable than ipapi.co
            // For local dev where IP is localhost, we use their me endpoint
            const url = (ip === '127.0.0.1' || ip === '::1')
                ? 'https://ipinfo.io/json'
                : `https://ipinfo.io/${ip}/json`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                ip = data.ip || ip;
                if (data.country) {
                    country = getCountryName(data.country);
                }
            }
        }

        return NextResponse.json({ ip, country });
    } catch (e) {
        return NextResponse.json({ ip: 'Unavailable', country: 'Unknown' }, { status: 500 });
    }
}
