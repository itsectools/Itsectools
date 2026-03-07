import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Network Telemetry & PMTU Discovery Tool | ITSecTools',
    description: 'Test your network path stability. Verify Path MTU Discovery, measure network jitter, test packet loss, and validate internet latency directly from your browser.',
    alternates: {
        canonical: 'https://itsectools.com/network-pulse',
    },
    openGraph: {
        title: 'Network Telemetry & PMTU Discovery test | ITSecTools',
        description: 'Verify Path MTU, network jitter, latency, and packet loss.',
    }
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Network Pulse Telemetry Tester',
    applicationCategory: 'NetworkUtility',
    description: 'Test your network path stability. Verify Path MTU Discovery, measure network jitter, test packet loss, and validate internet latency directly from your browser.',
    url: 'https://itsectools.com/network-pulse',
    featureList: [
        'Test Path Maximum Transmission Unit (PMTU)',
        'Measure network jitter over WebRTC',
        'Test real-time packet loss',
        'Calculate network latency metrics'
    ]
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'How do I find the public IP address of my network?',
            acceptedAnswer: { '@type': 'Answer', text: 'ITSecTools automatically detects and displays the public IP address of your network as soon as you visit the Network Pulse page. This is the IP address that external servers and websites see when your network makes a request — useful for verifying VPN connections, firewall rules, proxy configurations, and DNS resolution. You can copy the IP address to your clipboard with one click.' }
        },
        {
            '@type': 'Question',
            name: 'What is Path MTU Discovery and why does it matter?',
            acceptedAnswer: { '@type': 'Answer', text: 'Path MTU Discovery (PMTUD) determines the maximum packet size that can travel from your device to a destination server without being fragmented. ITSecTools uses a binary search algorithm to test payload sizes from 576 to 1500 bytes, identifying if your network path supports standard 1500-byte packets or if VPN tunnels, PPPoE connections, or other encapsulation is reducing your effective MTU.' }
        },
        {
            '@type': 'Question',
            name: 'How does ITSecTools measure network latency and jitter?',
            acceptedAnswer: { '@type': 'Answer', text: 'Latency is measured using application-layer HTTP pings — small web requests sent to the nearest edge server to calculate true end-to-end round-trip time (RTT). Jitter is calculated as the variance between consecutive request response times. Both metrics use 30 samples in batches of 6 for statistical accuracy.' }
        },
        {
            '@type': 'Question',
            name: 'What does the Nearest Edge Server detection show?',
            acceptedAnswer: { '@type': 'Answer', text: 'The Nearest Edge Server shows which data center or Point of Presence (PoP) is handling your requests. This is detected using Vercel edge headers, Cloudflare Ray IDs, or Google Cloud ingress headers. Knowing your edge server location helps diagnose routing issues, verify CDN performance, and confirm geographic proximity of your traffic path.' }
        },
        {
            '@type': 'Question',
            name: 'Is the network telemetry tool free to use?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. All network measurements including public IP detection, latency, jitter, packet loss, and PMTU discovery run entirely from your browser at no cost. No installation, sign-up, or agent software is required.' }
        }
    ]
};

export default function NetworkPulseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            {children}
        </>
    );
}
