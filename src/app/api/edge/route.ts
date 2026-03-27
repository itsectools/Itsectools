import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Extract headers
    const headers = request.headers;

    // Vercel: x-vercel-id format is often 'iad1::...', 'sfo1::...'
    // Cloudflare: cf-ray format is often '...-IAD'

    const vercelId = headers.get('x-vercel-id');
    const cfRay = headers.get('cf-ray');

    let edgeCity = 'Local';
    let edgeRegion = 'Direct';
    let edgeCountry = '';

    // Simple Map of Common Edge Codes (Expand as needed)
    const edgeMap: Record<string, string> = {
        'iad': 'Ashburn, US', 'iad1': 'Ashburn, US',
        'sfo': 'San Francisco, US', 'sfo1': 'San Francisco, US',
        'lhr': 'London, UK', 'lhr1': 'London, UK',
        'dub': 'Dublin, IE', 'dub1': 'Dublin, IE',
        'fra': 'Frankfurt, DE', 'fra1': 'Frankfurt, DE',
        'sin': 'Singapore, SG', 'sin1': 'Singapore, SG',
        'hnd': 'Tokyo, JP', 'hnd1': 'Tokyo, JP', 'nrt': 'Tokyo, JP',
        'syd': 'Sydney, AU', 'syd1': 'Sydney, AU',
        'gru': 'São Paulo, BR', 'gru1': 'São Paulo, BR',
        'bom': 'Mumbai, IN', 'bom1': 'Mumbai, IN',
        'cdg': 'Paris, FR', 'cdg1': 'Paris, FR',
        'ams': 'Amsterdam, NL',
        'cle': 'Cleveland, US', 'cle1': 'Cleveland, US',
        'pdx': 'Portland, US', 'pdx1': 'Portland, US',
        'sea': 'Seattle, US',
        'atl': 'Atlanta, US',
        'ord': 'Chicago, US',
        'dfw': 'Dallas, US',
        'den': 'Denver, US',
        'lax': 'Los Angeles, US',
        'mia': 'Miami, US',
        'yul': 'Montreal, CA',
        'yyz': 'Toronto, CA',
        'icn': 'Seoul, KR',
        'kix': 'Osaka, JP',
        'hkg': 'Hong Kong, HK',
        'mel': 'Melbourne, AU',
        'bah': 'Bahrain, BH',
        'dxb': 'Dubai, AE',
        'auh': 'Abu Dhabi, AE',
        'jnb': 'Johannesburg, ZA',
        'arn': 'Stockholm, SE',
        'cph': 'Copenhagen, DK',
        'waw': 'Warsaw, PL'
    };

    if (vercelId) {
        // vercel-id: "iad1::xxxxx-yyy" or "pro-iad1::..."
        const parts = vercelId.split('::');
        const prefix = parts[0].replace('pro-', '').replace(/\d+$/, '').toLowerCase();
        const withNum = parts[0].replace('pro-', '').toLowerCase();
        const regionCode = edgeMap[withNum] ? withNum : prefix;
        if (edgeMap[regionCode]) {
            [edgeCity, edgeCountry] = edgeMap[regionCode].split(', ');
            edgeRegion = regionCode.toUpperCase();
        } else {
            edgeCity = `Vercel (${regionCode.toUpperCase()})`;
            edgeCountry = 'Cloud';
        }
    } else if (cfRay) {
        // ...-IAD -> extract last 3
        const parts = cfRay.split('-');
        const colo = parts[parts.length - 1];
        if (edgeMap[colo.toLowerCase()]) {
            [edgeCity, edgeCountry] = edgeMap[colo.toLowerCase()].split(', ');
            edgeRegion = colo;
        } else {
            edgeCity = `Cloudflare (${colo})`;
            edgeCountry = 'Edge';
        }
    } else if (headers.get('x-appengine-city')) {
        // Google Cloud / Firebase Hosting
        // These headers reflect the ingress location (Edge) where the load balancer received the request.
        edgeCity = headers.get('x-appengine-city') || 'Unknown';
        edgeCountry = headers.get('x-appengine-country') || '';
        edgeRegion = headers.get('x-appengine-region') || '';
        // If city is '?' or unknown, use region
        if (edgeCity === '?') edgeCity = edgeRegion;
    } else {
        // Fallback 1: Use Vercel's built-in geo headers (available on Vercel deployments)
        const vercelCity = headers.get('x-vercel-ip-city');
        const vercelCountry = headers.get('x-vercel-ip-country');
        const vercelRegion = headers.get('x-vercel-ip-country-region');

        if (vercelCity && vercelCity !== 'unknown') {
            return NextResponse.json({
                city: decodeURIComponent(vercelCity),
                region: vercelRegion || '',
                country: vercelCountry || 'Cloud',
                provider: 'Vercel Geo'
            });
        }

        // Fallback 2: Client IP geolocation
        const forwardedFor = headers.get('x-forwarded-for');
        const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : null;

        if (clientIp) {
            try {
                const ipRes = await fetch(`https://ip-api.com/json/${clientIp}?fields=city,region,country,isp`, {
                    signal: AbortSignal.timeout(2000),
                    next: { revalidate: 3600 }
                });

                if (ipRes.ok) {
                    const data = await ipRes.json();
                    if (data.status !== 'fail') {
                        return NextResponse.json({
                            city: data.city,
                            region: data.region,
                            country: data.country,
                            provider: `${data.isp} (Est.)`
                        });
                    }
                }
            } catch (e) {
                // Ignore
            }
        }

        // Final Fallback
        return NextResponse.json({
            city: 'Local',
            region: 'Device',
            country: 'Network',
            provider: 'Direct / IP'
        });
    }

    return NextResponse.json({
        city: edgeCity,
        region: edgeRegion,
        country: edgeCountry,
        provider: vercelId ? 'Vercel Edge' : (cfRay ? 'Cloudflare' : (headers.get('x-appengine-city') ? 'Google Edge' : 'Local/Host'))
    });
}
