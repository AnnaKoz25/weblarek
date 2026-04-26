import { IApi } from "../../types";
import { IOrderRequest, IOrderResult, IProduct } from "../../types";

export class BusinessApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getAllProducts(): Promise<IProduct[]> {
    return this.api.get<IProduct[]>('/product/');
  }

  postOrder(orderInfo: IOrderRequest): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order/', orderInfo);
  }
}
