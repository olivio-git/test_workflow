export const PRODUCT_ENDPOINTS = {
    all: "/products",
    byId: (producto: string | number) => `/products/${producto}`,
}