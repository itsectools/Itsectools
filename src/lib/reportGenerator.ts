import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont, grayscale } from 'pdf-lib';

// Color scheme
const COLORS = {
    headerBg: rgb(15 / 255, 23 / 255, 42 / 255),       // #0F172A dark navy
    white: rgb(1, 1, 1),
    primary: rgb(37 / 255, 99 / 255, 235 / 255),        // #2563EB
    green: rgb(16 / 255, 185 / 255, 129 / 255),         // #10B981
    red: rgb(239 / 255, 68 / 255, 68 / 255),            // #EF4444
    amber: rgb(245 / 255, 158 / 255, 11 / 255),         // #F59E0B
    textMain: rgb(15 / 255, 23 / 255, 42 / 255),        // #0F172A
    textMuted: rgb(100 / 255, 116 / 255, 139 / 255),    // #64748B
    tableHeader: rgb(241 / 255, 245 / 255, 249 / 255),  // #F1F5F9
    tableAlt: rgb(248 / 255, 250 / 255, 252 / 255),     // #F8FAFC
    border: rgb(226 / 255, 232 / 255, 240 / 255),       // #E2E8F0
    lightGreen: rgb(220 / 255, 252 / 255, 231 / 255),   // #DCFCE7
    lightRed: rgb(254 / 255, 226 / 255, 226 / 255),     // #FEE2E2
};

const PAGE_WIDTH = 595;  // A4
const PAGE_HEIGHT = 842;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

function getRating(score: number): { text: string; color: typeof COLORS.green } {
    if (score >= 90) return { text: 'EXCELLENT', color: COLORS.green };
    if (score >= 70) return { text: 'STRONG', color: COLORS.green };
    if (score >= 40) return { text: 'GAPS DETECTED', color: COLORS.amber };
    return { text: 'CRITICAL', color: COLORS.red };
}

function addPage(pdfDoc: PDFDocument): PDFPage {
    return pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
}

function checkPage(pdfDoc: PDFDocument, page: PDFPage, y: number, needed: number): { page: PDFPage; y: number } {
    if (y - needed < 40) {
        const newPage = addPage(pdfDoc);
        return { page: newPage, y: PAGE_HEIGHT - 50 };
    }
    return { page, y };
}

function drawHeader(
    page: PDFPage,
    fonts: { bold: PDFFont; regular: PDFFont },
    title: string,
    metadata: { date: string; ip?: string; location?: string }
): number {
    const headerHeight = 100;
    // Dark navy background
    page.drawRectangle({
        x: 0, y: PAGE_HEIGHT - headerHeight,
        width: PAGE_WIDTH, height: headerHeight,
        color: COLORS.headerBg,
    });

    // Title
    page.drawText(title, {
        x: MARGIN, y: PAGE_HEIGHT - 40,
        size: 22, font: fonts.bold, color: COLORS.white,
    });

    // Metadata line
    const metaLine = `${metadata.date}${metadata.ip ? '  |  IP: ' + metadata.ip : ''}${metadata.location ? '  |  ' + metadata.location : ''}`;
    page.drawText(metaLine, {
        x: MARGIN, y: PAGE_HEIGHT - 62,
        size: 9, font: fonts.regular, color: rgb(148 / 255, 163 / 255, 184 / 255),
    });

    // Branding
    page.drawText('itsectools.com', {
        x: MARGIN, y: PAGE_HEIGHT - 82,
        size: 9, font: fonts.bold, color: rgb(14 / 255, 199 / 255, 168 / 255),
    });

    return PAGE_HEIGHT - headerHeight - 30;
}

function drawGauge(
    page: PDFPage,
    fonts: { bold: PDFFont; regular: PDFFont },
    score: number,
    centerX: number,
    centerY: number,
    radius: number
): void {
    const arcSegments = 60;
    const bandWidth = 18;
    const innerR = radius - bandWidth;

    // Draw colored arc band (semi-circle, left to right = 180° to 0°)
    for (let i = 0; i < arcSegments; i++) {
        const angle1 = Math.PI - (i / arcSegments) * Math.PI;
        const angle2 = Math.PI - ((i + 1) / arcSegments) * Math.PI;
        const pct = i / arcSegments;

        let color;
        if (pct < 0.4) color = COLORS.red;
        else if (pct < 0.7) color = COLORS.amber;
        else color = COLORS.green;

        // Draw arc segment as a quad (4 points)
        const x1o = centerX + radius * Math.cos(angle1);
        const y1o = centerY + radius * Math.sin(angle1);
        const x2o = centerX + radius * Math.cos(angle2);
        const y2o = centerY + radius * Math.sin(angle2);
        const x1i = centerX + innerR * Math.cos(angle1);
        const y1i = centerY + innerR * Math.sin(angle1);
        const x2i = centerX + innerR * Math.cos(angle2);
        const y2i = centerY + innerR * Math.sin(angle2);

        // Approximate with two triangles using lines
        page.drawLine({ start: { x: x1o, y: y1o }, end: { x: x2o, y: y2o }, thickness: bandWidth, color, opacity: 0.85 });
    }

    // Draw background arc (subtle gray base)
    page.drawLine({
        start: { x: centerX - radius + 5, y: centerY },
        end: { x: centerX + radius - 5, y: centerY },
        thickness: 1, color: COLORS.border,
    });

    // Draw needle
    const needleAngle = Math.PI - (score / 100) * Math.PI;
    const needleLen = innerR - 8;
    const nx = centerX + needleLen * Math.cos(needleAngle);
    const ny = centerY + needleLen * Math.sin(needleAngle);
    page.drawLine({
        start: { x: centerX, y: centerY },
        end: { x: nx, y: ny },
        thickness: 2.5, color: COLORS.textMain,
    });

    // Needle center dot
    page.drawCircle({ x: centerX, y: centerY, size: 5, color: COLORS.textMain });

    // Score text
    const scoreText = `${Math.round(score)}%`;
    const scoreWidth = fonts.bold.widthOfTextAtSize(scoreText, 28);
    page.drawText(scoreText, {
        x: centerX - scoreWidth / 2, y: centerY - 30,
        size: 28, font: fonts.bold, color: COLORS.textMain,
    });

    // Rating label
    const rating = getRating(score);
    const ratingWidth = fonts.bold.widthOfTextAtSize(rating.text, 11);
    page.drawText(rating.text, {
        x: centerX - ratingWidth / 2, y: centerY - 48,
        size: 11, font: fonts.bold, color: rating.color,
    });
}

function drawSectionHeader(
    page: PDFPage,
    fonts: { bold: PDFFont },
    title: string,
    y: number
): number {
    // Blue accent bar
    page.drawRectangle({
        x: MARGIN, y: y - 2,
        width: 4, height: 16,
        color: COLORS.primary,
    });
    page.drawText(title, {
        x: MARGIN + 12, y: y,
        size: 13, font: fonts.bold, color: COLORS.textMain,
    });
    return y - 25;
}

function drawSummaryBoxes(
    page: PDFPage,
    fonts: { bold: PDFFont; regular: PDFFont },
    boxes: Array<{ label: string; value: string; color?: typeof COLORS.green }>,
    y: number
): number {
    const boxWidth = CONTENT_WIDTH / boxes.length - 8;
    const boxHeight = 50;

    boxes.forEach((box, i) => {
        const x = MARGIN + i * (boxWidth + 10);
        page.drawRectangle({
            x, y: y - boxHeight,
            width: boxWidth, height: boxHeight,
            color: COLORS.tableHeader,
            borderColor: COLORS.border,
            borderWidth: 0.5,
        });
        // Value
        const valWidth = fonts.bold.widthOfTextAtSize(box.value, 20);
        page.drawText(box.value, {
            x: x + boxWidth / 2 - valWidth / 2, y: y - 25,
            size: 20, font: fonts.bold, color: box.color || COLORS.textMain,
        });
        // Label
        const lblWidth = fonts.regular.widthOfTextAtSize(box.label, 8);
        page.drawText(box.label, {
            x: x + boxWidth / 2 - lblWidth / 2, y: y - 42,
            size: 8, font: fonts.regular, color: COLORS.textMuted,
        });
    });

    return y - boxHeight - 20;
}

function drawCategoryBars(
    page: PDFPage,
    fonts: { bold: PDFFont; regular: PDFFont },
    categories: Array<{ name: string; passed: number; total: number }>,
    y: number
): number {
    const barHeight = 14;
    const barMaxWidth = CONTENT_WIDTH - 160;

    categories.forEach((cat, i) => {
        const rowY = y - i * 30;
        const pct = cat.total > 0 ? cat.passed / cat.total : 0;
        const color = pct >= 0.7 ? COLORS.green : pct >= 0.4 ? COLORS.amber : COLORS.red;

        // Category name
        page.drawText(cat.name, {
            x: MARGIN, y: rowY,
            size: 10, font: fonts.regular, color: COLORS.textMain,
        });

        // Background bar
        const barX = MARGIN + 130;
        page.drawRectangle({
            x: barX, y: rowY - 2,
            width: barMaxWidth, height: barHeight,
            color: COLORS.tableHeader,
        });

        // Filled bar
        if (pct > 0) {
            page.drawRectangle({
                x: barX, y: rowY - 2,
                width: barMaxWidth * pct, height: barHeight,
                color,
            });
        }

        // Score text
        page.drawText(`${cat.passed}/${cat.total}`, {
            x: barX + barMaxWidth + 8, y: rowY,
            size: 10, font: fonts.bold, color,
        });
    });

    return y - categories.length * 30 - 15;
}

function drawTable(
    pdfDoc: PDFDocument,
    page: PDFPage,
    fonts: { bold: PDFFont; regular: PDFFont },
    headers: string[],
    rows: Array<{ cells: string[]; result: 'blocked' | 'leaked' | 'passed' | 'allowed' | 'error' }>,
    colWidths: number[],
    y: number
): { page: PDFPage; y: number } {
    let currentPage = page;
    let currentY = y;
    const rowHeight = 22;

    // Header row
    currentPage.drawRectangle({
        x: MARGIN, y: currentY - rowHeight,
        width: CONTENT_WIDTH, height: rowHeight,
        color: COLORS.headerBg,
    });
    let hx = MARGIN + 8;
    headers.forEach((h, i) => {
        currentPage.drawText(h, {
            x: hx, y: currentY - 15,
            size: 8, font: fonts.bold, color: COLORS.white,
        });
        hx += colWidths[i];
    });
    currentY -= rowHeight;

    // Data rows
    rows.forEach((row, ri) => {
        const check = checkPage(pdfDoc, currentPage, currentY, rowHeight);
        currentPage = check.page;
        currentY = check.y;

        // Alternating background
        if (ri % 2 === 0) {
            currentPage.drawRectangle({
                x: MARGIN, y: currentY - rowHeight,
                width: CONTENT_WIDTH, height: rowHeight,
                color: COLORS.tableAlt,
            });
        }

        let cx = MARGIN + 8;
        row.cells.forEach((cell, ci) => {
            // Last column = result with colored dot
            if (ci === row.cells.length - 1) {
                const isPass = row.result === 'blocked';
                const dotColor = isPass ? COLORS.green : row.result === 'error' ? COLORS.amber : COLORS.red;
                currentPage.drawCircle({
                    x: cx + 5, y: currentY - 13,
                    size: 4, color: dotColor,
                });
                currentPage.drawText(cell, {
                    x: cx + 14, y: currentY - 16,
                    size: 9, font: fonts.bold, color: dotColor,
                });
            } else {
                currentPage.drawText(cell.substring(0, 40), {
                    x: cx, y: currentY - 16,
                    size: 9, font: fonts.regular, color: COLORS.textMain,
                });
            }
            cx += colWidths[ci];
        });
        currentY -= rowHeight;
    });

    return { page: currentPage, y: currentY - 10 };
}

function drawGapsAndRecs(
    pdfDoc: PDFDocument,
    page: PDFPage,
    fonts: { bold: PDFFont; regular: PDFFont },
    gaps: string[],
    recommendations: string[],
    y: number
): { page: PDFPage; y: number } {
    let currentPage = page;
    let currentY = y;

    if (gaps.length > 0) {
        const check1 = checkPage(pdfDoc, currentPage, currentY, 30 + gaps.length * 18);
        currentPage = check1.page; currentY = check1.y;

        currentY = drawSectionHeader(currentPage, fonts, 'Gaps Identified', currentY);
        gaps.forEach((gap, i) => {
            currentPage.drawCircle({ x: MARGIN + 6, y: currentY - 1, size: 3, color: COLORS.red });
            currentPage.drawText(gap, {
                x: MARGIN + 16, y: currentY - 4,
                size: 9, font: fonts.regular, color: COLORS.textMain,
            });
            currentY -= 18;
        });
        currentY -= 10;
    }

    if (recommendations.length > 0) {
        const check2 = checkPage(pdfDoc, currentPage, currentY, 30 + recommendations.length * 18);
        currentPage = check2.page; currentY = check2.y;

        currentY = drawSectionHeader(currentPage, fonts, 'Recommendations', currentY);
        recommendations.forEach((rec, i) => {
            currentPage.drawText(`${i + 1}.`, {
                x: MARGIN + 4, y: currentY - 4,
                size: 9, font: fonts.bold, color: COLORS.primary,
            });
            currentPage.drawText(rec, {
                x: MARGIN + 20, y: currentY - 4,
                size: 9, font: fonts.regular, color: COLORS.textMain,
            });
            currentY -= 18;
        });
    }

    return { page: currentPage, y: currentY };
}

function drawFooter(page: PDFPage, fonts: { regular: PDFFont; bold: PDFFont }) {
    page.drawLine({
        start: { x: MARGIN, y: 35 },
        end: { x: PAGE_WIDTH - MARGIN, y: 35 },
        thickness: 0.5, color: COLORS.border,
    });
    page.drawText('Report generated by ITSecTools', {
        x: MARGIN, y: 22, size: 8, font: fonts.regular, color: COLORS.textMuted,
    });
    page.drawText('itsectools.com', {
        x: MARGIN + 170, y: 22, size: 8, font: fonts.bold, color: COLORS.primary,
    });
    page.drawText('For authorized security testing only.', {
        x: PAGE_WIDTH - MARGIN - 150, y: 22, size: 8, font: fonts.regular, color: COLORS.textMuted,
    });
}

// ─── Kill Chain Visualization (MITRE) ───

function drawKillChain(
    page: PDFPage,
    fonts: { bold: PDFFont; regular: PDFFont },
    stages: Array<{ name: string; techniqueId: string; result: 'blocked' | 'passed' | 'pending' }>,
    y: number
): number {
    const boxW = 105;
    const boxH = 55;
    const gapX = 20;
    const totalW = stages.length * boxW + (stages.length - 1) * gapX;
    const startX = MARGIN + (CONTENT_WIDTH - totalW) / 2;

    stages.forEach((stage, i) => {
        const x = startX + i * (boxW + gapX);
        const isBlocked = stage.result === 'blocked';
        const isPending = stage.result === 'pending';
        const bgColor = isBlocked ? COLORS.lightGreen : isPending ? COLORS.tableHeader : COLORS.lightRed;
        const borderColor = isBlocked ? COLORS.green : isPending ? COLORS.border : COLORS.red;

        // Box
        page.drawRectangle({
            x, y: y - boxH, width: boxW, height: boxH,
            color: bgColor, borderColor, borderWidth: 1.5,
        });

        // Stage label
        const stageLabel = `Stage ${i + 1}`;
        const slw = fonts.bold.widthOfTextAtSize(stageLabel, 8);
        page.drawText(stageLabel, {
            x: x + boxW / 2 - slw / 2, y: y - 14,
            size: 8, font: fonts.bold, color: COLORS.textMuted,
        });

        // Technique ID
        const tw = fonts.regular.widthOfTextAtSize(stage.techniqueId, 8);
        page.drawText(stage.techniqueId, {
            x: x + boxW / 2 - tw / 2, y: y - 26,
            size: 8, font: fonts.regular, color: COLORS.textMain,
        });

        // Result
        const resultText = isBlocked ? 'BLOCKED' : isPending ? 'PENDING' : 'PASSED';
        const resultColor = isBlocked ? COLORS.green : isPending ? COLORS.textMuted : COLORS.red;
        const rw = fonts.bold.widthOfTextAtSize(resultText, 9);
        page.drawText(resultText, {
            x: x + boxW / 2 - rw / 2, y: y - 42,
            size: 9, font: fonts.bold, color: resultColor,
        });

        // Arrow to next stage
        if (i < stages.length - 1) {
            const arrowX = x + boxW + 3;
            const arrowY = y - boxH / 2;
            page.drawLine({
                start: { x: arrowX, y: arrowY },
                end: { x: arrowX + gapX - 6, y: arrowY },
                thickness: 1.5, color: COLORS.textMuted,
            });
            // Arrow head
            page.drawLine({
                start: { x: arrowX + gapX - 10, y: arrowY + 4 },
                end: { x: arrowX + gapX - 6, y: arrowY },
                thickness: 1.5, color: COLORS.textMuted,
            });
            page.drawLine({
                start: { x: arrowX + gapX - 10, y: arrowY - 4 },
                end: { x: arrowX + gapX - 6, y: arrowY },
                thickness: 1.5, color: COLORS.textMuted,
            });
        }
    });

    return y - boxH - 20;
}

// ─── Public Report Generators ───

export interface DLPTestResult {
    id: number;
    time: string;
    category: 'upload' | 'post' | 'mcp';
    protocol: string;
    file?: string;
    content?: string;
    result: 'blocked' | 'leaked';
}

export interface NGFWTestResult {
    id: number;
    time: string;
    category: string;
    testName: string;
    severity: string;
    result: 'blocked' | 'allowed' | 'error';
}

export interface MITREStageResult {
    stage: number;
    name: string;
    technique: string;
    techniqueId: string;
    result: 'blocked' | 'passed' | 'pending';
    detail: string;
}

export async function generateDLPReport(
    tests: DLPTestResult[],
    ipData?: { ip: string; country: string }
): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fonts = { bold, regular };

    let page = addPage(pdfDoc);
    const blocked = tests.filter(t => t.result === 'blocked').length;
    const score = tests.length > 0 ? (blocked / tests.length) * 100 : 0;

    // Header
    let y = drawHeader(page, fonts, 'DLP Validation Report', {
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        ip: ipData?.ip,
        location: ipData?.country,
    });

    // Gauge
    drawGauge(page, fonts, score, PAGE_WIDTH / 2, y - 30, 70);
    y -= 120;

    // Summary boxes
    y = drawSummaryBoxes(page, fonts, [
        { label: 'TESTS RUN', value: String(tests.length) },
        { label: 'BLOCKED', value: String(blocked), color: COLORS.green },
        { label: 'LEAKED', value: String(tests.length - blocked), color: tests.length - blocked > 0 ? COLORS.red : COLORS.green },
        { label: 'SCORE', value: `${Math.round(score)}%`, color: getRating(score).color },
    ], y);

    // Protocol coverage
    const protocols = ['HTTPS', 'HTTP', 'FTP', 'POST', 'MCP'];
    const protocolStats = protocols.map(p => {
        const pTests = tests.filter(t => t.protocol === p);
        return { name: p, passed: pTests.filter(t => t.result === 'blocked').length, total: pTests.length };
    }).filter(p => p.total > 0);

    if (protocolStats.length > 0) {
        y = drawSectionHeader(page, fonts, 'Protocol Coverage', y);
        y = drawCategoryBars(page, fonts, protocolStats, y);
    }

    // Test details table
    const check = checkPage(pdfDoc, page, y, 60);
    page = check.page; y = check.y;

    y = drawSectionHeader(page, fonts, 'Test Details', y);
    // Add note about proxy mode filename limitation
    const hasAgentBlocks = tests.some(t => t.file?.includes('Endpoint DLP Block'));
    if (hasAgentBlocks) {
        page.drawText('Note: File names may not appear when the DLP agent operates in proxy/inline mode, as the agent intercepts', {
            x: MARGIN, y, size: 7, font: fonts.regular, color: rgb(0.39, 0.45, 0.55),
        });
        y -= 10;
        page.drawText('the file selection before the browser can read it. Sequential numbering is used to distinguish each test.', {
            x: MARGIN, y, size: 7, font: fonts.regular, color: rgb(0.39, 0.45, 0.55),
        });
        y -= 14;
    }
    const tableResult = drawTable(pdfDoc, page, fonts,
        ['#', 'Time', 'Protocol', 'File / Content', 'Result'],
        tests.map((t, i) => ({
            cells: [String(i + 1), t.time, t.protocol, t.file || (t.content?.substring(0, 30) + '...') || '-', t.result === 'blocked' ? 'BLOCKED' : 'LEAKED'],
            result: t.result === 'blocked' ? 'blocked' as const : 'leaked' as const,
        })),
        [30, 55, 60, 220, 100],
        y
    );
    page = tableResult.page;
    y = tableResult.y;

    // Gaps & Recommendations
    const gaps: string[] = [];
    const recs: string[] = [];
    const leakedProtocols = protocolStats.filter(p => p.passed < p.total).map(p => p.name);
    if (leakedProtocols.includes('HTTP')) {
        gaps.push('HTTP (Port 80) traffic is not being inspected by DLP');
        recs.push('Enable DLP inspection on HTTP (Port 80) egress traffic');
    }
    if (leakedProtocols.includes('FTP')) {
        gaps.push('FTP uploads bypass DLP content scanning');
        recs.push('Add FTP protocol to inline DLP policy');
    }
    if (leakedProtocols.includes('HTTPS')) {
        gaps.push('HTTPS uploads not fully blocked — check SSL decryption policy');
        recs.push('Verify SSL/TLS decryption is enabled for DLP inspection');
    }
    if (leakedProtocols.includes('POST')) {
        gaps.push('Raw POST data exfiltration not detected');
        recs.push('Add content-aware DLP rules for POST body inspection');
    }
    if (leakedProtocols.includes('MCP')) {
        gaps.push('Nested JSON/MCP exfiltration not detected — DLP cannot parse deeply nested JSON payloads');
        recs.push('Enable deep content inspection for JSON payloads and configure DLP to parse nested structures used by AI agents and APIs');
    }
    if (tests.length - blocked === 0) {
        recs.push('All tests blocked successfully — re-test periodically to maintain coverage');
    }

    const gapResult = drawGapsAndRecs(pdfDoc, page, fonts, gaps, recs, y);
    page = gapResult.page;

    drawFooter(page, fonts);
    return pdfDoc.save();
}

export async function generateNGFWReport(
    tests: NGFWTestResult[],
    ipData?: { ip: string; country: string }
): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fonts = { bold, regular };

    let page = addPage(pdfDoc);
    const blocked = tests.filter(t => t.result === 'blocked').length;
    const score = tests.length > 0 ? (blocked / tests.length) * 100 : 0;

    let y = drawHeader(page, fonts, 'NGFW Security Assessment', {
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        ip: ipData?.ip,
        location: ipData?.country,
    });

    drawGauge(page, fonts, score, PAGE_WIDTH / 2, y - 30, 70);
    y -= 120;

    y = drawSummaryBoxes(page, fonts, [
        { label: 'TESTS RUN', value: String(tests.length) },
        { label: 'BLOCKED', value: String(blocked), color: COLORS.green },
        { label: 'PASSED THROUGH', value: String(tests.length - blocked), color: tests.length - blocked > 0 ? COLORS.red : COLORS.green },
        { label: 'SCORE', value: `${Math.round(score)}%`, color: getRating(score).color },
    ], y);

    // Category breakdown
    const categories = ['IPS', 'AET', 'C2C', 'Flood'];
    const catNames: Record<string, string> = { IPS: 'IPS Signatures', AET: 'Evasion Techniques', C2C: 'C2 Beacon', Flood: 'Network IP Flood' };
    const catStats = categories.map(c => {
        const cTests = tests.filter(t => t.category === c);
        return { name: catNames[c] || c, passed: cTests.filter(t => t.result === 'blocked').length, total: cTests.length };
    }).filter(c => c.total > 0);

    if (catStats.length > 0) {
        y = drawSectionHeader(page, fonts, 'Category Breakdown', y);
        y = drawCategoryBars(page, fonts, catStats, y);
    }

    const check = checkPage(pdfDoc, page, y, 60);
    page = check.page; y = check.y;

    y = drawSectionHeader(page, fonts, 'Test Details', y);
    const tableResult = drawTable(pdfDoc, page, fonts,
        ['#', 'Category', 'Test', 'Severity', 'Result'],
        tests.map((t, i) => ({
            cells: [String(i + 1), t.category, t.testName, t.severity, t.result === 'blocked' ? 'BLOCKED' : 'PASSED'],
            result: t.result,
        })),
        [30, 60, 200, 70, 100],
        y
    );
    page = tableResult.page;
    y = tableResult.y;

    const gaps: string[] = [];
    const recs: string[] = [];
    const failedCats = catStats.filter(c => c.passed < c.total);
    failedCats.forEach(c => {
        if (c.name === 'Evasion Techniques') {
            gaps.push('Encoded/obfuscated attack payloads bypass IPS signatures');
            recs.push('Enable deep packet inspection with decode/deobfuscation for hex, double-URL, and Unicode encodings');
        }
        if (c.name === 'IPS Signatures') {
            gaps.push('Basic IPS attack signatures not fully detected');
            recs.push('Update IPS signature database and verify inline inspection mode is enabled');
        }
        if (c.name === 'C2 Beacon') {
            gaps.push('Command & Control beacon traffic not fully blocked');
            recs.push('Add C2 beacon pattern detection and suspicious outbound connection monitoring');
        }
        if (c.name === 'Network IP Flood') {
            gaps.push(`Flood test: ${c.total - c.passed}/${c.total} attack packets passed through under sustained load`);
            recs.push('Review IPS rate-limiting and IP shun policies for sustained attack scenarios');
        }
    });
    if (gaps.length === 0) {
        recs.push('All tests blocked successfully — maintain current IPS policy and re-test after updates');
    }

    const gapResult = drawGapsAndRecs(pdfDoc, page, fonts, gaps, recs, y);
    drawFooter(gapResult.page, fonts);
    return pdfDoc.save();
}

export async function generateMITREReport(
    stages: MITREStageResult[],
    ipData?: { ip: string; country: string }
): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fonts = { bold, regular };

    let page = addPage(pdfDoc);
    const blocked = stages.filter(s => s.result === 'blocked').length;
    const total = stages.filter(s => s.result !== 'pending').length;
    const score = total > 0 ? (blocked / total) * 100 : 0;

    let y = drawHeader(page, fonts, 'MITRE ATT&CK Simulation Report', {
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        ip: ipData?.ip,
        location: ipData?.country,
    });

    drawGauge(page, fonts, score, PAGE_WIDTH / 2, y - 30, 70);
    y -= 120;

    y = drawSummaryBoxes(page, fonts, [
        { label: 'STAGES', value: String(stages.length) },
        { label: 'BLOCKED', value: String(blocked), color: COLORS.green },
        { label: 'PASSED THROUGH', value: String(total - blocked), color: total - blocked > 0 ? COLORS.red : COLORS.green },
        { label: 'SCORE', value: `${Math.round(score)}%`, color: getRating(score).color },
    ], y);

    // Kill Chain Visualization
    y = drawSectionHeader(page, fonts, 'Kill Chain Visualization', y);
    y = drawKillChain(page, fonts, stages, y);

    // Stage details
    const check = checkPage(pdfDoc, page, y, 60);
    page = check.page; y = check.y;

    y = drawSectionHeader(page, fonts, 'Stage Details', y);

    stages.forEach((stage) => {
        if (stage.result === 'pending') return;
        const c2 = checkPage(pdfDoc, page, y, 60);
        page = c2.page; y = c2.y;

        const isBlocked = stage.result === 'blocked';
        page.drawRectangle({
            x: MARGIN, y: y - 45,
            width: CONTENT_WIDTH, height: 45,
            color: isBlocked ? COLORS.lightGreen : COLORS.lightRed,
            borderColor: isBlocked ? COLORS.green : COLORS.red,
            borderWidth: 0.5,
        });

        page.drawText(`Stage ${stage.stage}: ${stage.name}`, {
            x: MARGIN + 10, y: y - 14,
            size: 10, font: fonts.bold, color: COLORS.textMain,
        });
        page.drawText(`${stage.techniqueId} — ${stage.technique}`, {
            x: MARGIN + 10, y: y - 28,
            size: 8, font: fonts.regular, color: COLORS.textMuted,
        });
        page.drawText(isBlocked ? 'BLOCKED' : 'PASSED', {
            x: MARGIN + CONTENT_WIDTH - 70, y: y - 14,
            size: 10, font: fonts.bold, color: isBlocked ? COLORS.green : COLORS.red,
        });
        page.drawText(stage.detail, {
            x: MARGIN + 10, y: y - 40,
            size: 7, font: fonts.regular, color: COLORS.textMuted,
        });
        y -= 55;
    });

    // Risk assessment
    const c3 = checkPage(pdfDoc, page, y, 80);
    page = c3.page; y = c3.y;

    y = drawSectionHeader(page, fonts, 'Risk Assessment', y);
    const firstBlocked = stages.findIndex(s => s.result === 'blocked');
    const passedBeforeBlock = stages.filter(s => s.result === 'passed').length;
    let riskText = '';
    if (blocked === total) {
        riskText = 'All attack stages were blocked. The security controls effectively prevented the entire kill chain from progressing.';
    } else if (firstBlocked === 0) {
        riskText = 'The attack was stopped at the initial stage, limiting potential damage.';
    } else {
        riskText = `The attack progressed through ${passedBeforeBlock} stage(s) before being detected. This gap increases attacker dwell time and potential for lateral movement.`;
    }
    page.drawText(riskText, {
        x: MARGIN, y: y - 4,
        size: 9, font: fonts.regular, color: COLORS.textMain, maxWidth: CONTENT_WIDTH,
    });
    y -= 30;

    // Recommendations
    const recs: string[] = [];
    stages.forEach(s => {
        if (s.result === 'passed') {
            if (s.techniqueId.includes('T1190')) recs.push('Add WAF rules for SQL injection and exploit detection on public-facing endpoints');
            if (s.techniqueId.includes('T1059')) recs.push('Block encoded script execution (PowerShell, cmd) at the gateway or endpoint');
            if (s.techniqueId.includes('T1003')) recs.push('Deploy credential theft detection (Mimikatz patterns, LSASS access monitoring)');
            if (s.techniqueId.includes('T1048')) recs.push('Add DNS exfiltration detection and restrict outbound protocol usage');
        }
    });
    if (recs.length === 0) recs.push('All stages blocked — maintain current security controls and re-test after infrastructure changes');

    const gapResult = drawGapsAndRecs(pdfDoc, page, fonts, [], recs, y);
    drawFooter(gapResult.page, fonts);
    return pdfDoc.save();
}
