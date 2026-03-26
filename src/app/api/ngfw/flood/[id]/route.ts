// Dynamic flood route — each request hits a unique path (/api/ngfw/flood/0, /1, etc.)
// Attack payloads are in the URL query string; response is innocent text.

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return new Response(`Flow ${id} — Request reached origin. IPS did not intercept.`, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
    });
}
