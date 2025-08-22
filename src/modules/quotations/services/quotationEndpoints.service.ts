export const QUOTATION_ENDPOINTS = {
    all: "/quotations",
    create: "/quotations",
    byId: (cotizacion: string | number) => `/quotations/${cotizacion}`,
    update: (cotizacion: string | number) => `/quotations/${cotizacion}`,
    delete: (cotizacion: string | number) => `/quotations/${cotizacion}`,
};
