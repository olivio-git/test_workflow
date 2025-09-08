export const MEASUREMENT_ENDPOINTS = {
    all: "/measurements",
    create: "/measurements",
    byId: (unidad_medida: string | number) => `/measurements/${unidad_medida}`,
    update: (id_unidad_medida: string | number) => `/measurements/${id_unidad_medida}`,
    delete: (id_unidad_medida: string | number) => `/measurements/${id_unidad_medida}`,
};