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
  title: 'ITSecTools — Free DLP & Firewall Testing Toolkit',
  description: 'Test your DLP policies, stress-test your firewall, and validate endpoint security — all from the browser. Upload sensitive files, run IPS attack simulations, and generate vendor-specific regex. Free, no signup.',
  authors: [{ name: 'ITSecTools Team' }],
  openGraph: {
    title: 'ITSecTools — Free DLP & Firewall Testing Toolkit',
    description: 'Upload a file, see if your DLP catches it. Run attack payloads against your firewall. Generate regex for 10 DLP vendors. Free, no signup.',
    url: 'https://itsectools.com',
    siteName: 'ITSecTools',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://itsectools.com/icon.png', width: 512, height: 512, alt: 'ITSecTools — Free Security Testing Toolkit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ITSecTools — Free DLP & Firewall Testing Toolkit',
    description: 'Upload a file, see if your DLP catches it. Run IPS attacks against your firewall. Free, in-browser, no signup.',
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
  name: 'ITSecTools',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Any',
  logo: 'https://itsectools.com/icon.png',
  description: 'Free browser-based toolkit for testing DLP policies, stress-testing firewalls, and validating endpoint security controls.',
  url: 'https://itsectools.com',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'DLP Validator — test data leakage across HTTP, HTTPS, FTP with fresh PII/PCI/PHI documents',
    'DLP Regex Builder — generate and translate regex for 10 vendor engines',
    'NGFW & IPS Tester — SQLi, XSS, evasion, and C2 attack simulations',
    'MITRE ATT&CK Simulator — 4-stage kill chain from Initial Access to Exfiltration',
    'Threat Generator — EICAR, heuristic malware samples, and ransomware behavior scripts',
    'PDF Reports — auto-generated validation scorecards for DLP, NGFW, and MITRE tests with gap analysis and recommendations'
  ],
  publisher: { '@type': 'Organization', name: 'ITSecTools' }
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
