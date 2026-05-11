import { IBuyer } from "../../../types";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";

export type TFormContacts = Pick<IBuyer, "phone" | "email">;

export class FormContacts extends Form<TFormContacts> {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
  }
}
