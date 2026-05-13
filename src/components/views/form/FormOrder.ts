import { IBuyer } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";

export type TFormOrder = Pick<IBuyer, "payment" | "address">;

export class FormOrder extends Form<TFormOrder> {
  protected buttonPayOnline: HTMLButtonElement;
  protected buttonPayCash: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.buttonPayOnline = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this.buttonPayCash = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );

    this.buttonPayOnline.addEventListener("click", () => {
      this.events.emit(`${this.formElement.name}:change`, {payment: "card"});
    });
    this.buttonPayCash.addEventListener("click", () => {
      this.events.emit(`${this.formElement.name}:change`, {payment: "cash"});
    });
  }

  set payment(pay: "card" | "cash" | null) {
    this.buttonPayOnline.classList.toggle("button_alt-active", pay === "card");
    this.buttonPayCash.classList.toggle("button_alt-active", pay === "cash");
  }

   set address(address: string) {
    const input = ensureElement<HTMLInputElement>('[name="address"]', this.container);
      input.value = address;
   }
}
