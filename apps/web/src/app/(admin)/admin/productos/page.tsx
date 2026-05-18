'use client';

import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/sidebar';
import { 
  Plus, Upload, Search, Edit2, Trash2, Image, 
  X, Save, Check, RefreshCw, QrCode, Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  unitType: string;
  barcode?: string;
  photo?: string;
  categoryId?: string;
  category?: { name: string };
}

interface Category {
  id: string;
  name: string;
}

const defaultProducts = [
  { name_es: "Leche Centrale 1L", name_fr: "Lait Centrale 1L", name_ar: "حليب سنطرال 1 لتر", category: "Lácteos", unit_type: "unid", price_mad: 7.00, barcode: "", image_url: "" },
  { name_es: "Leche Jaouda 1L", name_fr: "Lait Jaouda 1L", name_ar: "حليب جودة 1 لتر", category: "Lácteos", unit_type: "unid", price_mad: 7.00, barcode: "", image_url: "" },
  { name_es: "Leche Chergui 1L", name_fr: "Lait Chergui 1L", name_ar: "حليب شركي 1 لتر", category: "Lácteos", unit_type: "unid", price_mad: 7.00, barcode: "", image_url: "" },
  { name_es: "Medio litro Centrale", name_fr: "Demi-litre Centrale", name_ar: "نصف لتر حليب سنطرال", category: "Lácteos", unit_type: "unid", price_mad: 3.50, barcode: "", image_url: "" },
  { name_es: "Raïbi Jamila", name_fr: "Raïbi Jamila", name_ar: "رايبي جميلة", category: "Lácteos", unit_type: "unid", price_mad: 2.50, barcode: "", image_url: "" },
  { name_es: "Raïbi Jaouda", name_fr: "Raïbi Jaouda", name_ar: "رايبي جودة", category: "Lácteos", unit_type: "unid", price_mad: 2.50, barcode: "", image_url: "" },
  { name_es: "Yogur Danone Fresa", name_fr: "Yaourt Danone Fraise", name_ar: "ياغورت دانون فريز", category: "Lácteos", unit_type: "unid", price_mad: 2.50, barcode: "", image_url: "" },
  { name_es: "Yogur Danone Vainilla", name_fr: "Yaourt Danone Vanille", name_ar: "ياغورت دانون فاني", category: "Lácteos", unit_type: "unid", price_mad: 2.50, barcode: "", image_url: "" },
  { name_es: "Queso La Vache qui rit (8 porc.)", name_fr: "Fromage La Vache qui rit (8 port.)", name_ar: "فرماج البقرة الضاحكة 8", category: "Lácteos", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Queso Kiri (6 porc.)", name_fr: "Fromage Kiri (6 port.)", name_ar: "فرماج كيري 6", category: "Lácteos", unit_type: "unid", price_mad: 9.50, barcode: "", image_url: "" },
  { name_es: "Queso Rojo (por kilo)", name_fr: "Fromage Rouge Edam (au kilo)", name_ar: "الفرماج الأحمر بالكيلو", category: "Lácteos", unit_type: "kg", price_mad: 110.00, barcode: "", image_url: "" },
  { name_es: "Mantequilla Centrale 250g", name_fr: "Beurre Centrale 250g", name_ar: "زبدة سنطرال 250 غ", category: "Lácteos", unit_type: "unid", price_mad: 22.00, barcode: "", image_url: "" },
  { name_es: "Mantequilla Jbel (por kilo)", name_fr: "Beurre Jbel (au kilo)", name_ar: "زبدة جبل بالكيلو", category: "Lácteos", unit_type: "kg", price_mad: 95.00, barcode: "", image_url: "" },
  { name_es: "Lben (Leche agria) 1L", name_fr: "Lben (Lait fermenté) 1L", name_ar: "لبن 1 لتر", category: "Lácteos", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Harina Blanca Extra (5kg)", name_fr: "Farine Blanche Extra (5kg)", name_ar: "دقيق أبيض ممتاز 5 كلغ", category: "Legumbres y Harinas", unit_type: "unid", price_mad: 38.00, barcode: "", image_url: "" },
  { name_es: "Harina Blanca (25kg)", name_fr: "Farine Blanche (25kg)", name_ar: "دقيق أبيض خنشة 25 كلغ", category: "Legumbres y Harinas", unit_type: "unid", price_mad: 170.00, barcode: "", image_url: "" },
  { name_es: "Sémola Fina (kg)", name_fr: "Semoule Fine (kg)", name_ar: "السميدة الرقيقة بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 11.00, barcode: "", image_url: "" },
  { name_es: "Lentejas (kg)", name_fr: "Lentilles (kg)", name_ar: "العدس بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 16.00, barcode: "", image_url: "" },
  { name_es: "Garbanzos (kg)", name_fr: "Pois chiches (kg)", name_ar: "الحمص بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 18.00, barcode: "", image_url: "" },
  { name_es: "Arroz Blanco (kg)", name_fr: "Riz Blanc (kg)", name_ar: "الروز الأبيض بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 14.00, barcode: "", image_url: "" },
  { name_es: "Pasta Macarrones (kg)", name_fr: "Macaronis en vrac (kg)", name_ar: "المقارونية بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 13.00, barcode: "", image_url: "" },
  { name_es: "Aceite de mesa Lesieur 1L", name_fr: "Huile Lesieur 1L", name_ar: "زيت لوسيور 1 لتر", category: "Aceites", unit_type: "unid", price_mad: 19.50, barcode: "", image_url: "" },
  { name_es: "Aceite de mesa Lesieur 5L", name_fr: "Huile Lesieur 5L", name_ar: "زيت لوسيور 5 لتر", category: "Aceites", unit_type: "unid", price_mad: 95.00, barcode: "", image_url: "" },
  { name_es: "Aceite de Oliva (Litro a granel)", name_fr: "Huile d olive en vrac (L)", name_ar: "زيت العود باللتر", category: "Aceites", unit_type: "kg", price_mad: 85.00, barcode: "", image_url: "" },
  { name_es: "Azúcar en Pilón / Qalb (2kg)", name_fr: "Sucre en Pain / Qalb (2kg)", name_ar: "قالب السكر 2 كلغ", category: "Azúcar y Té", unit_type: "unid", price_mad: 14.00, barcode: "", image_url: "" },
  { name_es: "Azúcar Granulado / Sanida 1kg", name_fr: "Sucre Semoule 1kg", name_ar: "سكر سنيدة 1 كلغ", category: "Azúcar y Té", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Té Sultan Shaara 125g", name_fr: "Thé Sultan Chaara 125g", name_ar: "شاي سلطان شعرة 125 غ", category: "Azúcar y Té", unit_type: "unid", price_mad: 12.00, barcode: "", image_url: "" },
  { name_es: "Té Lipton Amarillo 100 bolsitas", name_fr: "Thé Lipton Jaune 100 sach.", name_ar: "شاي ليبتون 100 كيس", category: "Azúcar y Té", unit_type: "unid", price_mad: 35.00, barcode: "", image_url: "" },
  { name_es: "Café Molido Samar 250g", name_fr: "Café moulu Samar 250g", name_ar: "قهوة سمر 250 غ", category: "Café", unit_type: "unid", price_mad: 18.00, barcode: "", image_url: "" },
  { name_es: "Nescafé Classic 100g", name_fr: "Nescafé Classic 100g", name_ar: "نسكافيه كلاسيك 100 غ", category: "Café", unit_type: "unid", price_mad: 34.00, barcode: "", image_url: "" },
  { name_es: "Agua Mineral Sidi Ali 1.5L", name_fr: "Eau Sidi Ali 1.5L", name_ar: "ماء سيدي علي 1.5 لتر", category: "Bebidas", unit_type: "unid", price_mad: 6.00, barcode: "", image_url: "" },
  { name_es: "Coca-Cola Original 1L", name_fr: "Coca-Cola Original 1L", name_ar: "كوكاكولا 1 لتر", category: "Bebidas", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Tomate Concentrado Aïcha (Peq)", name_fr: "Tomate Concentrée Aïcha (Pt)", name_ar: "مطيشة الحك عيشة صغيرة", category: "Conservas", unit_type: "unid", price_mad: 5.00, barcode: "", image_url: "" },
  { name_es: "Atún Tam en Aceite", name_fr: "Thon Tam à lhuile", name_ar: "طون تام بالزيت", category: "Conservas", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Sardinas en Aceite (Marilyn/Josiane)", name_fr: "Sardines à lhuile", name_ar: "سردين معلب بالزيت", category: "Conservas", unit_type: "unid", price_mad: 5.00, barcode: "", image_url: "" },
  { name_es: "Sal Marina Fina (kg)", name_fr: "Sel Fin (kg)", name_ar: "الملحة رقيقة", category: "Especias (Attaria)", unit_type: "kg", price_mad: 2.00, barcode: "", image_url: "" },
  { name_es: "Pimienta Negra / Bzar (kg)", name_fr: "Poivre Noir / Bzar (kg)", name_ar: "ابزار كحل بالكيلو", category: "Especias (Attaria)", unit_type: "kg", price_mad: 95.00, barcode: "", image_url: "" },
  { name_es: "Comino / Kamoun (kg)", name_fr: "Cumin / Kamoun (kg)", name_ar: "الكامون البلدي بالكيلو", category: "Especias (Attaria)", unit_type: "kg", price_mad: 120.00, barcode: "", image_url: "" },
  { name_es: "Galletas Henry's", name_fr: "Biscuits Henry's", name_ar: "هينريس بيمو", category: "Snacks", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Galletas Tonic", name_fr: "Biscuits Tonic", name_ar: "تونيك بيمو", category: "Snacks", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Chocolatina Silvia", name_fr: "Chocolat Silvia", name_ar: "شوكولا سيلفيا", category: "Snacks", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Almendras / Louz (kg)", name_fr: "Amandes / Louz (kg)", name_ar: "اللوز بالكيلو", category: "Frutos Secos", unit_type: "kg", price_mad: 100.00, barcode: "", image_url: "" },
  { name_es: "Nueces / Garga3 (kg)", name_fr: "Noix / Garga3 (kg)", name_ar: "الكركاع بالكيلو", category: "Frutos Secos", unit_type: "kg", price_mad: 90.00, barcode: "", image_url: "" },
  { name_es: "Dátiles Majhoul (kg)", name_fr: "Dattes Majhoul (kg)", name_ar: "التمر المجهول بالكيلو", category: "Frutos Secos", unit_type: "kg", price_mad: 120.00, barcode: "", image_url: "" },
  { name_es: "Jabón El Keff (Pastilla)", name_fr: "Savon El Keff (Pain)", name_ar: "صابون الكف الحجرة", category: "Limpieza", unit_type: "unid", price_mad: 4.50, barcode: "", image_url: "" },
  { name_es: "Detergente polvo Tide 500g", name_fr: "Lessive poudre Tide 500g", name_ar: "تيد مسحوق غسيل 500 غ", category: "Limpieza", unit_type: "unid", price_mad: 13.00, barcode: "", image_url: "" },
  { name_es: "Champú Cadum", name_fr: "Shampooing Cadum", name_ar: "شامبوان كادوم", category: "Cuidado Personal", unit_type: "unid", price_mad: 14.00, barcode: "", image_url: "" },
];

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tenantId, setTenantId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    unitType: 'PIEZA',
    barcode: '',
    categoryId: '',
    photo: '',
  });

  useEffect(() => {
    fetchUserAndData();
  }, []);

  const fetchUserAndData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.user.tenantId) {
        setTenantId(data.user.tenantId);
        fetchProducts(data.user.tenantId);
        fetchCategories(data.user.tenantId);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (tid: string) => {
    try {
      const res = await fetch(`/api/productos?tenantId=${tid}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async (tid: string) => {
    try {
      const res = await fetch(`/api/categorias?tenantId=${tid}`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleBulkUpload = async () => {
    setUploading(true);
    try {
      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          products: defaultProducts,
          action: 'bulk',
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchProducts();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error bulk upload:', error);
      alert('Error al cargar productos');
    } finally {
      setUploading(false);
      setShowBulkModal(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        tenantId,
        price: parseFloat(formData.price),
      };

      let res;
      if (editingProduct) {
        res = await fetch('/api/productos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingProduct.id }),
        });
      } else {
        res = await fetch('/api/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        alert(editingProduct ? 'Producto actualizado' : 'Producto creado');
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar producto');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const res = await fetch(`/api/productos?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      unitType: product.unitType,
      barcode: product.barcode || '',
      categoryId: product.categoryId || '',
      photo: product.photo || '',
    });
    setImagePreview(product.photo || null);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      unitType: 'PIEZA',
      barcode: '',
      categoryId: '',
      photo: '',
    });
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getUnitLabel = (unitType: string) => {
    switch (unitType) {
      case 'KILO': return '/kg';
      case 'GRAMO': return '/g';
      case 'LITRO': return '/L';
      default: return '/ud';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="ADMIN" tenantId={tenantId} />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
            <p className="text-gray-500">Gestiona los productos de tu tienda</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Package className="w-4 h-4" />
              Cargar Productos
            </button>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Nuevo Producto
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Imagen</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Categoría</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Precio</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Unidad</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Código</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {product.photo ? (
                        <img src={product.photo} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-gray-500">{product.category?.name || '-'}</td>
                    <td className="px-4 py-3 font-medium">{product.price.toFixed(2)} MAD</td>
                    <td className="px-4 py-3 text-gray-500">{getUnitLabel(product.unitType)}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-sm">{product.barcode || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No hay productos. ¡Carga los productos por defecto o crea uno nuevo!
              </div>
            )}
          </div>
        )}
      </main>

      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Cargar Productos</h2>
            <p className="text-gray-600 mb-6">
              Se cargarán <strong>{defaultProducts.length}</strong> productos predefinedos con precios y categorías.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? 'Cargando...' : 'Cargar Productos'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio (MAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Unidad</label>
                  <select
                    value={formData.unitType}
                    onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="PIEZA">Unidad</option>
                    <option value="KILO">Kilo</option>
                    <option value="GRAMO">Gramo</option>
                    <option value="LITRO">Litro</option>
                    <option value="UNID">Unidad (Unid)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del Producto</label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Image className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-primary hover:underline"
                  >
                    Seleccionar imagen
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}