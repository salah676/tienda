'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Check, Crown } from 'lucide-react';

export default function FreePlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateFreePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Plan Gratuito',
          type: 'GRATIS',
          price: 0,
          durationDays: 365,
          maxClients: 10,
          maxProducts: 20,
          features: ['Hasta 10 clientes', 'Hasta 20 productos', 'Soporte por email', 'Anuncios de Google'],
          googleAdsEnabled: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Plan gratuito creado correctamente');
        router.push('/superadmin/planes');
      } else {
        toast.error(data.error || 'Error al crear plan');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Crear Plan Gratuito</h1>
        <p className="text-gray-500">Plan con límite de 10 clientes y anuncios de Google</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Plan Gratuito - Características
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Precio</p>
              <p className="font-bold text-xl">0 MAD</p>
              <p className="text-xs text-gray-400">Gratuito</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Duración</p>
              <p className="font-bold text-xl">365 días</p>
              <p className="text-xs text-gray-400">1 año</p>
            </div>
          </div>

          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="font-medium text-red-800">Límites:</p>
            <ul className="text-sm text-red-700 mt-2 space-y-1">
              <li>• Máximo 10 clientes</li>
              <li>• Máximo 20 productos</li>
            </ul>
          </div>

          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="font-medium text-green-800">Incluido:</p>
            <ul className="text-sm text-green-700 mt-2 space-y-1">
              <li>• Anuncios de Google Ads</li>
              <li>• Soporte por email</li>
              <li>• Panel de administración</li>
              <li>• App para clientes</li>
            </ul>
          </div>

          <Button onClick={handleCreateFreePlan} disabled={loading} className="w-full">
            {loading ? 'Creando...' : 'Crear Plan Gratuito'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}