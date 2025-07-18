import { useMemo } from "react";
import { CartManager } from "../services/cartManager";

export const useCartStore = (user: string) => {
    const store = useMemo(() => {
        return CartManager.getInstance().getStore(user);
    }, [user]);

    return store;
};
