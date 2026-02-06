export interface Producto {
  no_plu: string; // plu
  c_plu: string; //nombre producto
  c_desc: string; //descripcion producto
  no_dept: number; //numbero de departamento
  n_iva: number; // Codigo iva
  n_tasa: number; // % IVA ()
  no_unid: string; //Unidad (G, KG, etc)
  q_unidad: number; //cantidad unidad
  p_venta: number; //precio
  p_oferta: number; //oferta
  tModi: string; // ultima fecha modificada
}