import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { categoryMap, CDN_URL } from "../../../utils/constants";

export type TCard = Pick<IProduct, "title" | "price">;

export abstract class Card<T extends TCard = TCard> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected imageElement?: HTMLImageElement;
  protected categoryElement?: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );

    if(this.container.querySelector(".card__image")) {
      this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    }
    if(this.container.querySelector(".card__category")) {
      this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container)
    }
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    value === null ? this.priceElement.textContent = 'Бесценно' : this.priceElement.textContent = String(value) + " синапсов";
  }

  set image(value: string) {
    if (this.imageElement) {
      this.setImage(this.imageElement, CDN_URL + value, this.title);
    }
  }

  set category(value: string) {
    if (this.categoryElement) {
      this.categoryElement.textContent = value;
      for (const [key, classTitle] of Object.entries(categoryMap)) {
        this.categoryElement.classList.toggle(classTitle, key === value);
      }
    }
  }
}
