import { IApi } from "../../types";
import { IOrderRequest, IOrderResult, IProduct, IAllProductsResult } from "../../types";

export class BusinessApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getAllProducts(): Promise<IProduct[]> {
    return this.api.get<IAllProductsResult>('/product/').then(result => result.items);
  }

  postOrder(orderInfo: IOrderRequest): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order/', orderInfo);
  }
}
