export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Debt Manager</h1>
        <p className="text-gray-600 mb-8">Sistema de gestión de tienda</p>
        <div className="space-y-4">
          <a href="/admin/productos" className="block p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Panel de Admin - Inventario
          </a>
          <a href="/admin/qrcode" className="block p-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Panel de Admin - Validar QR
          </a>
          <a href="/superadmin/productos-globales" className="block p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            SuperAdmin - Productos Globales
          </a>
          <a href="/carrito" className="block p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Carrito Cliente
          </a>
        </div>
      </div>
    </div>
  );
}