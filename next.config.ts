import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Disable trailing slashes for clean URLs
    trailingSlash: false,

    // Disable dev indicators
    devIndicators: false,

    // Security and SEO headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'X-Robots-Tag',
                        value: 'index, follow',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
