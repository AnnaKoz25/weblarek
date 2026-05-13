import { CardCatalogAndPreview } from "./CardCatalogAndPreview";


interface ICardActions {
  onClick: () => void;
}

export class CardCatalog extends CardCatalogAndPreview {

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }
}
