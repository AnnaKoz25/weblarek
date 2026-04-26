import { IBuyer } from "../../types";
import { TPayment } from "../../types";

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

  validateField(
    value: string | null,
    fieldName: string,
  ): { isValid: boolean; errorMessage: string } {
    let errorText: string = "";
    let isEmpty = value === null || value === "";
    switch (fieldName) {
      case "payment":
        errorText = "Не выбран вид оплаты";
        break;
      case "address":
        errorText = "Укажите адрес доставки";
        break;
      case "phone":
        errorText = "Укажите номер телефона";
        break;
      case "email":
        errorText = "Укажите адрес электронной почты";
        break;
    }
    return {
      isValid: !isEmpty,
      errorMessage: isEmpty ? errorText : "",
    };
  }
}
