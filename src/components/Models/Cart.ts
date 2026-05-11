import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  private purchasesArray: IProduct[];
  private events?: IEvents;

  constructor(events?: IEvents) {
    this.purchasesArray = [];
    this.events = events;
  }

  getCartItems(): IProduct[] {
    return this.purchasesArray;
  }

  addToCart(product: IProduct): void {
    if (product.price !== null) {
      this.purchasesArray.push(product);
      this.events?.emit("cart:change", {
        items: this.purchasesArray,
        total: this.getTotalPrice(),
      });
    }
  }

  removeFromCart(productId: string): void {
    const arrayLength = this.purchasesArray.length;
    this.purchasesArray = this.purchasesArray.filter(
      (item) => item.id !== productId,
    );
    
    if (arrayLength !== this.purchasesArray.length) {
      this.events?.emit("cart:change", {
        items: this.purchasesArray,
        total: this.getTotalPrice(),
      });
    }
  }

  clearCart(): void {
    this.purchasesArray = [];
    this.events?.emit("cart:change", { items: this.purchasesArray, total: this.getTotalPrice() });
  }

  getTotalPrice(): number {
    return this.purchasesArray.reduce(
      (total, item) => total + (item.price || 0),
      0,
    );
  }

  getQuantityItems(): number {
    return this.purchasesArray.length;
  }

  isInCart(productId: string): boolean {
    return this.purchasesArray.some((elem) => productId === elem.id);
  }
}
