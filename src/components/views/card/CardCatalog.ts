import { IProduct } from "../../../types";
import { Card } from "./Card";
import { TCard } from "./Card";

interface ICardActions {
  onClick: () => void;
}

export type TCardCatalog = TCard & Pick<IProduct, "image" | "category">;

export class CardCatalog extends Card<TCardCatalog> {

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }
}
