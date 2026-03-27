import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Security Testing Blog | ITSecTools',
    description: 'Practical guides on DLP blind spots, firewall misconfigurations, MITRE ATT&CK testing, and regex pitfalls. Written by practitioners, not marketers.',
    alternates: {
        canonical: 'https://itsectools.com/blog',
    },
    openGraph: {
        title: 'Security Testing Blog | ITSecTools',
        description: 'Guides on DLP blind spots, firewall misconfigurations, and validation techniques that work.',
        url: 'https://itsectools.com/blog',
        siteName: 'ITSecTools',
        locale: 'en_US',
        type: 'website',
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'ITSecTools Blog',
    description: 'Practical guides on DLP testing, NGFW validation, MITRE ATT&CK simulation, regex building, and EICAR test files.',
    url: 'https://itsectools.com/blog',
    publisher: {
        '@type': 'Organization',
        name: 'ITSecTools',
        url: 'https://itsectools.com',
    },
};

export default function BlogLayout({
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
            {children}
        </>
    );
}
