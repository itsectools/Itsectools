import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | ITSecTools',
    description: 'Get in touch with the ITSecTools team. Report bugs, request features, or ask about DLP testing, firewall validation, and security tooling.',
    alternates: {
        canonical: 'https://itsectools.com/contact',
    },
    openGraph: {
        title: 'Contact Us | ITSecTools',
        description: 'Reach the ITSecTools team for support, feature requests, or feedback.',
        url: 'https://itsectools.com/contact',
        siteName: 'ITSecTools',
    }
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
