'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Store,
  CreditCard,
  Settings,
  MessageSquare,
  UserCog,
  BarChart3,
} from 'lucide-react';

interface SidebarProps {
  role: 'SUPERADMIN' | 'ADMIN';
  tenantId?: string;
}

const superAdminLinks = [
  { href: '/superadmin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/superadmin/tiendas', label: 'Tiendas', icon: Store },
  { href: '/superadmin/planes', label: 'Planes', icon: CreditCard },
  { href: '/superadmin/planes/gratis', label: 'Plan Gratis', icon: UserCog },
  { href: '/superadmin/ajustes', label: 'Ajustes', icon: Settings },
  { href: '/superadmin/soporte', label: 'Soporte', icon: MessageSquare },
];

const adminLinks = (tenantId: string) => [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: `/admin/clientes`, label: 'Clientes', icon: UserCog },
  { href: `/admin/productos`, label: 'Inventario', icon: Store },
  { href: `/admin/deudas`, label: 'Deudas', icon: BarChart3 },
  { href: `/admin/pagos`, label: 'Pagos', icon: CreditCard },
  { href: `/admin/configuracion`, label: 'Configuración', icon: Settings },
];

export function Sidebar({ role, tenantId }: SidebarProps) {
  const pathname = usePathname();
  const links = role === 'SUPERADMIN' ? superAdminLinks : adminLinks(tenantId || '');

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <Link href={role === 'SUPERADMIN' ? '/superadmin' : '/admin'}>
          <h1 className="text-xl font-bold text-primary">Debt Manager</h1>
          <p className="text-xs text-gray-500">
            {role === 'SUPERADMIN' ? 'SuperAdmin' : 'Panel de Tienda'}
          </p>
        </Link>
      </div>

      <nav className="px-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}