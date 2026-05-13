import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected modalContainer: HTMLElement;
  protected modalButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);
    this.modalContainer = ensureElement<HTMLElement>(".modal__content", this.container);
    this.modalButton = ensureElement<HTMLButtonElement>(".modal__close", this.container);

    this.modalButton.addEventListener("click", () => {
      this.close();
    });

    this.container.addEventListener('click', (out) => {
      if(out.target === this.container) {
        this.close();
      }
    });
  }

  set content(contentElement: HTMLElement) {
    this.modalContainer.innerHTML = "";
    this.modalContainer.appendChild(contentElement);
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.modalContainer.innerHTML = "";
    this.events.emit("modal:close")
  }
}
