import { obtenerProductosLocales } from '@/services/productosLocal';
import { useEffect, useState } from 'react';

interface Producto {
  no_plu: string;
  c_desc: string;
}

export function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const locales = await obtenerProductosLocales();
      setProductos(locales.slice(0, 10)); // 👈 SOLO 10
      setLoading(false);
    };

    cargar();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-xl font-semibold mb-2">
        POS iniciado
      </h1>

      <p className="text-sm text-muted-foreground mb-4">
        Mostrando 10 productos
      </p>

      <ul className="space-y-1 text-sm">
        {productos.map(p => (
          <li key={p.no_plu} className="border-b py-1">
            {p.c_desc}
          </li>
        ))}
      </ul>
    </div>
  );
}
