export const formatCurrency = (amount: number | null | undefined, fallback = "—") => {
    if (amount == null) return fallback;
    return new Intl.NumberFormat("es-BO", {
        style: "currency",
        currency: "BOB",
        minimumFractionDigits: 2,
    }).format(amount);
};
