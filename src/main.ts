import "./scss/styles.scss";
import { Products } from "./components/Models/Products";
import { Cart } from "./components/Models/Cart";
import { Customer } from "./components/Models/Customer";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { BusinessApi } from "./components/Models/BusinessApi";
import { Gallery } from "./components/views/Gallery";
import { CardCatalog } from "./components/views/card/CardCatalog";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { Header } from "./components/views/Header";
import { Modal } from "./components/views/Modal";
import { CardPreview } from "./components/views/card/CardPreview";
import { IOrderRequest, IProduct } from "./types";
import { Basket } from "./components/views/Basket";
import { CardBasket } from "./components/views/card/CardBasket";
import { FormOrder } from "./components/views/form/FormOrder";
import { FormContacts } from "./components/views/form/FormContacts";
import { Success } from "./components/views/Success";
import { TFormOrder } from "./components/views/form/FormOrder";
import { TFormContacts } from "./components/views/form/FormContacts";

const events = new EventEmitter();
const products = new Products(events);
const cart = new Cart(events);
const customer = new Customer();

const api = new Api(API_URL);
const larekApi = new BusinessApi(api);

const wrapper = ensureElement<HTMLElement>(".page__wrapper"); //HTMLElement обертка, в которой ищем галерею
const gallery = new Gallery(wrapper); //нашли элемент с галереей и это объект
const header = new Header(events, wrapper);
const modalTemplate = ensureElement<HTMLElement>("#modal-container");
const modal = new Modal(events, modalTemplate);

let basketNow: Basket | null = null; //переменная состояния корзины
let basketOpen: boolean = false; //флаг - открыта/закрыта корзина

function updateBasket(): void { //функция для изменения и перерисовки списка товаров в корзине
  if(!basketNow) {
    return;
  }
  const listItems = cart.getCartItems();
  const totalPrice = cart.getTotalPrice();

  const cards = listItems.map((product, index) => { //получим массив карточек-элементов
    const template = cloneTemplate("#card-basket");
    const card = new CardBasket(template, {
      onRemoveFromBasket: () => cart.removeFromCart(product.id) //обработали удаление, передали в модели
    });
    card.title = product.title;
    card.price = product.price;
    card.index = index + 1; //карточку для отрисовки заполнили данными
    return card.render();
  })

  basketNow.setListItems(cards); //добавили получившийся массив в обертку корзины
  basketNow.basketPrice = totalPrice;
  basketNow.orderButtonEnabled = listItems.length > 0; //если корзина пуста - кнопка заблокирована
}

//каталог товаров
events.on("catalog:change", () => {
  const cardItems = products.getProducts().map((element) => {
    const card = new CardCatalog(cloneTemplate("#card-catalog"), {
        onClick: () => events.emit("card:select", element),
      },
    );
    return card.render(element);
  });
  gallery.catalog = cardItems;
});

//открытие товара в модальном окне
events.on("card:select", (product: IProduct) => {
  const previewTemplate = cloneTemplate('#card-preview');
  const preview = new CardPreview(previewTemplate);//экземпляр предпросмотра
  preview.title = product.title;
  preview.price = product.price
  preview.image = product.image
  preview.category = product.category
  preview.description = product.description //передали данные из модели в представления

  const updateButton = () => { //динамическое изменение состояния кнопки !ФУНКЦИЯ!
    if(product.price === null) { // если цены нет - 
      preview.setButton("Недоступно", true) //кнопка заблокирована
    } else {
      if(cart.isInCart(product.id)) { //если товар в корзине - 
        preview.setButton("Удалить из корзины", false, () => { //меняем кнопку и если по измененной кнопке клик - 
          cart.removeFromCart(product.id) //удаляем товар в моделях 
          modal.close(); //закрываем модалку
        })
      } else {
        preview.setButton("В корзину", false, () => { //если товара в корзине нет и по кнопке клик - 
          cart.addToCart(product); //добавляем товар в моделях
          updateButton(); //меняем состояние кнопки
        })
      }
    }

  }
  updateButton(); //определяется состояние кнопки на данный момент
  modal.content = preview.render(product); //передаем предпросмотр в модалку
  modal.open(); // открываем
})

//изменение корзины
events.on("cart:change", () => {
  header.counter = cart.getQuantityItems();
  if(basketNow && basketOpen) { //если корзина уже создана и открыта
    updateBasket();
  }
})

//открытие корзины
events.on("basket:open", () => {
  const basketTemplate = cloneTemplate("#basket");
  if(!basketNow) { //если корзина ни разу не открывалась
    basketNow = new Basket(basketTemplate, events); //создаем экземпляр
  }
  updateBasket(); //и обновляем содержимое корзины
  modal.content = basketNow.render(); //добавляем в модальное окно
  modal.open();
  basketOpen = true;
})

//закрытие модального окна
events.on("modal:close", () => {
  basketOpen = false;
  modal.close();
})

//открытие формы с оплатой, 1 шаг
const orderFormOpen = () => {
  const templateOrder = cloneTemplate('#order');
  const formOrder = new FormOrder(templateOrder, events);
  const orderChangeHandler = (data: Partial<TFormOrder>) => { //обработчик изменения 
    if(data.address !== undefined) {
      customer.setAddress(data.address); //добавляем в customer данные, которые передал пользователь
    }
    if(data.payment === "card" || data.payment === "cash") {
      customer.setPayment(data.payment)
    }

    const err = customer.validateField(); //проверяем на ошибки (пустоту)
    let messageErr = ''; //переменная для текста ошибок
    if(err.address) {
      messageErr = messageErr + err.address + '\n'
    }
    if (err.payment) {
      messageErr = messageErr + err.payment;
    }

    formOrder.err = messageErr.trim(); //передали данные об ошибках в представления для отрисовки
    formOrder.enableButton = !err.address &&!err.payment; //если ни в одном поле нет ошибок - разблокируется кнопка "далее"
  }

  const orderSubmitHandler = () => { // обработчик отправки формы
    events.off("order:change", orderChangeHandler);// убираем обработчики, т.к. при каждом вызове формы будет появляться новый обработчик
    events.off("order:submit", orderSubmitHandler);
    formContactsOpen(); // открыть контакты
  }
  events.on("order:change", orderChangeHandler)
  events.on("order:submit", orderSubmitHandler)
  modal.content = formOrder.render();
  modal.open();
}

//открытие формы с контактами, 2 шаг
const formContactsOpen = () => {
  const templateContacns = cloneTemplate("#contacts");
  const formContacts = new FormContacts(templateContacns, events);
  const contactsChangeHandler = (data: Partial<TFormContacts>) => {
    if(data.phone !== undefined) {
      customer.setPhone(data.phone);
    }
    if(data.email !== undefined) {
      customer.setEmail(data.email)
    }
    const err = customer.validateField();
    let messageErr = "";

    if(err.phone) {
      messageErr = messageErr + err.phone + "\n"
    }
    if(err.email) {
      messageErr = messageErr + err.email;
    }
    formContacts.err = messageErr.trim();
    formContacts.enableButton = !err.phone && !err.email;
  }
  const contactsSubmitHandler = () => {
    events.off("contacts:change", contactsChangeHandler);
    events.off("contacts:submit", contactsSubmitHandler);
    const postData: IOrderRequest = { //объединяем данные для отправки
      ...customer.getAllData(),
      total: cart.getTotalPrice(),
      items: cart.getCartItems().map(item => item.id)
    }

    larekApi.postOrder(postData).then(() => { //сам запрос
      const templateSuccess = cloneTemplate("#success");
      const succes = new Success(events, templateSuccess);
      succes.totalPrice = cart.getTotalPrice();
      modal.content = succes.render();
      modal.open();
      cart.clearCart();
      customer.clearCustomerInfo();
    }).catch(err => console.log("ошибка " + err));
  }
  events.on("contacts:change", contactsChangeHandler);
  events.on("contacts:submit", contactsSubmitHandler);

  modal.content = formContacts.render();
  modal.open()
}

//клик по кнопке оформления заказа в корзине
events.on("basket:order", () => {
  orderFormOpen();
})

larekApi.getAllProducts().then((result) => {
  products.setProducts(result.items);
}).catch(err => console.log("Ошибка " + err));
