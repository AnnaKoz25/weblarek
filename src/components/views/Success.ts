import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface ISuccess {
  totalPrice: number;
}

export class Success extends Component<ISuccess> {
  protected successDescriptionElement: HTMLElement;
  protected successButtonClose: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);
    this.successDescriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.successButtonClose = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
    this.successButtonClose.addEventListener("click", () => {
        this.events.emit("modal:close");
    })
  }

  set totalPrice(value: number) {
    this.successDescriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
