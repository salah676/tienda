'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingCart, Plus, Minus, Trash2, QrCode, 
  Clock, CheckCircle, AlertCircle
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  unitType: string;
  category?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface GeneratedQR {
  code: string;
  expiresAt: string;
  totalAmount: number;
  items: CartItem[];
}

export default function CustomerCartPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [validityMinutes, setValidityMinutes] = useState(60);
  const [generatedQR, setGeneratedQR] = useState<GeneratedQR | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tenantId] = useState('demo-tenant-id');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/productos?tenantId=${tenantId}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.filter((p: Product) => p.isActive !== false));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const generateQR = async () => {
    if (cart.length === 0) return;

    setGenerating(true);
    try {
      const items = cart.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
      }));

      const res = await fetch('/api/qrcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          items,
          totalAmount: getTotal(),
          validityMinutes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedQR({
          code: data.data.code,
          expiresAt: data.data.expiresAt,
          totalAmount: data.data.totalAmount,
          items: cart,
        });
      } else {
        alert(data.error || 'Error al generar código');
      }
    } catch (error) {
      console.error('Error generating QR:', error);
      alert('Error al generar el código QR');
    } finally {
      setGenerating(false);
    }
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getUnitLabel = (unitType: string) => {
    switch (unitType) {
      case 'KILO': return '/kg';
      case 'GRAMO': return '/g';
      case 'LITRO': return '/L';
      default: return '/ud';
    }
  };

  if (generatedQR) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Código QR Generado!</h2>
            <p className="text-gray-500 mb-6">Muestra este código al vendedor</p>

            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <div className="text-white text-3xl font-mono font-bold tracking-widest mb-2">
                {generatedQR.code}
              </div>
              <div className="text-gray-400 text-sm">
                Válido por {validityMinutes} minutos
              </div>
            </div>

            <div className="text-3xl font-bold text-primary mb-6">
              {generatedQR.totalAmount.toFixed(2)} MAD
            </div>

            <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Resumen:</h3>
              {generatedQR.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm py-1">
                  <span className="text-gray-600">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    {(item.product.price * item.quantity).toFixed(2)} MAD
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setGeneratedQR(null)}
              className="w-full py-3 bg-primary text-white rounded-lg"
            >
              Crear Nuevo Código
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Mi Carrito</h1>
          <p className="text-sm text-gray-500">{cart.length} productos</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4">
        {cart.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
            <h2 className="font-medium text-gray-700 mb-3">Tu compra</h2>
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.product.price.toFixed(2)} MAD {getUnitLabel(item.product.unitType)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="text-xl font-bold text-primary">{getTotal().toFixed(2)} MAD</span>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de validez
              </label>
              <div className="flex gap-2">
                {[15, 30, 60, 120].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setValidityMinutes(mins)}
                    className={`flex-1 py-2 rounded-lg text-sm ${
                      validityMinutes === mins
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateQR}
              disabled={generating}
              className="w-full mt-4 py-3 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <QrCode className="w-5 h-5" />
              {generating ? 'Generando...' : 'Generar Código QR'}
            </button>
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                !selectedCategory ? 'bg-primary text-white' : 'bg-white text-gray-600'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as string)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-primary text-white' : 'bg-white text-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando productos...</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm p-3">
                <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-3xl">📦</span>
                </div>
                <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-primary">
                    {product.price.toFixed(2)} MAD
                    <span className="text-xs text-gray-500 font-normal">{getUnitLabel(product.unitType)}</span>
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            {search || selectedCategory ? 'No se encontraron productos' : 'No hay productos disponibles'}
          </div>
        )}
      </div>
    </div>
  );
}