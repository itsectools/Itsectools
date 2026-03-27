export default function StatsCard({ title, value, unit, description }: { title: string; value: string | number; unit?: string; description?: string }) {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                {value}<span style={{ fontSize: '1rem', marginLeft: '0.2rem', opacity: 0.6 }}>{unit}</span>
            </div>
            {description && <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.5 }}>{description}</p>}
        </div>
    );
}
