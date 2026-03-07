import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://itsectools.com';

    return [
        { url: baseUrl, lastModified: '2026-02-28', changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/dlp`, lastModified: '2026-02-28', changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/ngfw`, lastModified: '2026-02-28', changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/mitre`, lastModified: '2026-02-23', changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/threat-protection`, lastModified: '2026-02-20', changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/network-pulse`, lastModified: '2026-02-27', changeFrequency: 'weekly', priority: 0.7 },
        { url: `${baseUrl}/help`, lastModified: '2026-02-28', changeFrequency: 'weekly', priority: 0.7 },
        { url: `${baseUrl}/help/dlp-validator`, lastModified: '2026-02-28', changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/help/ngfw-testing`, lastModified: '2026-02-28', changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/help/mitre-attack`, lastModified: '2026-02-28', changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/help/threat-generation`, lastModified: '2026-02-28', changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/help/network-pulse`, lastModified: '2026-02-28', changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/contact`, lastModified: '2026-01-15', changeFrequency: 'monthly', priority: 0.5 },
    ];
}
