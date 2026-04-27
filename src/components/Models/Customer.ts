import { IBuyer } from "../../types";
import { TPayment, TBuyerErrors } from "../../types";

export class Customer {
  private payment: TPayment | null;
  private address: string;
  private phone: string;
  private email: string;

  constructor() {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
  }

  setAddress(address: string): void {
    this.address = address;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getAllData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clearCustomerInfo(): void {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  validateField(): TBuyerErrors {
    const errorObj: TBuyerErrors = {};
    if (!this.payment) {
      errorObj.payment = "Не выбран вид оплаты";
    }
    if (!this.address) {
      errorObj.address = "Укажите адрес доставки"
    }
    if (!this.phone) {
      errorObj.phone = "Укажите номер телефона"
    }
    if (!this.email) {
      errorObj.email = "Укажите электронную почту"
    }
    return errorObj;
  }
}
