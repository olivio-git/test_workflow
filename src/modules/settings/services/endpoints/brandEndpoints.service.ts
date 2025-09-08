export const BRAND_ENDPOINTS = {
    all: "/brands",
    create: "/brands",
    byId: (marca: string | number) => `/brands/${marca}`,
    update: (id_marca: string | number) => `/brands/${id_marca}`,
    delete: (id_marca: string | number) => `/brands/${id_marca}`,
};