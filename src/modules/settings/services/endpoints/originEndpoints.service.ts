export const ORIGIN_ENDPOINTS = {
    all: "/origins",
    create: "/origins",
    byId: (procedencia: string | number) => `/origins/${procedencia}`,
    update: (id_procedencia: string | number) => `/origins/${id_procedencia}`,
    delete: (id_procedencia: string | number) => `/origins/${id_procedencia}`,
};