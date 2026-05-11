import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  basketPrice: number;
}

export class Basket extends Component<IBasket> {
  protected basketPriceElement: HTMLElement;
  protected orderButtonElement: HTMLButtonElement;
  protected basketListElement: HTMLElement; //для списка товаров в корзине

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this.basketPriceElement = ensureElement<HTMLElement>(".basket__price", this.container);
    this.orderButtonElement = ensureElement<HTMLButtonElement>(".basket__button", this.container);
    this.basketListElement = ensureElement<HTMLElement>(".basket__list", this.container);

    this.orderButtonElement.addEventListener("click", () => {
      this.events.emit("basket:order");
    });
  }

  set basketPrice(value: number) {
    this.basketPriceElement.textContent = `${value} синапсов`;
  }

  setListItems(cards: HTMLElement[]): void { //заменяет содержимое списка корзины
    this.basketListElement.innerHTML = "";
    cards.forEach(card => this.basketListElement.appendChild(card));
  }

  set orderButtonEnabled(enable: boolean) { //блокировка кнопки оформления
    this.orderButtonElement.disabled = !enable;
  }
}
