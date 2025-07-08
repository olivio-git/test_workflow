export interface ProductGet {
    id: number;
    descripcion: string;
    codigo_oem: string;
    codigo_upc: string;
    modelo: string | null;
    medida: string | null;
    nro_motor: string;
    categoria: string;
    subcategoria: string;
    marca: string;
    procedencia: string;
    unidad_medida: string;
    stock_actual: string;
    stock_resto: string;
    pedido_transito: string;
    pedido_almacen: string;
    precio_venta: string;
    precio_venta_alt: string;
    sucursal: string;
}