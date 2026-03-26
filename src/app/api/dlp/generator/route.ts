import { NextResponse } from 'next/server';
import archiver from 'archiver';
// @ts-ignore
import archiverZipEncrypted from 'archiver-zip-encrypted';

// Register the encrypted zip format with archiver
archiver.registerFormat('zip-encrypted', archiverZipEncrypted);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text, password } = body;

        if (!text || !password) {
            return new NextResponse('Missing text or password payload', { status: 400 });
        }

        // Decode the Base64 + XOR Transit Mask (Evades Endpoint DLP during upload)
        const b64Decoded = Buffer.from(text, 'base64').toString('binary');
        const xorRemoved = b64Decoded.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ 0x55)).join('');
        const rawPayload = decodeURIComponent(xorRemoved);

        // Create a buffer stream locally to capture the zip data
        const chunks: any[] = [];
        
        const archive = archiver('zip-encrypted' as any, {
            zlib: { level: 8 },
            encryptionMethod: 'aes256', // Modern robust AES encryption
            password: password
        } as any);

        // Capture data events into our buffer array
        archive.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));

        // Define a promise to wait for the archive to fully finalize
        const streamPromise = new Promise<Buffer>((resolve, reject) => {
            archive.on('end', () => resolve(Buffer.concat(chunks)));
            archive.on('error', (err: any) => reject(err));
        });

        // Add the sensitive text file into the encrypted archive (using the decoded text)
        archive.append(rawPayload, { name: 'payload.txt' });

        // Finalize the archive, telling the archiver we are done appending
        await archive.finalize();

        // Wait for streaming to finish building the complete ZIP buffer
        const finalBuffer = await streamPromise;

        // Return the exact ZIP bytes as an octet-stream for the browser to download
        return new NextResponse(finalBuffer as unknown as BodyInit, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="protected_payload.zip"',
                'Content-Length': finalBuffer.byteLength.toString(),
            },
        });

    } catch (error) {
        console.error('Error generating encrypted Zip:', error);
        return new NextResponse('Internal Server Error generating Zip', { status: 500 });
    }
}
