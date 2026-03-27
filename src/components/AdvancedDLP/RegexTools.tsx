import React, { useState } from 'react';
import { SparklesIcon, RefreshIcon, CodeIcon, CopyIcon, CheckCircleIcon, AlertTriangleIcon, FileTextIcon } from '@/components/Icons';

type EngineType = 'pcre' | 're2' | 'java' | 'cloud-native';

type MatchType =
    | 'exact' | 'digit' | 'non_digit' | 'word' | 'non_word'
    | 'whitespace' | 'non_whitespace' | 'wildcard' | 'special'
    | 'letter' | 'uppercase' | 'lowercase'
    | 'at' | 'dot' | 'hyphen' | 'underscore' | 'slash' | 'colon' | 'hash' | 'backslash' | 'space' | 'pipe'
    | 'charset' | 'not_charset' | 'range' | 'except';

type QuantifierType = 'exactly' | 'one_or_more' | 'zero_or_more' | 'zero_or_one' | 'between' | 'at_least';

interface Segment {
    id: string;
    sampleValue: string;
    matchType: MatchType;
    customValue?: string;
    quantifier: QuantifierType;
    quantityX?: number;
    quantityY?: number;
}

const MATCH_TYPES: { id: MatchType, label: string, regex: string }[] = [
    { id: 'digit', label: 'Any digit [0-9]', regex: '\\d' },
    { id: 'non_digit', label: 'Any non-digit [not "0-9"]', regex: '\\D' },
    { id: 'word', label: 'Any word character [a-z, A-Z, 0-9, _]', regex: '\\w' },
    { id: 'non_word', label: 'Any non-word character [not "a-z, A-Z, 0-9, _"]', regex: '\\W' },
    { id: 'whitespace', label: 'Any whitespace [space, tab, newline]', regex: '\\s' },
    { id: 'non_whitespace', label: 'Any non-whitespace [not "space, tab, newline"]', regex: '\\S' },
    { id: 'wildcard', label: 'Any character [wildcard .]', regex: '.' },
    { id: 'special', label: 'Any special character [symbols, punctuation]', regex: '[-._:/]' },
    { id: 'letter', label: 'Any letter [a-z, A-Z]', regex: '[a-zA-Z]' },
    { id: 'uppercase', label: 'Any uppercase letter [A-Z]', regex: '[A-Z]' },
    { id: 'lowercase', label: 'Any lowercase letter [a-z]', regex: '[a-z]' },
    { id: 'at', label: '@ symbol [@]', regex: '@' },
    { id: 'dot', label: 'Dot [.]', regex: '\\.' },
    { id: 'hyphen', label: 'Hyphen [-]', regex: '\\-' },
    { id: 'underscore', label: 'Underscore [_]', regex: '_' },
    { id: 'slash', label: 'Forward slash [/]', regex: '\\/' },
    { id: 'colon', label: 'Colon [:]', regex: ':' },
    { id: 'hash', label: 'Hash / Pound [#]', regex: '#' },
    { id: 'backslash', label: 'Backslash [\\]', regex: '\\\\' },
    { id: 'space', label: 'Space [ ]', regex: ' ' },
    { id: 'pipe', label: 'Pipe [|]', regex: '\\|' },
    { id: 'charset', label: 'Character in set [abc]', regex: 'charset' },
    { id: 'not_charset', label: 'Character NOT in set [not "abc"]', regex: 'not_charset' },
    { id: 'range', label: 'Character in range [a-z]', regex: 'range' },
    { id: 'except', label: 'Any character except [not "x"]', regex: 'except' },
    { id: 'exact', label: 'Exact text ["abc"]', regex: 'exact' }
];

const QUANTIFIERS: { id: QuantifierType, label: string }[] = [
    { id: 'exactly', label: 'Exactly N times' },
    { id: 'one_or_more', label: 'One or more times' },
    { id: 'zero_or_more', label: 'Zero or more times' },
    { id: 'zero_or_one', label: 'Zero or one time' },
    { id: 'between', label: 'Between X and Y times' },
    { id: 'at_least', label: 'At least X times' }
];

interface VendorCapabilities {
    id: string;
    name: string;
    engine: EngineType;
    supportsLookarounds: boolean;
    supportsBackreferences: boolean;
    supportsAnchors: boolean;
    supportsBoundary: boolean;
    supportsCaseFlag: boolean;
    supportsGroups: boolean;
    implicitBoundaries: boolean;
    quantifierLimit?: number;
    maxCharLength?: number;
    notes: string;
}

const VENDORS: VendorCapabilities[] = [
    { id: 'forcepoint_dlp', name: 'Forcepoint DLP', engine: 'pcre', supportsLookarounds: true, supportsBackreferences: true, supportsAnchors: true, supportsBoundary: true, supportsCaseFlag: true, supportsGroups: true, implicitBoundaries: false, quantifierLimit: 500, notes: "Forcepoint DLP uses PCRE. Unbounded quantifiers (+, *, {X,}) must be bounded (e.g., {1,500}). POSIX classes like [[:punct:]] can be unreliable — use explicit character classes instead. Use Forcepoint's built-in classifiers when possible for checksum validation." },
    { id: 'forcepoint_dspm', name: 'Forcepoint DSPM', engine: 'cloud-native', supportsLookarounds: false, supportsBackreferences: false, supportsAnchors: true, supportsBoundary: false, supportsCaseFlag: false, supportsGroups: true, implicitBoundaries: false, notes: 'Cloud-native engine. No lookarounds, no \\b word boundaries, no (?i) case flag. Simplified regex only.' },
    { id: 'symantec', name: 'Symantec DLP', engine: 'java', supportsLookarounds: true, supportsBackreferences: true, supportsAnchors: true, supportsBoundary: false, supportsCaseFlag: false, supportsGroups: true, implicitBoundaries: false, notes: 'Java (server) / Boost (endpoint) engines. \\b word boundary is NOT supported — use (?:^|\\s) and (?:\\s|$) instead. (?i) flag not supported on endpoints — spell out case explicitly e.g. [aA].' },
    { id: 'palo_alto', name: 'Palo Alto Networks', engine: 're2', supportsLookarounds: false, supportsBackreferences: false, supportsAnchors: true, supportsBoundary: true, supportsCaseFlag: true, supportsGroups: true, implicitBoundaries: false, notes: 'RE2 engine. No POSIX classes, no lookarounds, no backreferences. Supports (?i) for case-insensitive matching. Use \\b for word boundaries.' },
    { id: 'zscaler', name: 'Zscaler', engine: 're2', supportsLookarounds: false, supportsBackreferences: false, supportsAnchors: false, supportsBoundary: true, supportsCaseFlag: false, supportsGroups: false, implicitBoundaries: false, quantifierLimit: 100, notes: 'No ^ or $ anchors. No capture groups () — use flat expressions only. Quantifiers capped at {0,100}. Regex must start with a "base token" (literal characters). No nested repeats.' },
    { id: 'netskope', name: 'Netskope', engine: 're2', supportsLookarounds: false, supportsBackreferences: false, supportsAnchors: false, supportsBoundary: false, supportsCaseFlag: false, supportsGroups: true, implicitBoundaries: true, maxCharLength: 256, notes: 'Implicit word boundaries (no \\b needed). No ^ or $ anchors. No (? syntax. Recommends [0-9] over \\d. Max 256 characters. DLP engine interprets regex differently from standard UNIX.' },
    { id: 'trellix', name: 'Trellix DLP', engine: 're2', supportsLookarounds: false, supportsBackreferences: false, supportsAnchors: true, supportsBoundary: true, supportsCaseFlag: false, supportsGroups: true, implicitBoundaries: false, notes: 'Google RE2 engine. No lookarounds, no backreferences, no possessive quantifiers. Case-insensitive by default on endpoint (configurable from v11.10+). Use non-capturing groups (?:...) only.' },
    { id: 'fortinet', name: 'Fortinet', engine: 'pcre', supportsLookarounds: true, supportsBackreferences: true, supportsAnchors: true, supportsBoundary: true, supportsCaseFlag: true, supportsGroups: true, implicitBoundaries: false, maxCharLength: 255, notes: 'PCRE variation. Max 255 characters. Supports lookarounds and \\b. Watch for compilation time restrictions on overlapping groups. Test accented characters separately.' },
    { id: 'microsoft', name: 'Microsoft Purview', engine: 're2', supportsLookarounds: false, supportsBackreferences: false, supportsAnchors: true, supportsBoundary: true, supportsCaseFlag: false, supportsGroups: true, implicitBoundaries: false, quantifierLimit: 9, maxCharLength: 1024, notes: 'Boost 5.1.3 engine. Quantifiers +, * and {n,} are NOT allowed — use {n,m} with n,m < 10. All groups must be non-capturing (?:...). Always case-insensitive (no (?i) needed). No backreferences. Max 1024 characters.' },
    { id: 'proofpoint', name: 'Proofpoint', engine: 'pcre', supportsLookarounds: true, supportsBackreferences: true, supportsAnchors: true, supportsBoundary: true, supportsCaseFlag: true, supportsGroups: true, implicitBoundaries: false, notes: 'Standard PCRE engine with full feature support. Supports (?i), \\b, lookarounds, and backreferences.' }
];

export default function RegexTools() {
    const [mode, setMode] = useState<'create' | 'translate'>('create');

    // Creator State
    const [sampleData, setSampleData] = useState('MRN:1234567');
    const [creatorVendor, setCreatorVendor] = useState('forcepoint_dlp');
    const [caseInsensitive, setCaseInsensitive] = useState(false);
    const [segments, setSegments] = useState<Segment[]>([]);
    const [generatedPattern, setGeneratedPattern] = useState<string | null>(null);
    const [explanation, setExplanation] = useState<string | null>(null);

    // Translator State
    const [translatePattern, setTranslatePattern] = useState('\\b4\\d{3}(?:[- ]?\\d{4}){3}\\b');
    const [translateVendor, setTranslateVendor] = useState('forcepoint_dlp');
    const [testString, setTestString] = useState('');
    const [translatedResult, setTranslatedResult] = useState<{ regex: string, warnings: string[], isValid: boolean, isMatch: boolean | null, matches?: string[], diagnosis?: string } | null>(null);

    // Copy State
    const [copiedCreator, setCopiedCreator] = useState(false);
    const [copiedTranslator, setCopiedTranslator] = useState(false);

    const handleCopy = (text: string, source: 'creator' | 'translator') => {
        navigator.clipboard.writeText(text);
        if (source === 'creator') {
            setCopiedCreator(true);
            setTimeout(() => setCopiedCreator(false), 2000);
        } else {
            setCopiedTranslator(true);
            setTimeout(() => setCopiedTranslator(false), 2000);
        }
    };

    const translateRegex = (base: string, vendorId: string) => {
        const vendor = VENDORS.find(v => v.id === vendorId)!;
        let modified = base;
        let warnings: string[] = [];

        // 1. Lookaround removal
        if (!vendor.supportsLookarounds) {
            if (modified.includes('(?=') || modified.includes('(?!') || modified.includes('(?<=') || modified.includes('(?<!')) {
                modified = modified.replace(/\(\?[=!].*?\)/g, '');
                modified = modified.replace(/\(\?<[=!].*?\)/g, '');
                warnings.push(`Lookarounds removed — not supported by ${vendor.name} (${vendor.engine} engine).`);
            }
        }

        // 2. Backreference removal for RE2 / restricted engines
        if (!vendor.supportsBackreferences) {
            if (/\\\d/.test(modified) || /\\k</.test(modified)) {
                modified = modified.replace(/\\\d+/g, (m) => {
                    // Only strip if it looks like a backreference (\1, \2), not \d
                    if (m === '\\d' || m === '\\D') return m;
                    return '';
                });
                modified = modified.replace(/\\k<[^>]+>/g, '');
                warnings.push(`Backreferences removed — not supported by ${vendor.name}.`);
            }
        }

        // 3. Anchor handling — strip ^/$ for engines that don't support them
        if (!vendor.supportsAnchors) {
            if (modified.startsWith('^')) modified = modified.slice(1);
            if (modified.endsWith('$')) modified = modified.slice(0, -1);
            warnings.push('Anchors (^/$) removed — not supported by this engine.');
        }

        // 4. Word boundary handling
        if (!vendor.supportsBoundary) {
            if (modified.includes('\\b')) {
                if (vendor.id === 'symantec') {
                    let first = true;
                    modified = modified.replace(/\\b/g, () => {
                        if (first) { first = false; return '(?:^|\\s)'; }
                        return '(?:\\s|$)';
                    });
                    warnings.push('\\b replaced with (?:^|\\s) / (?:\\s|$) — word boundaries not supported by Symantec DLP.');
                } else if (vendor.implicitBoundaries) {
                    modified = modified.replace(/\\b/g, '');
                    warnings.push('\\b removed — this engine applies implicit word boundaries automatically.');
                } else {
                    modified = modified.replace(/\\b/g, '');
                    warnings.push(`\\b removed — word boundaries not supported by ${vendor.name}.`);
                }
            }
        }

        // 5. Non-capturing group handling
        if (!vendor.supportsGroups) {
            modified = modified.replace(/\(\?:([^)]+)\)/g, '$1');
            warnings.push('Non-capturing groups (?:...) flattened — groups not supported by this engine.');
        }

        // 6. Microsoft Purview: strict quantifier rules
        if (vendor.id === 'microsoft') {
            // Convert + to {1,9}
            if (/([^\\])\+/.test(modified) || modified.startsWith('+')) {
                modified = modified.replace(/([^\\])\+/g, '$1{1,9}');
                modified = modified.replace(/^\+/, '{1,9}');
                warnings.push('Unbounded + replaced with {1,9} — Purview requires explicit {n,m} quantifiers with max value < 10.');
            }
            // Convert * to {0,9}
            if (/([^\\])\*/.test(modified) || modified.startsWith('*')) {
                modified = modified.replace(/([^\\])\*/g, '$1{0,9}');
                modified = modified.replace(/^\*/, '{0,9}');
                warnings.push('Unbounded * replaced with {0,9} — Purview requires explicit {n,m} quantifiers with max value < 10.');
            }
            // Cap {N,} to {N,9}
            modified = modified.replace(/\{(\d+),\}/g, '{$1,9}');
            // Cap any {N,M} where M >= 10 to {N,9}
            modified = modified.replace(/\{(\d+),(\d+)\}/g, (m, a, b) => {
                const max = parseInt(b);
                if (max >= 10) {
                    warnings.push(`Quantifier {${a},${b}} exceeds Purview limit of 9. Truncated to {${a},9}.`);
                    return `{${a},9}`;
                }
                return m;
            });
            // Convert capturing groups to non-capturing
            if (/\((?!\?)/.test(modified)) {
                modified = modified.replace(/\((?!\?)/g, '(?:');
                warnings.push('Capturing groups (…) converted to non-capturing (?:…) — Purview requires all groups to be non-capturing.');
            }
            // Always case-insensitive, remove any (?i) flag
            if (modified.includes('(?i)')) {
                modified = modified.replace(/\(\?i\)/g, '');
            }
            warnings.push('Purview is always case-insensitive — no (?i) flag needed.');
        }

        // 7. Forcepoint DLP: bounded quantifiers
        if (vendor.id === 'forcepoint_dlp') {
            const limit = vendor.quantifierLimit || 500;
            if (/([^\\])\+/.test(modified) || modified.startsWith('+')) {
                modified = modified.replace(/([^\\])\+/g, `$1{1,${limit}}`);
                modified = modified.replace(/^\+/, `{1,${limit}}`);
                warnings.push(`Unbounded + replaced with {1,${limit}} — Forcepoint requires bounded quantifiers.`);
            }
            if (/([^\\])\*/.test(modified) || modified.startsWith('*')) {
                modified = modified.replace(/([^\\])\*/g, `$1{0,${limit}}`);
                modified = modified.replace(/^\*/, `{0,${limit}}`);
                warnings.push(`Unbounded * replaced with {0,${limit}} — Forcepoint requires bounded quantifiers.`);
            }
            modified = modified.replace(/\{(\d+),\}/g, `{$1,${limit}}`);
        }

        // 8. Trellix DLP: RE2 engine specifics
        if (vendor.id === 'trellix') {
            // Convert capturing groups to non-capturing
            if (/\((?!\?)/.test(modified)) {
                modified = modified.replace(/\((?!\?)/g, '(?:');
                warnings.push('Capturing groups converted to non-capturing (?:…) — Trellix RE2 engine recommends non-capturing groups.');
            }
            // Remove possessive quantifiers (++, *+, ?+)
            if (/[+*?]\+/.test(modified)) {
                modified = modified.replace(/([+*?])\+/g, '$1');
                warnings.push('Possessive quantifiers removed — not supported by RE2 engine.');
            }
            // Remove atomic groups (?>...)
            if (modified.includes('(?>')) {
                modified = modified.replace(/\(\?>/g, '(?:');
                warnings.push('Atomic groups (?>…) converted to non-capturing groups — not supported by RE2.');
            }
        }

        // 9. Fortinet: PCRE variation with char limit
        if (vendor.id === 'fortinet') {
            // Convert POSIX classes to explicit ranges
            if (modified.includes('[[:')) {
                modified = modified.replace(/\[\[:punct:\]\]/g, '[-._:/@#$%^&*()!]');
                modified = modified.replace(/\[\[:alpha:\]\]/g, '[a-zA-Z]');
                modified = modified.replace(/\[\[:alnum:\]\]/g, '[a-zA-Z0-9]');
                modified = modified.replace(/\[\[:digit:\]\]/g, '\\d');
                modified = modified.replace(/\[\[:space:\]\]/g, '\\s');
                warnings.push('POSIX classes expanded to explicit ranges for Fortinet compatibility.');
            }
        }

        // 10. General quantifier cap (for vendors with quantifierLimit, excluding Microsoft which was already handled)
        if (vendor.quantifierLimit && vendor.id !== 'microsoft') {
            const limit = vendor.quantifierLimit;
            const regexQuant = /\{(\d+),(\d+)\}/g;
            let match;
            while ((match = regexQuant.exec(modified)) !== null) {
                if (parseInt(match[2]) > limit) {
                    modified = modified.replace(match[0], `{${match[1]},${limit}}`);
                    warnings.push(`Quantifier {${match[1]},${match[2]}} exceeded limit of ${limit}. Truncated.`);
                }
            }
        }

        // 11. Netskope: prefer explicit ranges over shorthand
        if (vendor.id === 'netskope') {
            modified = modified.replace(/\\d/g, '[0-9]');
            modified = modified.replace(/\\D/g, '[^0-9]');
            modified = modified.replace(/\\w/g, '[A-Za-z0-9_]');
            modified = modified.replace(/\\W/g, '[^A-Za-z0-9_]');
            modified = modified.replace(/\\s/g, '[ \\t]');
            warnings.push('Shorthand classes (\\d, \\w, \\s) expanded to explicit ranges for Netskope compatibility.');
        }

        // 12. Forcepoint DLP: expand POSIX classes (unreliable)
        if (vendor.id === 'forcepoint_dlp') {
            if (modified.includes('[[:')) {
                modified = modified.replace(/\[\[:punct:\]\]/g, '[-._:/@#$%^&*()!]');
                modified = modified.replace(/\[\[:alpha:\]\]/g, '[a-zA-Z]');
                modified = modified.replace(/\[\[:alnum:\]\]/g, '[a-zA-Z0-9]');
                modified = modified.replace(/\[\[:digit:\]\]/g, '\\d');
                modified = modified.replace(/\[\[:space:\]\]/g, '\\s');
                warnings.push('POSIX classes expanded — these can be unreliable in Forcepoint DLP.');
            }
        }

        // 13. Case flag handling
        if (!vendor.supportsCaseFlag && vendor.id !== 'microsoft') {
            if (modified.includes('(?i)')) {
                modified = modified.replace(/\(\?i\)/g, '');
                warnings.push(`(?i) case-insensitive flag removed — not supported by ${vendor.name}. Use explicit [aA] notation instead.`);
            }
        }

        // 14. Max character length warning
        if (vendor.maxCharLength && modified.length > vendor.maxCharLength) {
            warnings.push(`⚠️ Pattern is ${modified.length} characters — exceeds ${vendor.name}'s ${vendor.maxCharLength}-character limit. Consider simplifying.`);
        }

        // 15. Add vendor engine info note
        warnings.push(`Engine: ${vendor.engine.toUpperCase()}${vendor.notes ? ' — ' + vendor.notes : ''}`);

        // 16. Basic verification via browser JS engine
        let isValid = true;
        try {
            let testPattern = modified.replace(/\\b/g, '');
            new RegExp(testPattern);
        } catch (e) {
            isValid = false;
            warnings.push('Warning: Pattern may contain syntax not parseable by JavaScript. It may still be valid for the target vendor engine.');
        }

        return { regex: modified, warnings, isValid };
    };

    const handleAnalyzeSample = () => {
        if (!sampleData) return;
        const newSegments: Segment[] = [];
        const tokens = sampleData.match(/[A-Za-z]+|[0-9]+|\s+|[^\w\s]+/g) || [];

        tokens.forEach((t, i) => {
            let matchType: MatchType = 'exact';
            let customValue = t;
            let quantifier: QuantifierType = 'exactly';
            let quantityX = 1;

            if (/^[0-9]+$/.test(t)) {
                matchType = 'digit';
                quantityX = t.length;
                customValue = '';
            } else if (/^[A-Za-z]+$/.test(t)) {
                matchType = 'exact';
                customValue = t;
            } else if (/^\s+$/.test(t)) {
                matchType = 'whitespace';
                quantityX = t.length;
                customValue = '';
            } else {
                if (t.length === 1) {
                    if (t === '@') matchType = 'at';
                    else if (t === '.') matchType = 'dot';
                    else if (t === '-') matchType = 'hyphen';
                    else if (t === '_') matchType = 'underscore';
                    else if (t === '/') matchType = 'slash';
                    else matchType = 'special';
                } else {
                    matchType = 'special';
                    quantityX = t.length;
                    customValue = '';
                }
            }
            newSegments.push({
                id: `seg-${Date.now()}-${i}`,
                sampleValue: t,
                matchType,
                customValue,
                quantifier,
                quantityX
            });
        });
        setSegments(newSegments);
    };

    const handleManualBreakdown = () => {
        setSegments([...segments, {
            id: `seg-${Date.now()}`,
            sampleValue: '',
            matchType: 'exact',
            customValue: '',
            quantifier: 'exactly',
            quantityX: 1
        }]);
    };

    const updateSegment = (id: string, updates: Partial<Segment>) => {
        setSegments(segments.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const removeSegment = (id: string) => {
        setSegments(segments.filter(s => s.id !== id));
    };

    const generateRegexFromSegments = () => {
        if (segments.length === 0) return;
        let basePattern = '';
        let explText = 'The regex matches exactly step-by-step: ';

        segments.forEach((seg, index) => {
            const mt = MATCH_TYPES.find(m => m.id === seg.matchType);
            let partRegex = '';
            let partExpl = '';

            if (seg.matchType === 'exact') {
                partRegex = seg.customValue ? `(?:${seg.customValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})` : '';
                partExpl = `the literal text '${seg.customValue}'`;
            } else if (seg.matchType === 'charset') {
                partRegex = `[${seg.customValue}]`;
                partExpl = `any character in set '${seg.customValue}'`;
            } else if (seg.matchType === 'not_charset' || seg.matchType === 'except') {
                partRegex = `[^${seg.customValue}]`;
                partExpl = `any character NOT in set '${seg.customValue}'`;
            } else if (seg.matchType === 'range') {
                partRegex = `[${seg.customValue}]`;
                partExpl = `a character in the range '${seg.customValue}'`;
            } else {
                partRegex = mt?.regex || '';
                partExpl = mt?.label?.split('[')[0].toLowerCase().trim() || 'something';
            }

            let quantRegex = '';
            let quantExpl = '';
            if (seg.quantifier === 'exactly') {
                if (seg.quantityX && seg.quantityX !== 1) {
                    quantRegex = `{${seg.quantityX}}`;
                    quantExpl = `exactly ${seg.quantityX} times`;
                }
            } else if (seg.quantifier === 'one_or_more') {
                quantRegex = '+';
                quantExpl = 'one or more times';
            } else if (seg.quantifier === 'zero_or_more') {
                quantRegex = '*';
                quantExpl = 'zero or more times';
            } else if (seg.quantifier === 'zero_or_one') {
                quantRegex = '?';
                quantExpl = 'optional (zero or one time)';
            } else if (seg.quantifier === 'between') {
                quantRegex = `{${seg.quantityX || 0},${seg.quantityY || ''}}`;
                quantExpl = `between ${seg.quantityX} and ${seg.quantityY} times`;
            } else if (seg.quantifier === 'at_least') {
                quantRegex = `{${seg.quantityX || 0},}`;
                quantExpl = `at least ${seg.quantityX} times`;
            }

            basePattern += partRegex + quantRegex;
            explText += `${index > 0 ? ', then ' : ''}${partExpl} ${quantExpl}`;
        });

        explText += '.';
        basePattern = '\\b' + basePattern + '\\b';
        explText += ' Word boundaries (\\b) ensure the pattern matches as a distinct token within any text body — ideal for DLP scanning.';

        // Add case-insensitive flag if enabled
        if (caseInsensitive) {
            basePattern = '(?i)' + basePattern;
            explText += ' The pattern is case-insensitive — uppercase and lowercase letters are treated the same.';
        }

        const translated = translateRegex(basePattern, creatorVendor);
        setGeneratedPattern(translated.regex);
        setExplanation(explText + (translated.warnings.length > 0 ? " Note: " + translated.warnings.join(' ') : ''));

        // Sync to translator side
        setTranslatePattern(translated.regex);
    };

    const explainRegex = (pattern: string): string[] => {
        const explanations: string[] = [];
        let i = 0;
        const p = pattern;
        while (i < p.length) {
            if (p[i] === '^') { explanations.push('The text must start from the very beginning of the line'); i++; }
            else if (p[i] === '$') { explanations.push('The text must end at the very end of the line'); i++; }
            else if (p.startsWith('\\b', i)) { explanations.push('Must appear at the start or end of a word (not glued to other text)'); i += 2; }
            else if (p.startsWith('\\d', i)) {
                i += 2;
                const q = extractQuantifier(p, i);
                explanations.push(`Look for any number (0-9)${q.plain}`);
                i += q.len;
            }
            else if (p.startsWith('\\D', i)) { explanations.push('Look for any character that is NOT a number'); i += 2; }
            else if (p.startsWith('\\w', i)) {
                i += 2;
                const q = extractQuantifier(p, i);
                explanations.push(`Look for any letter, number, or underscore${q.plain}`);
                i += q.len;
            }
            else if (p.startsWith('\\W', i)) { explanations.push('Look for any character that is NOT a letter, number, or underscore'); i += 2; }
            else if (p.startsWith('\\s', i)) { explanations.push('Look for a space, tab, or line break'); i += 2; }
            else if (p.startsWith('\\S', i)) { explanations.push('Look for any visible character (not a space)'); i += 2; }
            else if (p.startsWith('\\.', i)) { explanations.push('Look for a literal dot "."'); i += 2; }
            else if (p.startsWith('\\-', i)) { explanations.push('Look for a dash "-"'); i += 2; }
            else if (p.startsWith('\\/', i)) { explanations.push('Look for a forward slash "/"'); i += 2; }
            else if (p.startsWith('(?:^|\\s)', i)) {
                explanations.push('Must appear at the start of the text, or right after a space');
                i += 9;
            }
            else if (p.startsWith('(?:\\s|$)', i)) {
                explanations.push('Must be followed by a space, or appear at the very end of the text');
                i += 9;
            }
            else if (p.startsWith('(?:', i)) {
                const end = p.indexOf(')', i);
                if (end !== -1) {
                    const inner = p.substring(i + 3, end);
                    i = end + 1;
                    const q = extractQuantifier(p, i);
                    if (inner.includes('|')) {
                        const options = inner.split('|').map(s => `"${s}"`).join(' or ');
                        explanations.push(`Look for either ${options}${q.plain}`);
                    } else {
                        explanations.push(`Look for the exact text "${inner}"${q.plain}`);
                    }
                    i += q.len;
                } else { i++; }
            }
            else if (p[i] === '[') {
                const end = p.indexOf(']', i);
                if (end !== -1) {
                    const charClass = p.substring(i + 1, end);
                    i = end + 1;
                    const q = extractQuantifier(p, i);
                    const isNeg = charClass[0] === '^';
                    const chars = isNeg ? charClass.slice(1) : charClass;

                    // Build a friendly description of the character set
                    let friendly = '';
                    if (chars === '0-9') friendly = 'any number (0-9)';
                    else if (chars === 'a-zA-Z') friendly = 'any letter (a-z, A-Z)';
                    else if (chars === 'a-zA-Z0-9') friendly = 'any letter or number';
                    else if (chars === 'A-Za-z0-9_') friendly = 'any letter, number, or underscore';
                    else if (chars === '^0-9') friendly = 'any character that is NOT a number';
                    else if (chars === '^A-Za-z0-9_') friendly = 'any character that is NOT a letter/number/underscore';
                    else if (chars === ' \\t') friendly = 'a space or tab';
                    else {
                        const readableChars = chars.replace(/-/g, ' dash ').replace(/_/g, ' underscore ').replace(/\./g, ' dot ').replace(/:/g, ' colon ').replace(/\//g, ' slash ').replace(/@/g, ' at-sign ').trim();
                        friendly = `one of these characters: ${readableChars}`;
                    }

                    if (isNeg) {
                        explanations.push(`Look for any character that is NOT: ${friendly}${q.plain}`);
                    } else {
                        explanations.push(`Look for ${friendly}${q.plain}`);
                    }
                    i += q.len;
                } else { i++; }
            }
            else if (p[i] === '.') {
                i++;
                const q = extractQuantifier(p, i);
                explanations.push(`Look for any single character${q.plain}`);
                i += q.len;
            }
            else if (p[i] === '\\' && i + 1 < p.length) {
                explanations.push(`Look for the character "${p[i + 1]}"`);
                i += 2;
            }
            else {
                let literal = '';
                while (i < p.length && /[A-Za-z0-9_]/.test(p[i]) && !p.startsWith('\\', i)) {
                    literal += p[i]; i++;
                }
                if (literal) {
                    explanations.push(`Look for the exact text "${literal}"`);
                } else {
                    explanations.push(`Look for the character "${p[i]}"`);
                    i++;
                }
            }
        }
        return explanations;
    };

    const extractQuantifier = (p: string, i: number): { plain: string, len: number } => {
        if (i >= p.length) return { plain: '', len: 0 };
        if (p[i] === '{') {
            const end = p.indexOf('}', i);
            if (end !== -1) {
                const inner = p.substring(i + 1, end);
                let plain = '';
                if (inner.includes(',')) {
                    const [a, b] = inner.split(',');
                    if (b === '') plain = `, repeated at least ${a} times`;
                    else if (a === '0' && b === '1') plain = ' (optional — may or may not appear)';
                    else plain = `, repeated between ${a} and ${b} times`;
                } else {
                    if (inner === '1') plain = '';
                    else plain = `, repeated exactly ${inner} times`;
                }
                return { plain, len: end - i + 1 };
            }
        } else if (p[i] === '+') return { plain: ', repeated one or more times', len: 1 };
        else if (p[i] === '*') return { plain: ' (optional — can appear zero or more times)', len: 1 };
        else if (p[i] === '?') return { plain: ' (optional — may or may not appear)', len: 1 };
        return { plain: '', len: 0 };
    };

    const diagnoseFailure = (pattern: string, input: string): string => {
        // Tokenize the pattern into segments and try to match progressively
        const tokens: { regex: string, desc: string }[] = [];
        let i = 0;
        const p = pattern;

        // Strip anchors for progressive matching
        let workPattern = p;
        if (workPattern.startsWith('^')) workPattern = workPattern.slice(1);
        if (workPattern.endsWith('$')) workPattern = workPattern.slice(0, -1);

        // Strip \b boundaries
        workPattern = workPattern.replace(/\\b/g, '');

        // Strip (?i)
        workPattern = workPattern.replace(/\(\?i\)/g, '');

        // Build tokens from the cleaned pattern
        let ti = 0;
        while (ti < workPattern.length) {
            const wp = workPattern;
            if (wp.startsWith('\\d', ti)) {
                ti += 2;
                const q = extractTokenQuant(wp, ti);
                tokens.push({ regex: `\\d${q.raw}`, desc: `a number (0-9)${q.plain}` });
                ti += q.len;
            } else if (wp.startsWith('\\D', ti)) {
                ti += 2;
                const q = extractTokenQuant(wp, ti);
                tokens.push({ regex: `\\D${q.raw}`, desc: `a non-digit${q.plain}` });
                ti += q.len;
            } else if (wp.startsWith('\\w', ti)) {
                ti += 2;
                const q = extractTokenQuant(wp, ti);
                tokens.push({ regex: `\\w${q.raw}`, desc: `a letter/number/underscore${q.plain}` });
                ti += q.len;
            } else if (wp.startsWith('\\s', ti)) {
                ti += 2;
                tokens.push({ regex: '\\s', desc: 'a whitespace' });
            } else if (wp.startsWith('\\.', ti)) {
                ti += 2;
                tokens.push({ regex: '\\.', desc: 'a dot' });
            } else if (wp.startsWith('\\-', ti)) {
                ti += 2;
                tokens.push({ regex: '\\-', desc: 'a dash' });
            } else if (wp.startsWith('\\/', ti)) {
                ti += 2;
                tokens.push({ regex: '\\/', desc: 'a forward slash' });
            } else if (wp.startsWith('\\|', ti)) {
                ti += 2;
                tokens.push({ regex: '\\|', desc: 'a pipe character' });
            } else if (wp[ti] === '\\' && ti + 1 < wp.length) {
                tokens.push({ regex: `\\${wp[ti + 1]}`, desc: `the character "${wp[ti + 1]}"` });
                ti += 2;
            } else if (wp.startsWith('(?:', ti)) {
                const end = wp.indexOf(')', ti);
                if (end !== -1) {
                    const inner = wp.substring(ti + 3, end);
                    ti = end + 1;
                    const q = extractTokenQuant(wp, ti);
                    tokens.push({ regex: `(?:${inner})${q.raw}`, desc: `the text "${inner}"${q.plain}` });
                    ti += q.len;
                } else { ti++; }
            } else if (wp[ti] === '[') {
                const end = wp.indexOf(']', ti);
                if (end !== -1) {
                    const cls = wp.substring(ti, end + 1);
                    ti = end + 1;
                    const q = extractTokenQuant(wp, ti);
                    const isNeg = cls[1] === '^';
                    const chars = isNeg ? cls.slice(2, -1) : cls.slice(1, -1);
                    tokens.push({ regex: `${cls}${q.raw}`, desc: `${isNeg ? 'a character NOT in' : 'one of'} [${chars}]${q.plain}` });
                    ti += q.len;
                } else { ti++; }
            } else if (wp[ti] === '.') {
                ti++;
                const q = extractTokenQuant(wp, ti);
                tokens.push({ regex: `.${q.raw}`, desc: `any character${q.plain}` });
                ti += q.len;
            } else {
                let literal = '';
                while (ti < wp.length && /[A-Za-z0-9_]/.test(wp[ti]) && !wp.startsWith('\\', ti) && wp[ti] !== '[' && wp[ti] !== '(' && wp[ti] !== '.') {
                    literal += wp[ti]; ti++;
                }
                if (literal) {
                    tokens.push({ regex: literal, desc: `the text "${literal}"` });
                } else {
                    tokens.push({ regex: wp[ti].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), desc: `the character "${wp[ti]}"` });
                    ti++;
                }
            }
        }

        // Now progressively match tokens against input
        let progressivePattern = '';
        for (let t = 0; t < tokens.length; t++) {
            progressivePattern += tokens[t].regex;
            try {
                const flags = caseInsensitive ? 'i' : '';
                const testR = new RegExp(progressivePattern, flags);
                if (!testR.test(input)) {
                    // This token is where it breaks
                    if (t === 0) {
                        return `The input doesn't start with ${tokens[t].desc}. Your text begins with "${input.slice(0, 3)}..." but the pattern expects ${tokens[t].desc} first.`;
                    }
                    // Find how far the previous partial matched
                    const prevPattern = tokens.slice(0, t).map(tk => tk.regex).join('');
                    const prevR = new RegExp(prevPattern, flags);
                    const prevMatch = input.match(prevR);
                    const matchedSoFar = prevMatch ? prevMatch[0] : '';
                    const remaining = input.slice(matchedSoFar.length);
                    const nextChar = remaining ? `"${remaining.slice(0, 5)}${remaining.length > 5 ? '...' : ''}"` : 'nothing (end of text)';

                    return `After matching "${matchedSoFar}", the pattern expects ${tokens[t].desc} at position ${matchedSoFar.length + 1}, but found ${nextChar} instead.`;
                }
            } catch {
                continue;
            }
        }

        // If all tokens matched individually but full regex didn't, it's likely trailing data
        if (p.endsWith('$') || p.endsWith('\\b')) {
            try {
                const fullClean = workPattern;
                const flags = caseInsensitive ? 'i' : '';
                const fullR = new RegExp(`^${fullClean}`, flags);
                const m = input.match(fullR);
                if (m && m[0].length < input.length) {
                    const extra = input.slice(m[0].length);
                    return `The pattern matched "${m[0]}" but there is extra text "${extra}" at the end. The regex expects the string to end after ${tokens[tokens.length - 1].desc}.`;
                }
            } catch { /* ignore */ }
        }

        return 'The input structure does not match the expected pattern. Compare your input against the expected steps below.';
    };

    const extractTokenQuant = (p: string, i: number): { raw: string, plain: string, len: number } => {
        if (i >= p.length) return { raw: '', plain: '', len: 0 };
        if (p[i] === '{') {
            const end = p.indexOf('}', i);
            if (end !== -1) {
                const raw = p.substring(i, end + 1);
                const inner = p.substring(i + 1, end);
                let plain = '';
                if (inner.includes(',')) {
                    const [a, b] = inner.split(',');
                    if (b === '') plain = ` (at least ${a} times)`;
                    else plain = ` (${a}-${b} times)`;
                } else {
                    plain = inner === '1' ? '' : ` (exactly ${inner} times)`;
                }
                return { raw, plain, len: end - i + 1 };
            }
        } else if (p[i] === '+') return { raw: '+', plain: ' (one or more)', len: 1 };
        else if (p[i] === '*') return { raw: '*', plain: ' (zero or more)', len: 1 };
        else if (p[i] === '?') return { raw: '?', plain: ' (optional)', len: 1 };
        return { raw: '', plain: '', len: 0 };
    };

    const handleTranslateAndTest = () => {
        const { regex, warnings, isValid } = translateRegex(translatePattern, translateVendor);

        let isMatch: boolean | null = null;
        let matches: string[] = [];
        if (testString && isValid) {
            try {
                let flag = 'g';
                let testRegex = regex;
                if (testRegex.startsWith('(?i)')) {
                    flag += 'i';
                    testRegex = testRegex.replace('(?i)', '');
                }
                // Apply case-insensitive from toggle
                if (caseInsensitive && !flag.includes('i')) {
                    flag += 'i';
                }

                // Normalize for browser JS testing: handle any remaining POSIX classes
                testRegex = testRegex.replace(/\[\[:punct:\]\]/g, '[-._:/@#$%^&*()!]');
                testRegex = testRegex.replace(/\[\[:alpha:\]\]/g, '[a-zA-Z]');
                testRegex = testRegex.replace(/\[\[:alnum:\]\]/g, '[a-zA-Z0-9]');
                testRegex = testRegex.replace(/\[\[:digit:\]\]/g, '\\d');
                testRegex = testRegex.replace(/\[\[:space:\]\]/g, '\\s');

                const r = new RegExp(testRegex, flag);
                const found = testString.match(r);
                if (found && found.length > 0) {
                    isMatch = true;
                    matches = Array.from(found);
                } else {
                    isMatch = false;
                }
            } catch (e) {
                isMatch = false;
            }
        }
        let diagnosis: string | undefined;
        if (testString && isValid && !isMatch) {
            try { diagnosis = diagnoseFailure(regex, testString); } catch { /* ignore */ }
        }

        setTranslatedResult({ regex, warnings, isValid, isMatch, matches, diagnosis });
    };

    return (
        <div style={{ display: 'flex', gap: '1.25rem', width: '100%', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar */}
            <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                <button
                    onClick={() => setMode('create')}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '8px', width: '100%',
                        background: mode === 'create' ? '#2143B5' : 'white',
                        color: mode === 'create' ? 'white' : '#475569',
                        border: mode === 'create' ? 'none' : '1px solid #E2E8F0',
                        fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
                        boxShadow: mode === 'create' ? '0 4px 6px -1px rgba(33, 67, 181, 0.2)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    <SparklesIcon width={15} height={15} />
                    Regex Creator
                </button>
                <button
                    onClick={() => setMode('translate')}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '8px', width: '100%',
                        background: mode === 'translate' ? '#2143B5' : 'white',
                        color: mode === 'translate' ? 'white' : '#475569',
                        border: mode === 'translate' ? 'none' : '1px solid #E2E8F0',
                        fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
                        boxShadow: mode === 'translate' ? '0 4px 6px -1px rgba(33, 67, 181, 0.2)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    <RefreshIcon width={15} height={15} />
                    Regex Translator
                </button>
            </div>

            {/* Main Content */}
            <div className="card fade-in" style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', minWidth: 0 }}>
                {mode === 'create' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem', lineHeight: 1.5, borderLeft: '3px solid #2143B5', paddingLeft: '0.75rem' }}>
                            Enter a sample text (e.g. <strong>MRN:1234567</strong>), click <strong>Analyze</strong> to auto-detect the structure, refine each segment's <strong>Match Type</strong> & <strong>Quantity</strong>, then select a <strong>Target Vendor</strong> and <strong>Generate</strong> a vendor-optimized regex.
                        </p>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div style={{ flex: 2 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Sample Text / Data</label>
                                    {sampleData && <button onClick={() => { setSampleData(''); setSegments([]); setGeneratedPattern(null); }} style={{ background: 'transparent', border: 'none', color: '#2143B5', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>RESET</button>}
                                </div>
                                <input
                                    type="text"
                                    value={sampleData}
                                    onChange={e => setSampleData(e.target.value)}
                                    placeholder="MRN:1234567"
                                    style={{ width: '100%', padding: '1rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1.1rem', color: '#1E293B' }}
                                />
                                <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.5rem', marginBottom: 0 }}>Provide a real-world example of the data you want to match.</p>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Target Vendor</label>
                                <select
                                    value={creatorVendor}
                                    onChange={e => setCreatorVendor(e.target.value)}
                                    style={{ width: '100%', padding: '1.15rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1.05rem', background: 'white', color: '#1E293B', cursor: 'pointer' }}
                                >
                                    {VENDORS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {segments.length === 0 ? (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    onClick={handleAnalyzeSample}
                                    style={{ flex: 1, padding: '1.1rem', background: '#2143B5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(33, 67, 181, 0.2)', transition: 'background 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.background = '#1a3693'}
                                    onMouseOut={e => e.currentTarget.style.background = '#2143B5'}
                                    disabled={!sampleData}
                                >
                                    <SparklesIcon width={20} height={20} />
                                    Analyze Sample Structure
                                </button>
                                <button
                                    onClick={handleManualBreakdown}
                                    style={{ flex: 1, padding: '1.1rem', background: 'white', color: '#2143B5', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.borderColor = '#2143B5'}
                                    onMouseOut={e => e.currentTarget.style.borderColor = '#CBD5E1'}
                                >
                                    <span style={{ fontSize: '1.5rem', lineHeight: 0.5 }}>+</span> Manual Breakdown
                                </button>
                            </div>
                        ) : (
                            <div className="fade-in" style={{ marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>Refine Character Breakdown</h3>
                                    <button onClick={handleManualBreakdown} style={{ background: 'transparent', border: 'none', color: '#2143B5', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <span>+ ADD SEGMENT</span>
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                                    {segments.map((seg, index) => (
                                        <div key={seg.id} style={{ minWidth: '220px', maxWidth: '280px', flexShrink: 0, padding: '1.25rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #F1F5F9' }}>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8' }}>Part {index + 1}</span>
                                                <div style={{ background: '#EFF6FF', color: '#2143B5', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'monospace' }}>
                                                    {seg.sampleValue || <span style={{ opacity: 0.5 }}>-</span>}
                                                </div>
                                            </div>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>MATCH TYPE</label>
                                                <select
                                                    value={seg.matchType}
                                                    onChange={e => updateSegment(seg.id, { matchType: e.target.value as MatchType })}
                                                    style={{ width: '100%', height: '38px', padding: '0 0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', color: '#1E293B', boxSizing: 'border-box' }}
                                                >
                                                    {MATCH_TYPES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                                                </select>
                                                {['exact', 'charset', 'not_charset', 'range', 'except'].includes(seg.matchType) && (
                                                    <input
                                                        type="text"
                                                        value={seg.customValue || ''}
                                                        onChange={e => updateSegment(seg.id, { customValue: e.target.value })}
                                                        placeholder={seg.matchType === 'exact' ? "e.g., MRN" : "e.g., a-z"}
                                                        style={{ width: '100%', height: '38px', padding: '0 0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', marginTop: '0.5rem', color: '#1E293B', fontFamily: 'monospace', boxSizing: 'border-box' }}
                                                    />
                                                )}
                                            </div>
                                            <div style={{ marginBottom: '0.5rem' }}>
                                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>QUANTITY</label>
                                                <select
                                                    value={seg.quantifier}
                                                    onChange={e => updateSegment(seg.id, { quantifier: e.target.value as QuantifierType })}
                                                    style={{ width: '100%', height: '38px', padding: '0 0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', color: '#1E293B', boxSizing: 'border-box' }}
                                                >
                                                    {QUANTIFIERS.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
                                                </select>
                                                {['exactly', 'between', 'at_least'].includes(seg.quantifier) && (
                                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                        <input
                                                            type="number"
                                                            value={seg.quantityX || ''}
                                                            onChange={e => updateSegment(seg.id, { quantityX: parseInt(e.target.value) || undefined })}
                                                            placeholder="N"
                                                            style={{ width: '100%', height: '38px', padding: '0 0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', color: '#1E293B', boxSizing: 'border-box' }}
                                                        />
                                                        {seg.quantifier === 'between' && (
                                                            <input
                                                                type="number"
                                                                value={seg.quantityY || ''}
                                                                onChange={e => updateSegment(seg.id, { quantityY: parseInt(e.target.value) || undefined })}
                                                                placeholder="M"
                                                                style={{ width: '100%', height: '38px', padding: '0 0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', color: '#1E293B', boxSizing: 'border-box' }}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                                <button onClick={() => removeSegment(seg.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>Remove</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                                    <button
                                        onClick={generateRegexFromSegments}
                                        style={{
                                            padding: '0.85rem 2.5rem', background: '#2143B5', color: 'white', border: 'none', borderRadius: '8px',
                                            fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                                            boxShadow: '0 4px 6px -1px rgba(33, 67, 181, 0.2)', transition: 'background 0.2s'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background = '#1a3693'}
                                        onMouseOut={e => e.currentTarget.style.background = '#2143B5'}
                                    >
                                        <SparklesIcon width={18} height={18} />
                                        Generate Regex
                                    </button>
                                </div>
                            </div>
                        )}

                        {segments.length > 0 && generatedPattern && (
                            <div className="fade-in" style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#0F172A', fontSize: '1.05rem' }}>
                                        <CodeIcon width={18} height={18} color={copiedCreator ? '#059669' : '#2143B5'} />
                                        <span style={{ color: copiedCreator ? '#059669' : '#0F172A', transition: 'color 0.2s' }}>Generated Regex for {VENDORS.find(v => v.id === creatorVendor)?.name}</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(generatedPattern, 'creator')}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'transparent', border: 'none', color: copiedCreator ? '#059669' : '#2143B5', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }}
                                    >
                                        {copiedCreator ? <CheckCircleIcon width={16} height={16} /> : <CopyIcon width={16} height={16} />}
                                        {copiedCreator ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div style={{ padding: '1.5rem', background: '#111827', color: '#60A5FA', fontFamily: 'monospace', fontSize: '1.2rem', wordBreak: 'break-all', minHeight: '60px', display: 'flex', alignItems: 'center' }}>
                                    {generatedPattern}
                                </div>
                                <div style={{ padding: '2rem 1.5rem', background: '#FFFFFF' }}>
                                    <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 700, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase' }}>HOW IT WORKS</h4>
                                    <p style={{ margin: '0 0 1rem 0', color: '#1E293B', fontSize: '1rem', fontWeight: 700, lineHeight: 1.8, background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                        {segments.map((seg, i) => {
                                            const mt = MATCH_TYPES.find(m => m.id === seg.matchType);
                                            const label = seg.matchType === 'exact' ? `"${seg.customValue}"` : mt?.label?.split('[')[0].trim() || seg.matchType;
                                            let quant = '';
                                            if (seg.quantifier === 'exactly' && seg.quantityX && seg.quantityX > 1) quant = ` (${seg.quantityX} times)`;
                                            else if (seg.quantifier === 'one_or_more') quant = ' (1+ times)';
                                            else if (seg.quantifier === 'zero_or_more') quant = ' (0+ times)';
                                            else if (seg.quantifier === 'zero_or_one') quant = ' (optional)';
                                            else if (seg.quantifier === 'between') quant = ` (${seg.quantityX}-${seg.quantityY} times)`;
                                            else if (seg.quantifier === 'at_least') quant = ` (${seg.quantityX}+ times)`;
                                            return <span key={seg.id}>{i > 0 && <span style={{ color: '#94A3B8', margin: '0 0.35rem' }}> — </span>}{label}{quant}</span>;
                                        })}
                                    </p>
                                    <p style={{ margin: 0, color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                        {explanation}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {mode === 'translate' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem', lineHeight: 1.5, borderLeft: '3px solid #2143B5', paddingLeft: '0.75rem' }}>
                            Paste any <strong>Regex Pattern</strong>, select a <strong>Target Vendor</strong>, and optionally provide a <strong>Test String</strong>. Click <strong>Translate & Test</strong> to optimize the regex for the selected engine and validate it.
                        </p>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div style={{ flex: 2 }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Regex Pattern</label>
                                <input
                                    type="text"
                                    value={translatePattern}
                                    onChange={e => setTranslatePattern(e.target.value)}
                                    style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1.1rem', fontFamily: 'monospace', color: '#1E293B' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Target Vendor</label>
                                <select
                                    value={translateVendor}
                                    onChange={e => setTranslateVendor(e.target.value)}
                                    style={{ width: '100%', padding: '1.15rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1.05rem', background: 'white', color: '#1E293B', cursor: 'pointer' }}
                                >
                                    {VENDORS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Test String (Optional)</label>
                                {testString && <button onClick={() => { setTestString(''); setTranslatedResult(null); }} style={{ background: 'transparent', border: 'none', color: '#2143B5', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>RESET</button>}
                            </div>
                            <input
                                type="text"
                                value={testString}
                                onChange={e => setTestString(e.target.value)}
                                placeholder="Enter text to test against the regex..."
                                style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1rem', color: '#1E293B' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                onClick={handleTranslateAndTest}
                                style={{
                                    padding: '0.85rem 2.5rem', background: '#2143B5', color: 'white', border: 'none', borderRadius: '8px',
                                    fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                                    boxShadow: '0 4px 6px -1px rgba(33, 67, 181, 0.2)', transition: 'background 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.background = '#1a3693'}
                                onMouseOut={e => e.currentTarget.style.background = '#2143B5'}
                            >
                                <RefreshIcon width={18} height={18} />
                                Translate & Test
                            </button>
                        </div>

                        {translatedResult && (
                            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
                                <div style={{
                                    padding: '1.25rem 1.5rem', borderRadius: '8px', border: (testString ? translatedResult.isMatch : translatedResult.isValid) ? '1px solid #BFDBFE' : '1px solid #FECACA',
                                    background: (testString ? translatedResult.isMatch : translatedResult.isValid) ? '#EFF6FF' : '#FEF2F2', display: 'flex', alignItems: 'center', gap: '1rem',
                                    maxWidth: '350px'
                                }}>
                                    {(testString ? translatedResult.isMatch : translatedResult.isValid) ? <CheckCircleIcon width={24} height={24} color="#2143B5" /> : <AlertTriangleIcon width={28} height={28} color="#DC2626" />}
                                    <div>
                                        <div style={{ fontWeight: 700, color: (testString ? translatedResult.isMatch : translatedResult.isValid) ? '#1E3A8A' : '#991B1B', fontSize: '1.05rem', marginBottom: '0.2rem' }}>
                                            {testString ? 'Validation Status' : 'Syntax Status'}
                                        </div>
                                        <div style={{ color: (testString ? translatedResult.isMatch : translatedResult.isValid) ? '#2143B5' : '#DC2626', fontSize: '0.95rem' }}>
                                            {!testString
                                                ? (translatedResult.isValid ? 'Valid Regex Syntax' : 'Invalid Regex Syntax Generated')
                                                : (translatedResult.isMatch ? 'Regex Matched Test String' : 'Regex Did Not Match')
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600, color: '#0F172A', fontSize: '1.05rem' }}>
                                            <FileTextIcon width={18} height={18} color="#2143B5" /> {VENDORS.find(v => v.id === translateVendor)?.name} Optimized Pattern
                                        </div>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(translatedResult.regex)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'transparent', border: 'none', color: '#2143B5', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}
                                        >
                                            <CopyIcon width={16} height={16} /> Copy
                                        </button>
                                    </div>
                                    <div style={{ padding: '1.5rem', background: '#111827', color: '#60A5FA', fontFamily: 'monospace', fontSize: '1.2rem', wordBreak: 'break-all', minHeight: '60px', display: 'flex', alignItems: 'center' }}>
                                        {translatedResult.regex}
                                    </div>
                                    <div style={{ padding: '2rem 1.5rem', background: '#FFFFFF' }}>
                                        <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 700, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Explanation</h4>

                                        {testString && translatedResult.isMatch !== null ? (
                                            translatedResult.isMatch ? (
                                                <div>
                                                    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                                        <div style={{ fontWeight: 700, color: '#1E40AF', fontSize: '0.95rem', marginBottom: '0.5rem' }}>✅ Match found!</div>
                                                        <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                                            The test string <strong>"{testString}"</strong> matched the pattern. The regex found: {translatedResult.matches?.map((m, i) => <code key={i} style={{ background: '#DBEAFE', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600, color: '#1E40AF', margin: '0 0.15rem' }}>{m}</code>)}
                                                        </p>
                                                    </div>
                                                    <details style={{ cursor: 'pointer', color: '#64748B', fontSize: '0.85rem' }}>
                                                        <summary style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Step-by-step breakdown</summary>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                            {explainRegex(translatedResult.regex).map((step, i) => (
                                                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.4rem 0.6rem', background: i % 2 === 0 ? '#F8FAFC' : 'white', borderRadius: '4px', fontSize: '0.85rem' }}>
                                                                    <span style={{ background: '#2143B5', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                                                                    <span style={{ color: '#334155', lineHeight: 1.4 }}>{step}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </details>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                                        <div style={{ fontWeight: 700, color: '#B91C1C', fontSize: '0.95rem', marginBottom: '0.5rem' }}>❌ No match</div>
                                                        <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                                            {translatedResult.diagnosis || `The test string "${testString}" did not match the pattern.`}
                                                        </p>
                                                    </div>
                                                    <details open style={{ cursor: 'pointer', color: '#64748B', fontSize: '0.85rem' }}>
                                                        <summary style={{ fontWeight: 600, marginBottom: '0.75rem' }}>What the regex expects</summary>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                            {explainRegex(translatedResult.regex).map((step, i) => (
                                                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.4rem 0.6rem', background: i % 2 === 0 ? '#FFF7ED' : 'white', borderRadius: '4px', fontSize: '0.85rem' }}>
                                                                    <span style={{ background: '#DC2626', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                                                                    <span style={{ color: '#334155', lineHeight: 1.4 }}>{step}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </details>
                                                </div>
                                            )
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                {explainRegex(translatedResult.regex).map((step, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.5rem 0.6rem', background: i % 2 === 0 ? '#F8FAFC' : 'white', borderRadius: '4px', border: '1px solid #F1F5F9', fontSize: '0.9rem' }}>
                                                        <span style={{ background: '#2143B5', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                                                        <span style={{ color: '#334155', lineHeight: 1.5 }}>{step}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {translatedResult.warnings.length > 0 && (
                                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '1rem' }}>
                                                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', fontWeight: 700, color: '#B45309', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Engine Warnings</h4>
                                                {translatedResult.warnings.map((w, i) => <p key={i} style={{ margin: '0 0 0.5rem 0', color: '#B45309', fontSize: '0.9rem', lineHeight: 1.5 }}>⚠️ {w}</p>)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
