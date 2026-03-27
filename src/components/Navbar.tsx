'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/dlp', label: 'DLP Tools' },
    { href: '/ngfw', label: 'NGFW Tests' },
    { href: '/threat-protection', label: 'Threat Protection' },
  ];

  return (
    <nav className="navbar">
      <Link href="/" className="heading-gradient" style={{ fontSize: '1.5rem', textDecoration: 'none' }}>
        CyberShield
      </Link>
      <div className="nav-links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${pathname === link.href ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
