// Navigation/Breadcrumbs component
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show on home page
  if (pathname === '/') return null;
  
  const paths = pathname.split('/').filter(Boolean);
  
  return (
    <div className="container mx-auto px-4 py-4">
      <nav className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-orange-400 transition-colors">
          🦞 Home
        </Link>
        {paths.map((path, index) => (
          <span key={path} className="flex items-center gap-2">
            <span className="text-gray-600">/</span>
            <span className={index === paths.length - 1 ? 'text-white capitalize' : 'hover:text-orange-400 transition-colors capitalize'}>
              {path.replace(/-/g, ' ')}
            </span>
          </span>
        ))}
      </nav>
    </div>
  );
}
