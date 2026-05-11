import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IGalleryData {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.catalogElement = ensureElement<HTMLElement>(
      ".gallery",
      this.container,
    );
  }

  set catalog(elements: HTMLElement[]) {
    this.catalogElement.innerHTML = ""; //перед загрузкой нового каталога нужно удалить старый
    elements.forEach((el) => {
      this.catalogElement.appendChild(el);
    });
  }
}
