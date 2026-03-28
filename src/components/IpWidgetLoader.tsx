'use client';

import dynamic from 'next/dynamic';

const IpWidget = dynamic(() => import('@/components/IpWidget'), {
    ssr: false,
    loading: () => <div style={{ height: '80px', width: '250px', background: '#f1f5f9', borderRadius: '12px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
});

export default function IpWidgetLoader() {
    return <IpWidget />;
}
