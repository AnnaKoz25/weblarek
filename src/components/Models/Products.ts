import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
  private productsArray: IProduct[];
  private selectedProduct: IProduct | null;
  private events?: IEvents;

  constructor(events?: IEvents) {
    this.productsArray = [];
    this.selectedProduct = null;
    this.events = events;
  }

  setProducts(products: IProduct[]): void {
    this.productsArray = products;
    this.events?.emit("catalog:change", {items: this.productsArray})
  }

  getProducts(): IProduct[] {
    return this.productsArray;
  }

  getProductById(id: string): IProduct | undefined {
    return this.productsArray.find((product) => product.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.events?.emit("selectProduct:change", { product })
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
