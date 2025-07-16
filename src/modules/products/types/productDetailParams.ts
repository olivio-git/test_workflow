export interface BaseProductParams {
    producto: number | string;
    sucursal: number;
}

export interface StockParams extends BaseProductParams {
    resto_only: number;
}

export interface SalesParams extends BaseProductParams {
    gestion_1: number;
    gestion_2: number;
}

export interface ProvOrdersParams extends BaseProductParams { }
