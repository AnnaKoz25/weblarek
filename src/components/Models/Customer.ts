import { IBuyer } from "../../types";
import { TPayment, TBuyerErrors } from "../../types";
import { IEvents } from "../base/Events";

export class Customer {
  private payment: TPayment | null;
  private address: string;
  private phone: string;
  private email: string;
  private events?: IEvents;

  constructor(events?: IEvents) {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
    this.events = events;
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events?.emit("customer:change", {payment})
  }

  setAddress(address: string): void {
    this.address = address;
    this.events?.emit("customer:change", {address})
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events?.emit("customer:change", {phone})
  }

  setEmail(email: string): void {
    this.email = email;
    this.events?.emit("customer:change", {email})
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
    this.events?.emit("customer:change", {
      payment: null,
      address: "",
      phone: "",
      email: ""
    })
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
