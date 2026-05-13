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
const customer = new Customer(events);

const api = new Api(API_URL);
const larekApi = new BusinessApi(api);

const wrapper = ensureElement<HTMLElement>(".page__wrapper"); //HTMLElement обертка, в которой ищем галерею
const gallery = new Gallery(wrapper); //нашли элемент с галереей и это объект
const header = new Header(events, wrapper);
const modalTemplate = ensureElement("#modal-container");
const modal = new Modal(events, modalTemplate);
const basketTemplate = cloneTemplate("#basket");
const basket = new Basket(basketTemplate, events);
updateBasket()
const previewTemplate = cloneTemplate("#card-preview");
const preview = new CardPreview(previewTemplate)
const orderTemplate = cloneTemplate("#order")
const formOrder = new FormOrder(orderTemplate, events)
const templateContacns = cloneTemplate("#contacts");
const formContacts = new FormContacts(templateContacns, events);
const successTemplate = cloneTemplate("#success");
const success = new Success(events, successTemplate);

function updateBasket(): void { //функция для изменения и перерисовки списка товаров в корзине
  const listItems = cart.getCartItems();
  const totalPrice = cart.getTotalPrice();

  const cards = listItems.map((product, index) => { //получим массив карточек-элементов
    const template = cloneTemplate("#card-basket");
    const card = new CardBasket(template, {
      onRemoveFromBasket: () => events.emit("basket:remove", product) 
    });
    card.title = product.title;
    card.price = product.price;
    card.index = index + 1; //карточку для отрисовки заполнили данными
    return card.render();
  })

  basket.setListItems(cards); //добавили получившийся массив в обертку корзины
  basket.basketPrice = totalPrice;
  basket.orderButtonEnabled = listItems.length > 0; //если корзина пуста - кнопка заблокирована
}

function updateButton (product: IProduct) { //динамическое изменение состояния кнопки !ФУНКЦИЯ!
  if(product.price === null) { // если цены нет - 
    preview.setButton("Недоступно", true) //кнопка заблокирована
  } else {
    if(cart.isInCart(product.id)) { //если товар в корзине - 
      preview.setButton("Удалить из корзины", false, () => { //меняем кнопку и если по измененной кнопке клик - эмит
        events.emit("basket:remove", product)
      })
    } else {
      preview.setButton("В корзину", false, () => { //если товара в корзине нет и по кнопке клик - эмит
        events.emit("basket:add", product);
      })
    }
  }
}

//удаление из корзины
events.on("basket:remove", (product: IProduct) => {
  cart.removeFromCart(product.id);
  modal.close();
})

//добавление в корзину
events.on("basket:add", (product: IProduct) => {
  cart.addToCart(product);
  modal.close()
})

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
  products.setSelectedProduct(product);
})

//выбранный товар
events.on("selectProduct:change", (data: {product: IProduct}) => {
  const product = data.product;
  preview.title = product.title;
  preview.price = product.price
  preview.image = product.image
  preview.category = product.category
  preview.description = product.description //передали данные из модели в представления
  
  updateButton(product); //определяется состояние кнопки на данный момент
  modal.content = preview.render(product); //передаем предпросмотр в модалку
  modal.open(); // открываем
})

//изменение корзины
events.on("cart:change", () => {
  header.counter = cart.getQuantityItems();
  updateBasket();
})

//открытие корзины
events.on("basket:open", () => {
  modal.content = basket.render();
  modal.open();
})

//закрытие успешного модального окна
events.on("modalSuccess:close", () => {
  modal.close();
})

//изменение в модели покупателя
events.on("customer:change", () => {
  const data= customer.getAllData();
  formOrder.payment = data.payment;
  formOrder.address = data.address;
  formContacts.phone = data.phone;
  formContacts.email = data.email;
  const err = customer.validateField();

  let orderMessageErr = "";
  if(err.payment) {
    orderMessageErr = orderMessageErr + err.payment + '\n';
  }
  if(err.address) {
    orderMessageErr = orderMessageErr + err.address;
  }
  formOrder.err = orderMessageErr.trim();
  formOrder.enableButton = !err.payment && !err.address;

  let contactsMessageErr = "";
  if(err.phone) {
    contactsMessageErr = contactsMessageErr + err.phone + '\n';
  }
  if(err.email) {
    contactsMessageErr = contactsMessageErr + err.email;
  }
  formContacts.err = contactsMessageErr.trim();
  formContacts.enableButton = !err.phone && !err.email;
})

//изменение в заказе
events.on("order:change", (data: Partial<TFormOrder>) => {
  if(data.payment === "card" || data.payment === "cash") {
    customer.setPayment(data.payment);
  }
  if(data.address !== undefined) {
    customer.setAddress(data.address)
  }
})

//изменение в контактах
events.on("contacts:change", (data: Partial<TFormContacts>) => {
  if(data.phone !== undefined) {
    customer.setPhone(data.phone)
  }
  if(data.email !== undefined) {
    customer.setEmail(data.email)
  }
})

//отправка формы заказа
events.on("order:submit", () => {
  modal.content = formContacts.render();
  modal.open();
})

//отправка всех данных
events.on("contacts:submit", () => {
  const postData: IOrderRequest = {
    ...customer.getAllData(),
    total: cart.getTotalPrice(),
    items: cart.getCartItems().map(item => item.id)
  };
  larekApi.postOrder(postData).then((result) => {
    success.totalPrice = result.total;
    modal.content = success.render()
    modal.open();
    cart.clearCart();
    customer.clearCustomerInfo()
  }).catch((err) => console.log("Ошибка" + err))
})

//клик по кнопке оформления заказа в корзине
events.on("basket:order", () => {
  modal.content = formOrder.render();
  modal.open();
})

larekApi.getAllProducts().then((result) => {
  products.setProducts(result.items);
}).catch(err => console.log("Ошибка " + err));
