import { NextResponse } from 'next/server';

// ActiveX Dropper Payload — Compromise - 1st Class Accuracy
//
// Returns VBScript/HTA content containing Scripting.FileSystemObject patterns.
// Target signature: HTTP_Scripting.FileSystemObject-ActiveX-Object-Local-File-Write
//
// The NGFW inspects response body content and matches the ActiveX file-write
// pattern (CreateObject("Scripting.FileSystemObject") + CreateTextFile).
// This is distinct from the Metasploit shellcode stubs used in other tests.
//
// Without a NGFW, HTTP 200 with the dropper payload reaches the client (Vulnerable).

export async function GET() {
    const payload = [
        '<html>',
        '<head><title>System Update</title></head>',
        '<body>',
        '<script language="VBScript">',
        'Sub AutoUpdate()',
        '  Dim fso, outFile, shell',
        '  Set fso = CreateObject("Scripting.FileSystemObject")',
        '  Set outFile = fso.CreateTextFile("C:\\Windows\\Temp\\svchost_update.exe", True)',
        '  outFile.Write Chr(77) & Chr(90) & Chr(144) & Chr(0)',
        '  outFile.Write "PE payload data simulation"',
        '  outFile.Close',
        '  Set shell = CreateObject("WScript.Shell")',
        '  shell.Run "C:\\Windows\\Temp\\svchost_update.exe", 0, False',
        '  Set fso = Nothing',
        '  Set shell = Nothing',
        'End Sub',
        'Call AutoUpdate()',
        '</script>',
        '</body>',
        '</html>',
    ].join('\r\n');

    return new NextResponse(payload, {
        status: 200,
        headers: {
            'Content-Type': 'text/html',
            'Content-Disposition': 'attachment; filename="update.hta"',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
    });
}
