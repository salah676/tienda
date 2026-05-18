'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { 
  Bell, Check, Building2, TrendingUp, Users, 
  Package, QrCode, AlertCircle, Volume2, VolumeX
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

export default function SuperAdminDashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [superAdminId, setSuperAdminId] = useState<string | null>(null);

  useEffect(() => {
    fetchSuperAdmin();
  }, []);

  useEffect(() => {
    if (superAdminId) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [superAdminId]);

  const fetchSuperAdmin = async () => {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    if (data.success && data.user.role === 'SUPERADMIN') {
      setSuperAdminId(data.user.id);
    }
  };

  const fetchNotifications = async () => {
    if (!superAdminId) return;
    
    try {
      const res = await fetch(`/api/notificaciones?userId=${superAdminId}`);
      const data = await res.json();
      if (data.success) {
        const prevUnread = unreadCount;
        setNotifications(data.data);
        setUnreadCount(data.unreadCount);
        
        if (soundEnabled && data.unreadCount > prevUnread && prevUnread === 0) {
          playNotificationSound();
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleiwGIX+r5cykfQQAVLza77V0NgJFp+TmtHYzBE2Y0eWyfT0IU6XY5bR6OQJHlNLks4M+CEWXzeCygkMKSJPM3raGRglGkcjdq4pICEKQyN2zhUkJSJHI3baNSQhGkMfcrYtJCESQx9ysi0kIRJDI3ayNSQhEkMfcrIxJCESQx9ysjEkIRJDI3ayMSQhEkMfcrIxJCE');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const markAsRead = async (notificationId: string) => {
    await fetch('/api/notificaciones', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId, action: 'markRead' }),
    });
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    await fetch('/api/notificaciones', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'markAllRead' }),
    });
    fetchNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'TIENDA_NUEVA':
        return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'PAGO_RECIBIDO':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'DEUDA_PAGADA':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'ALERTA':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="SUPERADMIN" />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard SuperAdmin</h1>
            <p className="text-gray-500">Gestión centralizada de tiendas</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg ${soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}
              title={soundEnabled ? 'Sonido activado' : 'Sonido desactivado'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            
            <div className="relative">
              <button className="p-2 bg-white rounded-lg border hover:bg-gray-50 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tiendas Activas</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Clientes</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Productos</p>
                <p className="text-2xl font-bold">567</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <QrCode className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Códigos QR</p>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones
            </h2>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary hover:underline"
              >
                Marcar todo como leído
              </button>
            )}
          </div>
          
          <div className="divide-y max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay notificaciones
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white rounded-lg border">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{notification.title}</p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString('es-MA')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}