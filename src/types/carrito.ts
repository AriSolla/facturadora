import type { Producto } from '@/data/productos';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}