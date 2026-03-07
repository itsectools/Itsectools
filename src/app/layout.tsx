import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Script from 'next/script';
import ClientLayout from '@/components/ClientLayout';

// Configure the Inter font
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://itsectools.com'),
  title: 'ITSecTools - Security Validation Suite | DLP, NGFW, Regex Builder & Threat Testing',
  description: 'Free professional-grade security validation toolkit. Build vendor-optimized DLP regex for Forcepoint, Symantec, Palo Alto, Zscaler, Netskope & more. Simulate ransomware and C2 threats, validate DLP policies with evasion payloads, and stress-test Next-Generation Firewalls (NGFW) directly from your browser.',
  keywords: [
    'cybersecurity', 'NGFW', 'DLP', 'EICAR', 'ransomware simulation', 'security validation', 'network security', 'threat protection',
    'DLP test', 'DLP testing tool', 'DLP regex builder', 'DLP regex generator', 'vendor-specific DLP regex', 'regex translator',
    'Forcepoint DLP regex', 'Symantec DLP regex', 'Palo Alto DLP regex', 'Zscaler DLP regex', 'Netskope DLP regex', 'Trellix DLP regex', 'Microsoft Purview regex', 'Proofpoint DLP regex', 'Fortinet DLP regex',
    'file label verification', 'sample malware download', 'check public IP and location', 'Path MTU testing', 'packet loss jitter and latency test',
    'NGFW test', 'IPS testing', 'evasion testing', 'metadata viewer', 'check file classification',
    'PMTU Discovery', 'Network Jitter Test', 'OOB data exfiltration', 'web shell simulation', 'HTTP method spoofing',
    'SQLi IPS test', 'XSS IPS test', 'Path Traversal test', 'AET evasion test', 'Log4j simulation', 'Shellshock test',
    'PCI test data', 'PII test data', 'PHI test data', 'metadata inspector', 'document classification check',
    'Regex Translator DLP', 'translate PCRE to RE2', 'Symantec Regex support', 'Forcepoint Regex builder',
    'DLP Test Data Generator', 'Base64 encoder', 'Password-Protected Archives testing', 'Nested Zip Archives', 'Renamed File Extensions DLP test',
    'AI-powered regex builder', 'cybersecurity test files', 'DLP compliance testing tool', 'file classification checker', 'document label identifier', 'MIP sensitivity label reader', 'file metadata inspector', 'document classification tool',
    'free DLP tool', 'free NGFW testing', 'browser security testing', 'no-install security tool'
  ],
  authors: [{ name: 'ITSecTools Team' }],
  openGraph: {
    title: 'ITSecTools - Security Validation Suite | DLP, NGFW & Regex Builder',
    description: 'Free toolkit for DLP validation, vendor-optimized regex generation (10 engines), evasion payload testing, NGFW stress-testing, and MITRE ATT&CK kill chain simulation — all from your browser.',
    url: 'https://itsectools.com',
    siteName: 'ITSecTools',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://itsectools.com/icon.png', width: 512, height: 512, alt: 'ITSecTools Security Validation Suite' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ITSecTools - DLP, NGFW & Regex Builder | Free Security Toolkit',
    description: 'Build vendor-optimized DLP regex, test evasion payloads, simulate MITRE ATT&CK kill chains, and stress-test firewalls — free, in-browser.',
  },
  alternates: {
    canonical: 'https://itsectools.com',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: '55-LU2sB5bAdQ9X71212WZ3NaNm9ojW8XmSzw6_43FU',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ITSecTools - Security Validation Suite',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Any',
  logo: 'https://itsectools.com/icon.png',
  description: 'Free professional-grade security validation toolkit. Build vendor-optimized DLP regex, simulate threats, validate DLP policies with evasion payloads, and stress-test Next-Generation Firewalls — all from the browser.',
  url: 'https://itsectools.com',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'DLP Validator: Dynamic PII/PCI/PHI document generation (PDF, DOCX, XLSX, CSV), multi-protocol testing, raw text POST simulations, and file metadata inspection.',
    'Evasive Payload Generator: Base64 encoder, renamed file extensions (magic number testing), AES-encrypted password-protected archives, and nested ZIP depth testing.',
    'Regex Creator: Auto-analyze sample data into segments, choose from 27 match types, and generate vendor-optimized regex for 10 DLP engines.',
    'Regex Translator: Translate any regex across Forcepoint, Symantec, Palo Alto, Zscaler, Netskope, Trellix, Fortinet, Microsoft Purview, and Proofpoint with instant testing and failure diagnostics.',
    'File Label Identifier & Classification Checker: Deep-scans DOCX/XLSX archives for MIP classification labels and PDF metadata dictionaries for sensitivity properties, with fallback DLP pattern matching for PII/PCI and file hashing.',
    'NGFW IPS Testing: SQLi, XSS, Path Traversal attack simulations with real payloads.',
    'Advanced Evasion Techniques: Log4j header injection, Hex-encoded SQLi, and Shellshock probe testing.',
    'C2 Beacon Testing: Python stagers, web shell simulators, OOB DNS and HTTP data exfiltration.',
    'Protocol Validation: Jumbo HTTP headers and method spoofing to test RFC compliance.',
    'MITRE ATT&CK Simulator: Sequential kill chain covering T1190, T1059.001, T1003.001, T1048.003.',
    'Network Telemetry: IP intelligence, PMTU discovery, latency, jitter, and packet loss tracking.',
    'Threat Generation: EICAR test files, heuristic malware simulators (.exe, .pdf), and ransomware behavior scripts (.vbs).'
  ],
  publisher: {
    '@type': 'Organization',
    name: 'ITSecTools'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="app-layout">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ClientLayout sidebar={<Sidebar />}>
          {children}
        </ClientLayout>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H3E3P3WREJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-H3E3P3WREJ');
          `}
        </Script>
      </body>
    </html>
  );
}
