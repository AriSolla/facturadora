import { useState } from 'react';
import { productos, type Producto } from '@/data/productos';
import type { ItemCarrito } from '@/types/carrito';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus, Search, ShoppingCart } from 'lucide-react';

export function POS() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [busqueda, setBusqueda] = useState('');

  // Buscar producto por código o nombre
  const buscarProducto = (query: string) => {
    return productos.find(
      p => p.codigo === query || p.nombre.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Agregar producto al carrito
  const agregarAlCarrito = (producto: Producto) => {
    const itemExistente = carrito.find(item => item.producto.id === producto.id);
    
    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.producto.id === producto.id
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
      if (item.producto.id === productoId) {
        const nuevaCantidad = item.cantidad + delta;
        return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : item;
      }
      return item;
    }).filter(item => item.cantidad > 0));
  };

  // Eliminar del carrito
  const eliminarDelCarrito = (productoId: string) => {
    setCarrito(carrito.filter(item => item.producto.id !== productoId));
  };

  // Calcular totales
  const subtotal = carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  // Finalizar compra
  const finalizarCompra = () => {
    if (carrito.length === 0) return;
    alert(`Total a cobrar: $${subtotal.toFixed(2)}\nProductos: ${totalItems}`);
    setCarrito([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-48">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            🛒 POS
          </h1>
          
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
              <Card key={item.producto.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-base text-slate-900">
                        {item.producto.nombre}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        ${item.producto.precio.toFixed(2)} c/u
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0"
                      onClick={() => eliminarDelCarrito(item.producto.id)}
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
                        onClick={() => cambiarCantidad(item.producto.id, -1)}
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
                        onClick={() => cambiarCantidad(item.producto.id, 1)}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    {/* Subtotal del item */}
                    <Badge 
                      variant="secondary" 
                      className="text-lg px-4 py-2 font-bold"
                    >
                      ${(item.producto.precio * item.cantidad).toFixed(2)}
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