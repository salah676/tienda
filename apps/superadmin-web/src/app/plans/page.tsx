'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', duration: '', features: '' });

  useEffect(() => {
    const token = document.cookie.includes('auth_token');
    if (!token) { router.push('/login'); return; }
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const res = await fetch('/api/superadmin/plans');
    const data = await res.json();
    setPlans(data.success ? data.data : []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/superadmin/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price), duration: parseInt(form.duration) })
    });
    if (res.ok) { setShowForm(false); setForm({ name: '', price: '', duration: '', features: '' }); loadPlans(); }
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Gestionar Planes</h1>
          <div className="flex gap-4">
            <a href="/dashboard" className="bg-gray-500 text-white px-4 py-2 rounded">Volver</a>
            <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Nuevo Plan</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Nuevo Plan</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border p-2 rounded" required />
              <input placeholder="Precio" type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="border p-2 rounded" required />
              <input placeholder="Duracion (dias)" type="number" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="border p-2 rounded" required />
              <textarea placeholder="Caracteristicas (separadas por coma)" value={form.features} onChange={e => setForm({...form, features: e.target.value})} className="border p-2 rounded" rows={2} />
              <div className="md:col-span-2 flex gap-4">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Crear</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-6 py-2 rounded">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">${plan.price}<span className="text-sm text-gray-500">/anio</span></p>
              <p className="text-gray-600 mb-4">{plan.duration} dias</p>
              <p className="text-gray-500 text-sm">{plan.features}</p>
            </div>
          ))}
          {plans.length === 0 && <p className="text-gray-500">No hay planes</p>}
        </div>
      </main>
    </div>
  );
}