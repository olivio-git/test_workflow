export const PRODUCT_ENDPOINTS = {
    all: "/products",
    byId: (producto: string | number) => `/products/${producto}`,
    update: (producto: string | number) => `/products/${producto}`,
    delete: (producto: string | number) => `/products/${producto}`,
    stockDetails: `/products/stocks`,
    providerOrders: `/products/prov-orders`,
    twoYearsSales: `/products/two-years-sales`,
};
