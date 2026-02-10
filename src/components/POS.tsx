import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { AppHeaderWithBack } from '@/components/AppHeaderWithBack';
import type { Producto } from '@/data/productos';
import type { ItemCarrito } from '@/types/carrito';
import { useState } from 'react';
import { buscarProductoLocal } from '@/services/productosLocal';


export function POS() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [busqueda, setBusqueda] = useState('');

  // Buscar producto por código o nombre
  const buscarProducto = async (codigo: string) => {
    if (!codigo.trim()) return;

    const producto = await buscarProductoLocal(codigo.trim());

    if (!producto) {
      alert('Producto no encontrado');
      return;
    }

    agregarAlCarrito(producto);
  };
  const handleBuscar = async () => {
    alert(busqueda)
    if (!busqueda.trim()) return;
    await buscarProducto(busqueda.trim());
  };



  // Agregar producto al carrito
  const agregarAlCarrito = (producto: Producto) => {
    setCarrito(prev => {
      const itemExistente = prev.find(
        item => item.producto.no_plu === producto.no_plu
      );

      if (itemExistente) {
        return prev.map(item =>
          item.producto.no_plu === producto.no_plu
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prev, { producto, cantidad: 1 }];
    });

    setBusqueda('');
  };


  // Cambiar cantidad
  const cambiarCantidad = (productoId: string, delta: number) => {
    setCarrito(prev =>
      prev
        .map(item => {
          if (item.producto.no_plu === productoId) {
            const nuevaCantidad = item.cantidad + delta;
            return nuevaCantidad > 0
              ? { ...item, cantidad: nuevaCantidad }
              : null;
          }
          return item;
        })
        .filter(Boolean) as ItemCarrito[]
    );
  };


  // Eliminar del carrito
  const eliminarDelCarrito = (productoId: string) => {
    setCarrito(prev =>
      prev.filter(item => item.producto.no_plu !== productoId)
    );
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

  return (
    <div className="min-h-screen bg-slate-50 pb-48">
      <AppHeaderWithBack title="Punto de venta" />

      <div className="p-5 space-y-4">

        {/* INPUT ESCÁNER / BÚSQUEDA */}
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleBuscar();
            }
          }}
          placeholder="Escanear o ingresar código"
          className="w-full h-12 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-400"
        />

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          {/* HEADER FIJO */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-100 text-xs font-semibold text-slate-600 sticky top-0 z-10">
            <div className="col-span-5">Desc.</div>
            <div className="col-span-2 text-center">P. Unit.</div>
            <div className="col-span-2 text-center">Cant</div>
            <div className="col-span-3 text-right">TOTAL</div>
          </div>

          {/* BODY SCROLLEABLE */}
          <div className="max-h-[60vh] overflow-y-auto">
            {carrito.map((item) => (
              <div
                key={item.producto.no_plu}
                className="grid grid-cols-12 gap-2 px-4 py-4 border-t items-center"
              >
                {/* DESCRIPCIÓN */}
                <div className="col-span-5">
                  <p className="font-medium text-slate-900">
                    {item.producto.c_plu}
                  </p>
                </div>

                {/* PRECIO UNIT */}
                <div className="col-span-2 text-center text-slate-700">
                  ${item.producto.p_venta}
                </div>

                {/* CANTIDAD */}
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() =>
                      cambiarCantidad(item.producto.no_plu, -1)
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="font-bold w-6 text-center">
                    {item.cantidad}
                  </span>

                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() =>
                      cambiarCantidad(item.producto.no_plu, 1)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* TOTAL */}
                <div className="col-span-3 flex items-center justify-end gap-2">
                  <Badge variant="secondary" className="text-base">
                    ${item.producto.p_venta * item.cantidad}
                  </Badge>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500"
                    onClick={() =>
                      eliminarDelCarrito(item.producto.no_plu)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {carrito.length === 0 && (
              <div className="p-6 text-center text-slate-400">
                No hay productos cargados
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER DE PAGO */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="p-4 space-y-3">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Productos: {totalItems}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500"
              onClick={() => setCarrito([])}
            >
              Limpiar todo
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">TOTAL:</span>
            <span className="text-3xl font-bold">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <Button
            className="w-full h-16 text-xl font-bold"
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
