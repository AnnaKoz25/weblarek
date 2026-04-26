import { IProduct } from "../../types";

export class Cart {
  private purchasesArray: IProduct[];

  constructor() {
    this.purchasesArray = [];
  }

  getCartItems(): IProduct[] {
    return this.purchasesArray;
  }

  addToCart(product: IProduct): void {
    if (product.price !== null) {
      this.purchasesArray.push(product);
    }
  }

  removeFromCart(productId: string): void {
    this.purchasesArray = this.purchasesArray.filter(
      (item) => item.id !== productId,
    );
  }

  clearCart(): void {
    this.purchasesArray = [];
  }

  getTotalPrice(): number {
    return this.purchasesArray.reduce((total, item) => total + (item.price || 0), 0);
  }

  getQuantityItems(): number {
    return this.purchasesArray.length;
  }

  isInCart(productId: string): boolean {
    return this.purchasesArray.some((elem) => productId === elem.id);
  }
}
