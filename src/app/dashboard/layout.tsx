'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Vales', href: '/dashboard/vales' },
    { name: 'Corralón', href: '/dashboard/corralon' },
    { name: 'Entregas', href: '/dashboard/entregas' },
  ];

  return (
    <div className="min-h-screen bg-white text-black px-4 py-6">
      <div className="flex space-x-4 mb-6 border-b-2 pb-2 border-blue-600">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`px-4 py-2 font-semibold rounded-t ${
              pathname === tab.href
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-black'
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
}