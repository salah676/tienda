'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/superadmin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    document.cookie = 'auth_token=; path=/; max-age=0';
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Debt Manager - SuperAdmin</h1>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Cerrar Sesion
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Tiendas Totales</h3>
            <p className="text-3xl font-bold">{stats?.total_tenants || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Tiendas Activas</h3>
            <p className="text-3xl font-bold text-green-600">{stats?.active_tenants || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Clientes Totales</h3>
            <p className="text-3xl font-bold">{stats?.total_clients || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Deudas Totales</h3>
            <p className="text-3xl font-bold">{stats?.total_debts || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Montos</h3>
            <p className="text-2xl font-bold text-blue-600">${(stats?.total_amount || 0).toLocaleString()}</p>
            <p className="text-gray-500 text-sm">Total Deudas</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Cobrado</h3>
            <p className="text-2xl font-bold text-green-600">${(stats?.total_collected || 0).toLocaleString()}</p>
            <p className="text-gray-500 text-sm">Total Cobrado</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <a href="/tenants" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Gestionar Tiendas
          </a>
          <a href="/plans" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Gestionar Planes
          </a>
        </div>
      </main>
    </div>
  );
}