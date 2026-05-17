'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, Globe, CreditCard, Monitor, FileText, Mail } from 'lucide-react';

interface GlobalSettings {
  appName: string;
  supportEmail: string;
  googleAds: {
    enabled: boolean;
    defaultPlan: string;
    globalBudget: number;
    adsenseId: string;
    conversionTracking: boolean;
    remarketing: boolean;
    defaultKeywords: string;
    adPlacement: string;
    cpcMax: number;
    impressionLimit: number;
    autoOptimization: boolean;
  };
  paymentGateways: {
    transferencia: boolean;
    wafacash: boolean;
    cashplus: boolean;
  };
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<GlobalSettings>({
    appName: 'Debt Manager',
    supportEmail: 'soporte@debtmanager.com',
    googleAds: {
      enabled: true,
      defaultPlan: 'FREE',
      globalBudget: 100,
      adsenseId: '',
      conversionTracking: true,
      remarketing: true,
      defaultKeywords: 'gestión de deudas, control de clientes, software para tiendas',
      adPlacement: 'search',
      cpcMax: 5.0,
      impressionLimit: 10000,
      autoOptimization: true,
    },
    paymentGateways: {
      transferencia: true,
      wafacash: true,
      cashplus: true,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success('Configuración guardada correctamente');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración Global</h1>
        <p className="text-gray-500">Ajusta los parámetros de la plataforma</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Información General
              </CardTitle>
              <CardDescription>Nombre y branding de la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="appName">Nombre de la App</Label>
                <Input
                  id="appName"
                  value={settings.appName}
                  onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="supportEmail">Email de Soporte</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Pasarelas de Pago
              </CardTitle>
              <CardDescription>Métodos de pago disponibles para las tiendas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Transferencia Bancaria</p>
                  <p className="text-sm text-gray-500">Pagos manuales mediante transferencia</p>
                </div>
                <Switch
                  checked={settings.paymentGateways.transferencia}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      paymentGateways: { ...settings.paymentGateways, transferencia: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">WafaCash</p>
                  <p className="text-sm text-gray-500">Pagos en efectivo en agencias</p>
                </div>
                <Switch
                  checked={settings.paymentGateways.wafacash}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      paymentGateways: { ...settings.paymentGateways, wafacash: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">CashPlus</p>
                  <p className="text-sm text-gray-500">Pagos en efectivo en agencias</p>
                </div>
                <Switch
                  checked={settings.paymentGateways.cashplus}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      paymentGateways: { ...settings.paymentGateways, cashplus: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Google Ads
              </CardTitle>
              <CardDescription>Configuración de publicidad en Google</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Anuncios de Google Activos</p>
                  <p className="text-sm text-gray-500">Habilitar anuncios para todas las tiendas</p>
                </div>
                <Switch
                  checked={settings.googleAds.enabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      googleAds: { ...settings.googleAds, enabled: checked },
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultPlan">Plan por defecto con Ads</Label>
                  <Select
                    value={settings.googleAds.defaultPlan}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        googleAds: { ...settings.googleAds, defaultPlan: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">Plan Gratuito (10 clientes)</SelectItem>
                      <SelectItem value="BRONCE">Plan Bronce</SelectItem>
                      <SelectItem value="ORO">Plan Oro</SelectItem>
                      <SelectItem value="PREMIUM">Plan Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="globalBudget">Presupuesto Global (MAD/día)</Label>
                  <Input
                    id="globalBudget"
                    type="number"
                    value={settings.googleAds.globalBudget}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        googleAds: { ...settings.googleAds, globalBudget: parseInt(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="adsenseId">Google AdSense Client ID</Label>
                <Input
                  id="adsenseId"
                  value={settings.googleAds.adsenseId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      googleAds: { ...settings.googleAds, adsenseId: e.target.value },
                    })
                  }
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ID de AdSense para mostrar anuncios en las páginas de los clientes
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultKeywords">Palabras clave por defecto</Label>
                  <Input
                    id="defaultKeywords"
                    value={settings.googleAds.defaultKeywords}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        googleAds: { ...settings.googleAds, defaultKeywords: e.target.value },
                      })
                    }
                    placeholder="palabra1, palabra2, palabra3"
                  />
                </div>
                <div>
                  <Label htmlFor="adPlacement">Tipo de campaña</Label>
                  <Select
                    value={settings.googleAds.adPlacement}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        googleAds: { ...settings.googleAds, adPlacement: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="search">Búsqueda</SelectItem>
                      <SelectItem value="display">Display (Display Network)</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cpcMax">CPC Máximo (MAD)</Label>
                  <Input
                    id="cpcMax"
                    type="number"
                    step="0.1"
                    value={settings.googleAds.cpcMax}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        googleAds: { ...settings.googleAds, cpcMax: parseFloat(e.target.value) },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="impressionLimit">Límite de impresiones/día</Label>
                  <Input
                    id="impressionLimit"
                    type="number"
                    value={settings.googleAds.impressionLimit}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        googleAds: { ...settings.googleAds, impressionLimit: parseInt(e.target.value) },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="globalBudget">Presupuesto global (MAD/día)</Label>
                  <Input
                    id="globalBudget"
                    type="number"
                    value={settings.googleAds.globalBudget}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        googleAds: { ...settings.googleAds, globalBudget: parseInt(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Opciones avanzadas</h4>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Conversion Tracking</p>
                    <p className="text-sm text-gray-500">Rastrear conversiones de anuncios</p>
                  </div>
                  <Switch
                    checked={settings.googleAds.conversionTracking}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        googleAds: { ...settings.googleAds, conversionTracking: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Remarketing</p>
                    <p className="text-sm text-gray-500">Anuncios para usuarios que ya visitaron</p>
                  </div>
                  <Switch
                    checked={settings.googleAds.remarketing}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        googleAds: { ...settings.googleAds, remarketing: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Optimización automática</p>
                    <p className="text-sm text-gray-500">Google optimiza automáticamente las campañas</p>
                  </div>
                  <Switch
                    checked={settings.googleAds.autoOptimization}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        googleAds: { ...settings.googleAds, autoOptimization: checked },
                      })
                    }
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-800">💡 Información</p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• El Plan Gratuito incluye Google Ads automáticamente</li>
                  <li>• Los anuncios se muestran en la app del cliente</li>
                  <li>• El presupuesto global se divide entre todas las tiendas activas</li>
                  <li>• El CPC máximo controla cuánto pagarás por cada clic</li>
                  <li>• El remarketing permite alcanzar usuarios que ya conocen tu negocio</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      </form>
    </div>
  );
}