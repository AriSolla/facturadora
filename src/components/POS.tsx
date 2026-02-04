import { useState } from 'react';
import { type Producto } from '@/data/productos';
import type { ItemCarrito } from '@/types/carrito';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus, Search, ShoppingCart, Loader2 } from 'lucide-react';
import { ping } from '@/services/ping';
import { getProductos } from '@/services/productos'
import React from 'react';

export function POS() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [pingStatus, setPingStatus] = useState<string>('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Cargar productos al montar el componente
  React.useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        const data = await getProductos(); // Ya viene formateado como Producto[]
        setProductos(data);
        setError(null);
      } catch (err) {
        console.error('Error cargando productos:', err);
        setError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  // Buscar producto por código o nombre
  const buscarProducto = (query: string) => {
    return productos.find(
      p => p.no_plu === query || p.c_plu.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Agregar producto al carrito
  const agregarAlCarrito = (producto: Producto) => {
    const itemExistente = carrito.find(item => item.producto.no_plu === producto.no_plu);

    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.producto.no_plu === producto.no_plu
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { producto, cantidad: 1 }]);
    }
    setBusqueda('');
  };

  // Manejar el Enter o búsqueda
  const handleBuscar = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && busqueda.trim()) {
      const producto = buscarProducto(busqueda);
      if (producto) {
        agregarAlCarrito(producto);
      }
    }
  };

  // Cambiar cantidad
  const cambiarCantidad = (productoId: string, delta: number) => {
    setCarrito(carrito.map(item => {
      if (item.producto.no_plu === productoId) {
        const nuevaCantidad = item.cantidad + delta;
        return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : item;
      }
      return item;
    }).filter(item => item.cantidad > 0));
  };

  // Eliminar del carrito
  const eliminarDelCarrito = (productoId: string) => {
    setCarrito(carrito.filter(item => item.producto.no_plu !== productoId));
  };

  // Calcular totales
  const subtotal = carrito.reduce((sum, item) => sum + (item.producto.p_venta * item.cantidad), 0);
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  // Finalizar compra
  const finalizarCompra = () => {
    if (carrito.length === 0) return;
    alert(`Total a cobrar: $${subtotal.toFixed(2)}\nProductos: ${totalItems}`);
    setCarrito([]);
  };
  const testPing = async () => {
    setPingStatus('Conectando...');
    try {
      const result = await ping();
      setPingStatus(`✅ Conectado! ${result.message} - ${result.server_time}`);
    } catch (error) {
      setPingStatus(`❌ Error: ${error}`);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 pb-48">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            🛒 POS
          </h1>
          <Button onClick={testPing} variant="outline" className="mb-3 w-full">
            🌐 Test Conexión
          </Button>
          {pingStatus && (
            <p className="text-sm mb-3 p-2 bg-slate-100 rounded">{pingStatus}</p>
          )}

          {/* Input de scanner */}
          <div className="relative">
            <Search className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
            <Input
              placeholder="Escanea código de barras..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={handleBuscar}
              className="pl-14 text-lg h-14 text-base"
              autoFocus
            />
          </div>
        </div>
      </div>
      {/* Estado de carga */}
      {loading && (
        <div className="p-4">
          <Card>
            <CardContent className="py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-slate-400" />
              <p className="text-slate-600">Cargando productos...</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-4">
              <p className="text-red-600 text-center">❌ {error}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* productos */}
      <div className="p-4">
        {carrito.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="py-12">
              <div className="text-center text-slate-500">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Carrito vacío</p>
                <p className="text-sm mt-2">Escanea productos para empezar</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {carrito.map((item) => (
              <Card key={item.producto.no_plu}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-base text-slate-900">
                        {item.producto.c_plu}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        ${item.producto.p_venta.toFixed(2)} c/u
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0"
                      onClick={() => eliminarDelCarrito(item.producto.no_plu)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-12 w-12 p-0"
                        onClick={() => cambiarCantidad(item.producto.no_plu, -1)}
                      >
                        <Minus className="h-5 w-5" />
                      </Button>
                      <span className="text-xl font-bold w-12 text-center">
                        {item.cantidad}
                      </span>
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-12 w-12 p-0"
                        onClick={() => cambiarCantidad(item.producto.no_plu, 1)}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Subtotal del item */}
                    <Badge
                      variant="secondary"
                      className="text-lg px-4 py-2 font-bold"
                    >
                      ${(item.producto.p_venta * item.cantidad).toFixed(2)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer fijo con total y botón cobrar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="p-4 space-y-3">
          {/* Resumen */}
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Productos: {totalItems}</span>
            {carrito.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCarrito([])}
                className="text-red-500 hover:text-red-700"
              >
                Limpiar todo
              </Button>
            )}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-slate-700">TOTAL:</span>
            <span className="text-3xl font-bold text-slate-900">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          {/* cobrar */}
          <Button
            className="w-full h-16 text-xl font-bold"
            size="lg"
            onClick={finalizarCompra}
            disabled={carrito.length === 0}
          >
            PAGAR
          </Button>
        </div>
      </div>
    </div>
  );
}