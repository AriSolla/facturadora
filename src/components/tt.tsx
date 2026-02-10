import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus } from 'lucide-react';
import { AppHeaderWithBack } from '@/components/AppHeaderWithBack';
import type { Producto } from '@/data/productos';

export function POS() {
  const productosMock: Producto[] = [
    { no_plu: '1001', c_plu: 'Coca Cola 2.25L', p_venta: 1200 } as Producto,
    { no_plu: '1002', c_plu: 'Pan Lactal', p_venta: 800 } as Producto,
    { no_plu: '1003', c_plu: 'Leche Entera', p_venta: 650 } as Producto,
    { no_plu: '1004', c_plu: 'Azúcar 1kg', p_venta: 900 } as Producto,
    { no_plu: '1005', c_plu: 'Yerba Mate', p_venta: 1800 } as Producto,
    { no_plu: '1006', c_plu: 'Fideos', p_venta: 750 } as Producto,
    { no_plu: '1007', c_plu: 'Aceite 900ml', p_venta: 2200 } as Producto,
    { no_plu: '1008', c_plu: 'Arroz 1kg', p_venta: 1100 } as Producto,
    { no_plu: '1009', c_plu: 'Galletitas', p_venta: 950 } as Producto,
    { no_plu: '1010', c_plu: 'Jabón en Polvo', p_venta: 3200 } as Producto,
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-48">
      <AppHeaderWithBack title="Punto de venta" />

      <div className="p-5">
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          {/* HEADER FIJO */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-100 text-xs font-semibold text-slate-600 sticky top-0 z-10">
            <div className="col-span-5">DESCRIPCIÓN</div>
            <div className="col-span-2 text-center">PRECIO UNIT</div>
            <div className="col-span-2 text-center">CANTIDAD</div>
            <div className="col-span-3 text-right">TOTAL</div>
          </div>

          {/* BODY SCROLLEABLE */}
          <div className="max-h-[60vh] overflow-y-auto">
            {productosMock.map((producto) => (
              <div
                key={producto.no_plu}
                className="grid grid-cols-12 gap-2 px-4 py-4 border-t items-center"
              >
                {/* DESCRIPCIÓN */}
                <div className="col-span-5">
                  <p className="font-medium text-slate-900">
                    {producto.c_plu}
                  </p>
                </div>

                {/* PRECIO UNIT */}
                <div className="col-span-2 text-center text-slate-700">
                  ${producto.p_venta}
                </div>

                {/* CANTIDAD */}
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <Button size="icon" variant="outline" className="h-8 w-8">
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="font-bold w-6 text-center">
                    2
                  </span>

                  <Button size="icon" variant="outline" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* TOTAL */}
                <div className="col-span-3 flex items-center justify-end">
                  <Badge variant="secondary" className="text-base">
                    ${producto.p_venta * 2}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER DE PAGO */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="p-4 space-y-3">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Productos: 3</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500"
            >
              Limpiar todo
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">TOTAL:</span>
            <span className="text-3xl font-bold">$5.800</span>
          </div>

          <Button className="w-full h-16 text-xl font-bold">
            PAGAR
          </Button>
        </div>
      </div>
    </div>
  );
}