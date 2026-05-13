import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IProduct } from "../../../types";
import { TCard } from "./Card";


export type TCardCatalog = TCard & Pick<IProduct, "image" | "category">;

export abstract class CardCatalogAndPreview extends Card<TCardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement) {
  super(container);
  this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
  this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
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