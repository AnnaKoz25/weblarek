import { ensureAllElements, ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export abstract class Form<T extends object = object> extends Component<T> {
  protected formElement: HTMLFormElement;
  protected buttonSubmit: HTMLButtonElement;
  protected errorElement: HTMLElement;
  protected inputElements: HTMLInputElement[];

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.formElement = container as HTMLFormElement;
    this.buttonSubmit = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
    this.errorElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );
    this.inputElements = ensureAllElements<HTMLInputElement>(
      "input",
      this.container,
    );

    this.formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit(`${this.formElement.name}:submit`);
    });

    this.inputElements.forEach((field) => {
      field.addEventListener("input", (el) => {
        const target = el.target as HTMLInputElement;//привели к типу инпута
        const { name, value } = target;//значение атрибута и текущий текст
        if(name) {
          this.events.emit(`${this.formElement.name}:change`, {[name]: value}); // приводим к обекту, ключ - имя поля, значение - содержимое поля
        }
      });
    });
  }

  set err(value: string) {
    this.errorElement.textContent = value + " ";
  }

  set enableButton(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }
}
