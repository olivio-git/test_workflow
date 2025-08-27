import type { ProductGet } from "@/modules/products/types/ProductGet";
import { validatePrice, validateQuantity } from "../utils/validators";

export class CartValidation {
  static validateProduct(product: ProductGet): boolean {
    return !!(
      product.id &&
      product.descripcion &&
      validatePrice(product.precio_venta)
    );
  }

  static validateAddItem(product: ProductGet, quantity?: number): boolean {
    if (!this.validateProduct(product)) return false;
    if (quantity !== undefined && !validateQuantity(quantity)) return false;
    return true;
  }

  static validateUserId(user: string): boolean {
    return typeof user === 'string' && user.trim().length > 0;
  }
}