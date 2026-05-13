import { IBuyer } from "../../../types";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";
import { ensureElement } from "../../../utils/utils";


export type TFormContacts = Pick<IBuyer, "phone" | "email">;

export class FormContacts extends Form<TFormContacts> {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
  }

  set phone(phone: string) {
    const input = ensureElement<HTMLInputElement>('[name="phone"]', this.container);
    input.value = phone;
  }

  set email(email: string) {
    const input = ensureElement<HTMLInputElement>('[name="email"]', this.container);
    input.value = email;
  }
}
