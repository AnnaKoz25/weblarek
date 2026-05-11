import { ensureElement } from "../../../utils/utils";
import { Card, TCard } from "./Card";

export type TCardBasket = TCard & { index: number };

interface IBasketActions {
  onRemoveFromBasket: () => void;
}

export class CardBasket extends Card<TCardBasket> {
  protected numberInBasket: HTMLElement;
  protected buttonRemove: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);
    this.numberInBasket = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.buttonRemove = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    if (actions?.onRemoveFromBasket) {
      this.buttonRemove.addEventListener("click", actions.onRemoveFromBasket);
    }
  }

  set index(value: number) {
    this.numberInBasket.textContent = String(value);
  }
}
