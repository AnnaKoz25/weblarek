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
    let sum: number = 0;
    this.purchasesArray.forEach((elem) => {
      if (elem.price !== null) {
        sum = sum + elem.price;
      }
    });
    return sum;
  }

  getQuantityItems(): number {
    return this.purchasesArray.length;
  }

  isInCart(productId: string): boolean {
    return this.purchasesArray.some((elem) => productId === elem.id);
  }
}
