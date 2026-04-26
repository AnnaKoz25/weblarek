import { IProduct } from "../../types";

export class Products {
  private productsArray: IProduct[];
  private selectedProduct: IProduct | null;

  constructor() {
    this.productsArray = [];
    this.selectedProduct = null;
  }

  setProducts(products: IProduct[]): void {
    this.productsArray = products;
  }

  getProducts(): IProduct[] {
    return this.productsArray;
  }

  getProductById(id: string): IProduct | undefined {
    return this.productsArray.find((product) => product.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
