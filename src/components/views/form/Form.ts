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
      const submitData = this.takeData();
      this.events.emit(`${this.formElement.name}:submit`, submitData);
    });

    this.inputElements.forEach((field) => {
      field.addEventListener("input", () => {
        const actualData = this.takeData();
        this.events.emit(`${this.formElement.name}:change`, actualData);
      });
    });
  }

  protected takeData(): Partial<T> {
    const inputData: Record<string, string> = {};
    this.inputElements.forEach((element) => {
      if (element.name) {
        inputData[element.name] = element.value;
      }
    });
    return inputData as Partial<T>;
  }

  set err(value: string) {
    this.errorElement.textContent = value + " ";
  }

  set enableButton(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }
}
