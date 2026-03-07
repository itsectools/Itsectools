import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as xlsx from 'xlsx';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Generate a Luhn-valid credit card number from a BIN prefix
function generateLuhnValid(prefix: string, length: number): string {
    // Fill random digits up to length - 1 (last digit is check digit)
    let digits = prefix;
    while (digits.length < length - 1) {
        digits += Math.floor(Math.random() * 10).toString();
    }

    // Calculate Luhn check digit using placeholder approach:
    // Append '0', compute Luhn sum, then adjust the check digit
    const fullNum = digits + '0';
    let sum = 0;
    const parity = fullNum.length % 2;
    for (let i = 0; i < fullNum.length; i++) {
        let n = parseInt(fullNum[i]);
        if (i % 2 === parity) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
    }
    const checkDigit = (10 - (sum % 10)) % 10;

    return digits + checkDigit.toString();
}

// Format a card number with dashes (4-4-4-4 for 16-digit, 4-6-5 for 15-digit Amex)
function formatCardNumber(num: string): string {
    if (num.length === 15) {
        // Amex format: 4-6-5
        return `${num.slice(0, 4)}-${num.slice(4, 10)}-${num.slice(10)}`;
    }
    // Visa/MC format: 4-4-4-4
    return `${num.slice(0, 4)}-${num.slice(4, 8)}-${num.slice(8, 12)}-${num.slice(12)}`;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'pii';
    const format = searchParams.get('format') || 'csv';

    let filename = '';
    const rows = 100;

    const firstNames = ['James', 'Christopher', 'Ronald', 'Mary', 'Lisa', 'Michelle', 'John', 'Daniel', 'Patricia', 'Linda', 'Barbara', 'Elizabeth', 'Jennifer', 'Maria', 'Susan'];
    const lastNames = ['Smith', 'Anderson', 'Clark', 'Wright', 'Mitchell', 'Johnson', 'Thomas', 'Rodriguez', 'Lopez', 'Perez', 'Williams', 'Jackson', 'Lewis', 'Hill', 'Roberts'];

    let headers: string[] = [];
    let matrix: string[][] = [];

    switch (type) {
        case 'pii':
            filename = `pii_data.${format}`;
            headers = ['Full Name', 'Social Security Number', 'Driver License Number', 'Passport Number', 'Email Address', 'Phone Number', 'Address'];

            // Common realistic US area codes (avoiding 555 exchange later)
            const areaCodes = ['212', '310', '713', '312', '415', '206', '305', '404', '617', '702'];

            for (let i = 1; i <= rows; i++) {
                const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
                const fullName = `${fname} ${lname}`;
                
                // SSN Area: 001-899, excluding 666
                let ssnArea = Math.floor(1 + Math.random() * 899);
                if (ssnArea === 666) ssnArea = 667;
                
                const ssn = `${String(ssnArea).padStart(3, '0')}-${String(Math.floor(1 + Math.random() * 99)).padStart(2, '0')}-${String(Math.floor(1 + Math.random() * 9999)).padStart(4, '0')}`;
                
                // Driver License: various formats like D123-4567-8901 or 1 Letter + 7-9 digits
                const dlPrefix = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
                const dl = `${dlPrefix}${Math.floor(1000000 + Math.random() * 8999999)}`;
                
                // Passport: C + 8 digits or 9 digits
                const isNineDigit = Math.random() > 0.5;
                const passport = isNineDigit 
                    ? `${Math.floor(100000000 + Math.random() * 899999999)}`
                    : `C${Math.floor(10000000 + Math.random() * 89999999)}`;
                    
                const email = `${fname.toLowerCase()}.${lname.toLowerCase()}${i}@example.com`;
                
                // Phone: Realistic area code, random exchange (not 555)
                const ac = areaCodes[Math.floor(Math.random() * areaCodes.length)];
                let prefix = Math.floor(200 + Math.random() * 799);
                if (prefix === 555) prefix = 556;
                const phone = `+1-${ac}-${prefix}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
                
                const address = `${Math.floor(100 + Math.random() * 9999)} Oak Street, Springfield, IL ${Math.floor(60000 + Math.random() * 2000)}`;

                matrix.push([fullName, ssn, dl, passport, email, phone, address]);
            }
            break;

        case 'pci':
            filename = `pci_transactions.${format}`;
            headers = ['Cardholder Name', 'Credit Card Number', 'Expiration Date', 'CVV', 'Billing Zip Code'];
            for (let i = 1; i <= rows; i++) {
                const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
                const cardholderName = `${fname} ${lname}`;
                const zip = Math.floor(10000 + Math.random() * 90000).toString();

                // Randomly pick card type: 60% Visa, 25% Mastercard, 15% Amex
                const roll = Math.random();
                let cardNum: string;
                let cvv: string;

                if (roll < 0.60) {
                    // Visa: starts with 4, 16 digits
                    cardNum = formatCardNumber(generateLuhnValid('4', 16));
                    cvv = Math.floor(100 + Math.random() * 900).toString();
                } else if (roll < 0.85) {
                    // Mastercard: starts with 51-55, 16 digits
                    const mcPrefix = `5${Math.floor(1 + Math.random() * 5)}`;
                    cardNum = formatCardNumber(generateLuhnValid(mcPrefix, 16));
                    cvv = Math.floor(100 + Math.random() * 900).toString();
                } else {
                    // Amex: starts with 34 or 37, 15 digits
                    const amexPrefix = Math.random() < 0.5 ? '34' : '37';
                    cardNum = formatCardNumber(generateLuhnValid(amexPrefix, 15));
                    cvv = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit CVV for Amex
                }

                const expMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
                const expYear = (2025 + Math.floor(Math.random() * 5)).toString().slice(-2);
                matrix.push([cardholderName, cardNum, `${expMonth}/${expYear}`, cvv, zip]);
            }
            break;

        case 'phi':
            filename = `medical_records.${format}`;
            headers = ['Patient Name', 'Social Security Number', 'Date of Birth', 'Age', 'Medical Record Number', 'Health Plan Number', 'Diagnosis Code', 'Diagnosis Description', 'Prescribed Medication'];

            const currentYear = new Date().getFullYear();
            
            // Common ICD-10 Codes and Descriptions
            const diagnoses = [
                { code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications' },
                { code: 'I10', desc: 'Essential (primary) hypertension' },
                { code: 'J45.909', desc: 'Unspecified asthma, uncomplicated' },
                { code: 'F41.1', desc: 'Generalized anxiety disorder' },
                { code: 'E78.5', desc: 'Hyperlipidemia, unspecified' },
                { code: 'K21.9', desc: 'Gastro-esophageal reflux disease without esophagitis' },
                { code: 'E03.9', desc: 'Hypothyroidism, unspecified' }
            ];
            
            // Common Prescription Medications
            const meds = ['Metformin 500mg', 'Lisinopril 10mg', 'Albuterol Inhaler', 'Escitalopram 10mg', 'Atorvastatin 20mg', 'Omeprazole 20mg', 'Levothyroxine 50mcg'];

            for (let i = 1; i <= rows; i++) {
                const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
                const fullName = `${fname} ${lname}`;

                // SSN Area: 001-899, excluding 666
                let ssnArea = Math.floor(1 + Math.random() * 899);
                if (ssnArea === 666) ssnArea = 667;
                const ssn = `${String(ssnArea).padStart(3, '0')}-${String(Math.floor(1 + Math.random() * 99)).padStart(2, '0')}-${String(Math.floor(1 + Math.random() * 9999)).padStart(4, '0')}`;

                const age = Math.floor(1 + Math.random() * 90);
                const birthYear = currentYear - age;
                const birthMonth = Math.floor(1 + Math.random() * 12);
                const dob = `${birthMonth}/${Math.floor(1 + Math.random() * 28)}/${birthYear}`;

                const mrn = `MRN-${Math.floor(1000000 + Math.random() * 8999999)}`;
                const hpn = `HPN-${Math.floor(100000000 + Math.random() * 899999999)}`;
                
                const diagIndex = Math.floor(Math.random() * diagnoses.length);
                const diag = diagnoses[diagIndex];
                const med = meds[diagIndex]; // match med to purely typical diagnosis

                matrix.push([fullName, ssn, dob, age.toString(), mrn, hpn, diag.code, diag.desc, med]);
            }
            break;

        default:
            return new NextResponse('Invalid Type', { status: 400 });
    }

    if (format === 'csv') {
        const content = [headers.join(','), ...matrix.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        return new NextResponse(content, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    }

    if (format === 'xlsx') {
        const worksheet = xlsx.utils.aoa_to_sheet([headers, ...matrix]);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Data');
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    }

    if (format === 'pdf') {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        let page = pdfDoc.addPage([600, 800]);
        let y = page.getHeight() - 50;

        page.drawText(headers.join(' | '), { x: 50, y, size: 10, font });
        y -= 20;

        for (const row of matrix) {
            if (y < 50) {
                page = pdfDoc.addPage([600, 800]);
                y = page.getHeight() - 50;
            }
            page.drawText(row.join(' | '), { x: 50, y, size: 8, font });
            y -= 15;
        }

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(pdfBytes as unknown as BodyInit, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    }

    if (format === 'docx') {
        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: headers.join(' | '), bold: true })]
                    }),
                    ...matrix.map(row => new Paragraph({
                        children: [new TextRun(row.join(' | '))]
                    }))
                ],
            }],
        });

        const buffer = await Packer.toBuffer(doc);

        return new NextResponse(buffer as unknown as BodyInit, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    }

    return new NextResponse('Invalid Format', { status: 400 });
}
