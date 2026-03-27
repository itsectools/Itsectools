'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ClientLayout({
    children,
    sidebar
}: {
    children: React.ReactNode,
    sidebar: React.ReactNode
}) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    if (isHome) {
        return (
            <main style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {children}
            </main>
        );
    }

    return (
        <>
            {sidebar}
            <main className="main-content">
                {children}
                {/* Global Footer for non-home pages */}
                <footer style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid #E2E8F0', paddingBottom: '1rem', color: '#64748B', fontSize: '0.875rem' }}>
                    © {new Date().getFullYear()} ITSecTools Validation Suite. All rights reserved. For authorized security testing only.
                </footer>
            </main>
        </>
    );
}
