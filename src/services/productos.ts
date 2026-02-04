import type { Producto } from "@/data/productos";
import { fetchAPI } from "./api";
import { IBUSINESS } from "@/config/constants";
import { safeParseFloat, safeParseInt } from "@/utils/parsers";

export async function getProductos(): Promise<Producto[]> {
    try {
        const data = await fetchAPI('allProducts.php', { ibusiness: IBUSINESS });

        if (data.status === 'success') {
            return data.data.map((p: any) => ({
                no_plu: p.no_plu,
                c_plu: p.c_plu,
                c_desc: p.c_desc,
                no_dept: safeParseInt(p.no_dept),
                n_iva: parseInt(p.n_iva),
                n_tasa: safeParseFloat(p.n_tasa),
                no_unid: p.no_unid,
                q_unidad: parseFloat(p.q_unidad),
                p_venta: safeParseFloat(p.p_venta),
                p_oferta: parseFloat(p.p_oferta),
                tModi: p.tModi
            }));
        } else {
            throw new Error(data.message || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        throw error;
    }
}