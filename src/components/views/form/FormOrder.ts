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
      this.selectPay("card");
    });
    this.buttonPayCash.addEventListener("click", () => {
      this.selectPay("cash");
    });
  }

  private selectPay(pay: "card" | "cash"): void {
    this.buttonPayOnline.classList.toggle("button_alt-active", pay === "card");
    this.buttonPayCash.classList.toggle("button_alt-active", pay === "cash");
    this.events.emit(`${this.formElement.name}:change`, this.takeData());
  }

  protected takeData(): Partial<TFormOrder> {
    const objData = super.takeData() as Partial<TFormOrder>;
    let pay: "card" | "cash" | null = null;
    if (this.buttonPayOnline.classList.contains("button_alt-active")) {
      pay = "card";
    } else if (this.buttonPayCash.classList.contains("button_alt-active")) {
      pay = "cash";
    }
    objData.payment = pay;
    return objData;
  }
}
