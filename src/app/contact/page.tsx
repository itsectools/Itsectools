'use client';

import { useState } from 'react';
import { MailIcon, CheckCircleIcon, LogoSVG } from '@/components/Icons';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });

                // Reset success message after 5 seconds
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                console.error('Failed to submit form');
                setStatus('idle');
                alert('There was a problem sending your message. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('idle');
            alert('There was an error connecting to the server. Please check your connection and try again.');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <LogoSVG width={80} height={80} />
                </div>
                <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '0.5rem' }}>Contact & Feedback</h1>
                <p style={{ margin: 0, fontSize: '1rem', color: '#64748B' }}>
                    We value your input. Reach out to the creators for suggestions, feature requests, or bug reports.
                </p>
            </header>

            <div className="card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#0F172A' }}>Get in Touch</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{
                        background: '#EFF6FF',
                        padding: '1.5rem',
                        borderRadius: '50%',
                        color: '#2563EB',
                        display: 'inline-flex'
                    }}>
                        <MailIcon width={48} height={48} />
                    </div>

                    <p style={{ color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                        Click the button below to open your default email client. We look forward to hearing your feedback and suggestions!
                    </p>

                    <a
                        href="mailto:info@itsectools.com?subject=ITSecTools%20Feedback"
                        className="btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', textDecoration: 'none' }}
                    >
                        <MailIcon width={18} height={18} /> Send an Email
                    </a>
                </div>

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem', marginTop: '2rem', textAlign: 'left' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>About ITSecTools</h4>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                        ITSecTools is a free initiative dedicated to providing accessible, high-quality security validation utilities for network administrators and security professionals.
                    </p>
                </div>

                {/* Social Links */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                    <a
                        href="https://www.youtube.com/@ITSecTools"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="YouTube"
                        style={{
                            background: '#FEE2E2',
                            color: '#DC2626',
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </a>
                    <a
                        href="https://www.linkedin.com/company/itsectools"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="LinkedIn"
                        style={{
                            background: '#DBEAFE',
                            color: '#2563EB',
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                    <a
                        href="https://x.com/itsectools"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="X (Twitter)"
                        style={{
                            background: '#F1F5F9',
                            color: '#0F172A',
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.15)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
