import { CartStorage } from './cartStorage';
import { CartValidation } from './cartValidation';
import { createCartStore, type CartStore } from '@/modules/shoppingCart/store/cartStore';

export class CartManager {
  private static instance: CartManager;
  private stores: Map<string, CartStore> = new Map();

  private constructor() { }

  static getInstance(): CartManager {
    if (!CartManager.instance) {
      CartManager.instance = new CartManager();
    }
    return CartManager.instance;
  }

  getStore(user: string): CartStore {
    if (!CartValidation.validateUserId(user)) {
      throw new Error('ID de usuario inválido');
    }

    if (!this.stores.has(user)) {
      this.stores.set(user, createCartStore(user));
    }
    return this.stores.get(user)!;
  }

  removeStore(user: string) {
    this.stores.delete(user);
    CartStorage.removeItem(user);
  }

  clearAllStores() {
    this.stores.clear();
    CartStorage.clearAllCarts();
  }

  exportUserCart(user: string) {
    const data = CartStorage.getUserCartData(user);
    if (!data) return null;

    return {
      user,
      items: data.items || [],
      discount: data.discountAmount,
      discountPercent: data.discountPercent,
      exportedAt: new Date().toISOString(),
    };
  }

  getActiveUsers(): string[] {
    return Array.from(this.stores.keys());
  }
}