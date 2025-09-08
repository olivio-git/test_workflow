export const VEHICLE_BRAND_ENDPOINTS = {
    all: "/vehiclebrands",
    create: "/vehiclebrands",
    byId: (marca_vehiculo: string | number) => `/vehiclebrands/${marca_vehiculo}`,
    update: (id_marca_vehiculo: string | number) => `/vehiclebrands/${id_marca_vehiculo}`,
    delete: (id_marca_vehiculo: string | number) => `/vehiclebrands/${id_marca_vehiculo}`,
};