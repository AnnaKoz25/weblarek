import { IApi } from "../../types";
import { IOrderRequest, IOrderResult, IProduct, IAllProductsResult } from "../../types";

export class BusinessApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getAllProducts(): Promise<IAllProductsResult> {
    return this.api.get<IAllProductsResult>('/product/');
  }

  postOrder(orderInfo: IOrderRequest): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order/', orderInfo);
  }
}
