import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://itsectools.com';

    return [
        { url: baseUrl, lastModified: '2026-03-24', changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/dlp`, lastModified: '2026-03-24', changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/ngfw`, lastModified: '2026-03-24', changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/mitre`, lastModified: '2026-03-24', changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/threat-protection`, lastModified: '2026-03-24', changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/network-pulse`, lastModified: '2026-03-24', changeFrequency: 'weekly', priority: 0.7 },
        { url: `${baseUrl}/help`, lastModified: '2026-03-24', changeFrequency: 'weekly', priority: 0.7 },
        { url: `${baseUrl}/help/dlp-validator`, lastModified: '2026-03-24', changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/help/ngfw-testing`, lastModified: '2026-03-24', changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/help/mitre-attack`, lastModified: '2026-03-24', changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/help/threat-generation`, lastModified: '2026-03-24', changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/help/network-pulse`, lastModified: '2026-03-24', changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/blog`, lastModified: '2026-03-24', changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/blog/test-dlp-policy-free-tool-guide`, lastModified: '2026-03-12', changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/blog/eicar-test-file-download`, lastModified: '2026-03-10', changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/blog/dlp-regex-builder-vendors`, lastModified: '2026-03-08', changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/blog/ngfw-ips-signature-validation`, lastModified: '2026-03-06', changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/blog/mitre-attack-kill-chain-testing`, lastModified: '2026-03-04', changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/blog/dlp-false-confidence-testing`, lastModified: '2026-03-24', changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/blog/itsectools-vs-dlp-testing-tools`, lastModified: '2026-03-14', changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/contact`, lastModified: '2026-03-24', changeFrequency: 'monthly', priority: 0.5 },
    ];
}
