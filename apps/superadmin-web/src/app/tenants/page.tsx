'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TenantsPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', planId: '', phone: '', address: '', logo: '', banner: '', logoType: 'url', bannerType: 'url' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = document.cookie.includes('auth_token');
    if (!token) { router.push('/login'); return; }

    const [tenantsRes, plansRes] = await Promise.all([
      fetch('/api/superadmin/tenants'),
      fetch('/api/superadmin/plans')
    ]);
    const [tenantsData, plansData] = await Promise.all([tenantsRes.json(), plansRes.json()]);
    setTenants(tenantsData.success ? tenantsData.data : []);
    setPlans(plansData.success ? plansData.data : []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/superadmin/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) { setShowForm(false); setForm({ name: '', email: '', password: '', planId: '', phone: '', address: '', logo: '', banner: '', logoType: 'url', bannerType: 'url' }); loadData(); }
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Gestionar Tiendas</h1>
          <div className="flex gap-4">
            <a href="/dashboard" className="bg-gray-500 text-white px-4 py-2 rounded">Volver</a>
            <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Nueva Tienda</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Nueva Tienda</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Nombre de la tienda" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border p-2 rounded" required />
              <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="border p-2 rounded" required />
              <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="border p-2 rounded" required />
              <select value={form.planId} onChange={e => setForm({...form, planId: e.target.value})} className="border p-2 rounded" required>
                <option value="">Seleccionar Plan</option>
                {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input placeholder="Telefono" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="border p-2 rounded" />
              <input placeholder="Direccion" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="border p-2 rounded" />
              
              <div className="md:col-span-2 border-t pt-4 mt-2">
                <h3 className="font-semibold mb-3">Logo y Portada</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de logo</label>
                <select value={form.logoType} onChange={e => setForm({...form, logoType: e.target.value})} className="border p-2 rounded w-full">
                  <option value="url">URL externa</option>
                  <option value="file">Subir archivo</option>
                </select>
              </div>
              <div>
                {form.logoType === 'url' ? (
                  <input placeholder="URL del logo" value={form.logo} onChange={e => setForm({...form, logo: e.target.value})} className="border p-2 rounded w-full" />
                ) : (
                  <input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setForm({...form, logo: reader.result as string });
                      reader.readAsDataURL(file);
                    }
                  }} className="border p-2 rounded w-full" />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de portada</label>
                <select value={form.bannerType} onChange={e => setForm({...form, bannerType: e.target.value})} className="border p-2 rounded w-full">
                  <option value="url">URL externa</option>
                  <option value="file">Subir archivo</option>
                </select>
              </div>
              <div>
                {form.bannerType === 'url' ? (
                  <input placeholder="URL de la portada" value={form.banner} onChange={e => setForm({...form, banner: e.target.value})} className="border p-2 rounded w-full" />
                ) : (
                  <input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setForm({...form, banner: reader.result as string });
                      reader.readAsDataURL(file);
                    }
                  }} className="border p-2 rounded w-full" />
                )}
              </div>
              
              <div className="md:col-span-2 flex gap-4">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Crear Tienda</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-6 py-2 rounded">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Expira</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(tenant => (
                <tr key={tenant.id} className="border-t">
                  <td className="px-6 py-4">{tenant.name}</td>
                  <td className="px-6 py-4">{tenant.email}</td>
                  <td className="px-6 py-4">{tenant.plan?.name || '-'}</td>
                  <td className="px-6 py-4">{new Date(tenant.expiresAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${tenant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {tenant.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No hay tiendas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}