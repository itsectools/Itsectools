import { NextResponse } from 'next/server';

// Reuse data generators from download route
const firstNames = ['James', 'Christopher', 'Ronald', 'Mary', 'Lisa', 'Michelle', 'John', 'Daniel', 'Patricia', 'Linda'];
const lastNames = ['Smith', 'Anderson', 'Clark', 'Wright', 'Mitchell', 'Johnson', 'Thomas', 'Rodriguez', 'Lopez', 'Perez'];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function generateLuhnValid(prefix: string, length: number): string {
    let digits = prefix;
    while (digits.length < length - 1) digits += Math.floor(Math.random() * 10).toString();
    const fullNum = digits + '0';
    let sum = 0;
    const parity = fullNum.length % 2;
    for (let i = 0; i < fullNum.length; i++) {
        let n = parseInt(fullNum[i]);
        if (i % 2 === parity) { n *= 2; if (n > 9) n -= 9; }
        sum += n;
    }
    return digits + ((10 - (sum % 10)) % 10).toString();
}

function generateSensitiveData(type: string): string {
    const fname = pick(firstNames);
    const lname = pick(lastNames);

    switch (type) {
        case 'pii': {
            let area = Math.floor(1 + Math.random() * 899);
            if (area === 666) area = 667;
            const ssn = `${String(area).padStart(3, '0')}-${String(Math.floor(1 + Math.random() * 99)).padStart(2, '0')}-${String(Math.floor(1 + Math.random() * 9999)).padStart(4, '0')}`;
            const dl = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000000 + Math.random() * 8999999)}`;
            const passport = `C${Math.floor(10000000 + Math.random() * 89999999)}`;
            return `${fname} ${lname}, SSN: ${ssn}, Driver License: ${dl}, Passport: ${passport}, Email: ${fname.toLowerCase()}.${lname.toLowerCase()}@example.com`;
        }
        case 'pci': {
            const cardNum = generateLuhnValid('4147', 16);
            const formatted = `${cardNum.slice(0, 4)}-${cardNum.slice(4, 8)}-${cardNum.slice(8, 12)}-${cardNum.slice(12)}`;
            const cvv = Math.floor(100 + Math.random() * 900).toString();
            const exp = `${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/${(2025 + Math.floor(Math.random() * 5)).toString().slice(-2)}`;
            return `Cardholder: ${fname} ${lname}, Card: ${formatted}, Exp: ${exp}, CVV: ${cvv}, Zip: ${Math.floor(10000 + Math.random() * 90000)}`;
        }
        case 'phi': {
            let area = Math.floor(1 + Math.random() * 899);
            if (area === 666) area = 667;
            const ssn = `${String(area).padStart(3, '0')}-${String(Math.floor(1 + Math.random() * 99)).padStart(2, '0')}-${String(Math.floor(1 + Math.random() * 9999)).padStart(4, '0')}`;
            const mrn = `MRN-${Math.floor(1000000 + Math.random() * 8999999)}`;
            const diagnoses = ['E11.9 Type 2 diabetes', 'I10 Hypertension', 'J45.909 Asthma', 'F41.1 Generalized anxiety'];
            const meds = ['Metformin 500mg', 'Lisinopril 10mg', 'Albuterol Inhaler', 'Escitalopram 10mg'];
            const idx = Math.floor(Math.random() * diagnoses.length);
            return `Patient: ${fname} ${lname}, SSN: ${ssn}, MRN: ${mrn}, DOB: ${Math.floor(1 + Math.random() * 12)}/${Math.floor(1 + Math.random() * 28)}/19${60 + Math.floor(Math.random() * 40)}, Diagnosis: ${diagnoses[idx]}, Rx: ${meds[idx]}`;
        }
        default:
            return `${fname} ${lname}, SSN: 078-05-1120`;
    }
}

function wrapInMcpJson(content: string, depth: number): object {
    const reqId = `req_${Math.random().toString(36).slice(2, 8)}`;

    if (depth <= 2) {
        return {
            jsonrpc: '2.0',
            id: reqId,
            method: 'tools/call',
            params: {
                name: 'process_user_data',
                arguments: { content }
            }
        };
    }

    if (depth <= 4) {
        return {
            jsonrpc: '2.0',
            id: reqId,
            method: 'tools/call',
            params: {
                name: 'process_user_data',
                arguments: {
                    session: {
                        context: {
                            memory: { content }
                        }
                    }
                }
            }
        };
    }

    // depth 6
    return {
        jsonrpc: '2.0',
        id: reqId,
        method: 'tools/call',
        params: {
            name: 'process_user_data',
            arguments: {
                session: {
                    context: {
                        metadata: {
                            trace: {
                                payload: { content }
                            }
                        }
                    }
                }
            }
        }
    };
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'pii';
    const depth = parseInt(searchParams.get('depth') || '4');

    const sensitiveData = generateSensitiveData(type);
    const mcpPayload = wrapInMcpJson(sensitiveData, depth);

    return NextResponse.json(mcpPayload);
}
