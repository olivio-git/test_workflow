export interface ProductCategoria {
    id: number;
    categoria: string;
    id_estado: string;
    codigo_interno: number;
    version: number;
  }
  
  export interface ProductSubcategoria {
    id: number;
    subcategoria: string;
    id_categoria: number;
    id_estado: string;
    codigo_interno: number;
  }
  
  export interface ProductMarca {
    id: number;
    marca: string;
    id_estado: string;
    codigo_interno: number;
  }
  
  export interface ProductProcedencia {
    id: number;
    procedencia: string;
    id_estado: string;
    codigo_interno: number;
  }
  
  export interface ProductUnidadMedida {
    id: number;
    unidad_medida: string;
    id_estado: string;
    codigo_interno: number;
  }
  
  export interface ProductMarcaVehiculo {
    id: number;
    marca_vehiculo: string;
    codigo_interno: number;
    id_estado: string;
  }
  
  export interface ProductDetail {
    id: number;
    codigo_interno: number;
    descripcion: string;
    descripcion_alt: string;
    codigo_oem: string;
    codigo_upc: string;
    modelo: string | null;
    medida: string;
    nro_motor: string;
    costo_referencia: string;
    stock_minimo: string;
    precio_venta: string;
    precio_venta_alt: string;
  
    id_categoria: number;
    categoria: ProductCategoria;
  
    id_subcategora: number;
    subcategoria: ProductSubcategoria;
  
    id_marca: number;
    marca: ProductMarca;
  
    id_procedencia: number;
    procedencia: ProductProcedencia;
  
    id_unidad_medida: number;
    unidad_medida: ProductUnidadMedida;
  
    id_marca_vehiculo: number;
    marca_vehiculo: ProductMarcaVehiculo;
  }
  