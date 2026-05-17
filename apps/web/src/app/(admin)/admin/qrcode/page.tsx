'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { 
  QrCode, CheckCircle, XCircle, Clock, Search, 
  AlertTriangle, Camera, Keyboard
} from 'lucide-react';

interface QRCodeData {
  id: string;
  code: string;
  totalAmount: number;
  status: string;
  expiresAt: string;
  validatedAt?: string;
  items: {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  createdAt: string;
}

export default function QRCodeScannerPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recentCodes, setRecentCodes] = useState<QRCodeData[]>([]);
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');
  const [tenantId] = useState('demo-tenant-id');

  useEffect(() => {
    fetchRecentCodes();
  }, []);

  const fetchRecentCodes = async () => {
    try {
      const res = await fetch(`/api/qrcode?tenantId=${tenantId}`);
      const data = await res.json();
      if (data.success) {
        setRecentCodes(data.data);
      }
    } catch (error) {
      console.error('Error fetching recent codes:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');
    setQrData(null);

    try {
      const res = await fetch(`/api/qrcode?code=${code.trim()}`);
      const data = await res.json();

      if (data.success) {
        setQrData(data.data);
      } else {
        setError(data.error || 'Código no encontrado');
      }
    } catch (err) {
      setError('Error al buscar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!qrData) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/qrcode', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: qrData.code,
          validatorId: 'admin-id'
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('¡Compra validada correctamente!');
        setQrData({ ...qrData, status: 'VALIDADO', validatedAt: new Date().toISOString() });
        fetchRecentCodes();
      } else {
        setError(data.error || 'Error al validar');
      }
    } catch (err) {
      setError('Error al validar el código');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALIDADO':
        return 'text-green-600 bg-green-50';
      case 'PENDIENTE':
        return 'text-yellow-600 bg-yellow-50';
      case 'EXPIRADO':
        return 'text-red-600 bg-red-50';
      case 'CANCELADO':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VALIDADO':
        return <CheckCircle className="w-5 h-5" />;
      case 'PENDIENTE':
        return <Clock className="w-5 h-5" />;
      case 'EXPIRADO':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="ADMIN" tenantId={tenantId} />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <QrCode className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Validar Compra QR</h1>
            </div>
            <p className="text-gray-500 mt-1">Escanea o ingresa el código QR del cliente</p>
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === 'scan' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Camera className="w-4 h-4" />
            Escanear
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === 'history' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Search className="w-4 h-4" />
            Historial
          </button>
        </div>

        {activeTab === 'scan' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1 relative">
                  <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Ingresa el código QR (ej: A1B2C3D4)"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg uppercase tracking-wider"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !code.trim()}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? 'Buscando...' : 'Buscar'}
                </button>
              </form>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700">{success}</span>
              </div>
            )}

            {qrData && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Código de compra</p>
                      <p className="text-2xl font-mono font-bold tracking-wider">{qrData.code}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(qrData.status)}`}>
                      {getStatusIcon(qrData.status)}
                      <span className="font-medium">{qrData.status}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-medium text-gray-700 mb-4">Productos</h3>
                  <div className="space-y-3">
                    {qrData.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x {item.unitPrice.toFixed(2)} MAD
                          </p>
                        </div>
                        <p className="font-medium">{item.totalPrice.toFixed(2)} MAD</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        {isExpired(qrData.expiresAt) && qrData.status === 'PENDIENTE' 
                          ? '⚠️ Este código ha expirado' 
                          : `Válido hasta: ${new Date(qrData.expiresAt).toLocaleString('es-MA')}`
                        }
                      </p>
                      {qrData.validatedAt && (
                        <p className="text-sm text-green-600">
                          Validado el: {new Date(qrData.validatedAt).toLocaleString('es-MA')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-2xl font-bold text-primary">{qrData.totalAmount.toFixed(2)} MAD</p>
                    </div>
                  </div>

                  {qrData.status === 'PENDIENTE' && !isExpired(qrData.expiresAt) && (
                    <button
                      onClick={handleValidate}
                      disabled={loading}
                      className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {loading ? 'Validando...' : 'Confirmar Compra'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Código</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Creado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Validado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentCodes.map((qr) => (
                  <tr key={qr.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-medium">{qr.code}</td>
                    <td className="px-4 py-3">{qr.totalAmount.toFixed(2)} MAD</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(qr.status)}`}>
                        {getStatusIcon(qr.status)}
                        {qr.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(qr.createdAt).toLocaleString('es-MA')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {qr.validatedAt ? new Date(qr.validatedAt).toLocaleString('es-MA') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {recentCodes.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No hay códigos QR registrados
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}