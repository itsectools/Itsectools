export async function GET() {
    // Network IP Flooder endpoint
    //
    // Returns a simple text response. The attack patterns are in the URL
    // query parameters (client-side), triggering NGFW URL-based IPS signatures
    // (HTTP_CSU-*) on the REQUEST before the response even arrives.
    // No file downloads — pure IPS URL inspection.

    return new Response('Request reached origin. IPS did not intercept.', {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
    });
}
