import { CART_CONSTANTS } from "@/modules/shoppingCart/constants/cart.constants";
import type { StoreItem } from "../types/cart.types";

export class CartStorage {
  private static getStorageKey(userId: string): string {
    return `${CART_CONSTANTS.STORAGE_PREFIX}${userId}`;
  }

  static getItem(userId: string): string | null {
    if (typeof window === 'undefined') return null;

    try {
      return sessionStorage.getItem(this.getStorageKey(userId));
    } catch (error) {
      console.error('Error reading cart from sessionStorage:', error);
      return null;
    }
  }

  static setItem(userId: string, data: string): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.setItem(this.getStorageKey(userId), data);
    } catch (error) {
      console.error('Error saving cart to sessionStorage:', error);
    }
  }

  static removeItem(userId: string): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.removeItem(this.getStorageKey(userId));
    } catch (error) {
      console.error('Error removing cart from sessionStorage:', error);
    }
  }

  static clearAllCarts(): void {
    if (typeof window === 'undefined') return;

    try {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(CART_CONSTANTS.STORAGE_PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing all carts:', error);
    }
  }

  static getUserCartData(userId: string): StoreItem | null {
    const data = this.getItem(userId);
    if (!data) return null;

    try {
      return JSON.parse(data).state;
    } catch (error) {
      console.error('Error parsing cart data:', error);
      return null;
    }
  }
}