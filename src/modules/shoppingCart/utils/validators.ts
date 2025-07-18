import { CART_CONSTANTS } from "../constants/cart.constants";

export const validateQuantity = (quantity: number): boolean => {
    return quantity >= CART_CONSTANTS.MIN_QUANTITY &&
        quantity <= CART_CONSTANTS.MAX_QUANTITY;
};

export const validatePrice = (price: number): boolean => {
    return price >= 0 && isFinite(price);
};

export const validateDiscountPercent = (percent: number): boolean => {
    return percent >= CART_CONSTANTS.MIN_DISCOUNT_PERCENT &&
        percent <= CART_CONSTANTS.MAX_DISCOUNT_PERCENT;
};

export const validateUserId = (user: string): boolean => {
    return user ? user.trim().length > 0 : false;
};