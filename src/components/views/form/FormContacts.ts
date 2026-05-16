import { IBuyer } from "../../../types";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";
import { ensureElement } from "../../../utils/utils";


export type TFormContacts = Pick<IBuyer, "phone" | "email">;

export class FormContacts extends Form<TFormContacts> {
  protected phoneInput: HTMLInputElement;
  protected emailInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this.container);
    this.emailInput = ensureElement<HTMLInputElement>('[name="email"]', this.container);
  }

  set phone(phone: string) {
    this.phoneInput.value = phone;
  }

  set email(email: string) {
    this.emailInput.value = email;
  }
}
