import { ensureElement } from "../../../utils/utils";
import { CardCatalogAndPreview } from "./CardCatalogAndPreview";

export class CardPreview extends CardCatalogAndPreview {
  protected descriptionElement: HTMLElement;
  protected buyButtonElement: HTMLButtonElement;
  private currentHandler?: () => void;

  constructor(container: HTMLElement) {
    super(container);
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.buyButtonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  setButton(text: string, disabled: boolean, onClick?: () => void) { //для динамического изменнения кнопки в окне предпросмотра
    this.buyButtonElement.textContent = text;
    this.buyButtonElement.disabled = disabled;
    if (this.currentHandler) {
      this.buyButtonElement.removeEventListener("click", this.currentHandler)//если обработчик был, надо удалить, т.к. при каждом клике будем добавлять новый обработчик
    }
    if(onClick) { //если новый обработчик передан
      this.buyButtonElement.addEventListener("click", onClick) //добавляем его (новый обработчик)
      this.currentHandler = onClick;
    } else {
      this.currentHandler = undefined;
    }
  }
}
