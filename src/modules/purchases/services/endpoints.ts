export const PURCHASE_ENDPOINTS = {
    all: "/purchases",
    byId: (id: number) => `/purchases/${id}`,
    update: (id: number) => `/purchases/${id}`,
    delete: (id: number) => `/purchases/${id}`,
    providers: "/products/purchases/commons/providers",
} as const;
