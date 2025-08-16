export const SALE_ENDPOINTS = {
    all: "/sales",
    create: "/sales",
    byId: (venta: string | number) => `/sales/${venta}`,
    update: (venta: string | number) => `/sales/${venta}`,
    delete: (venta: string | number) => `/sales/${venta}`,
};
