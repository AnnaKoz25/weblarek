import "./scss/styles.scss";
import { Products } from "./components/Models/Products";
import { Cart } from "./components/Models/Cart";
import { Customer } from "./components/Models/Customer";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { BusinessApi } from "./components/Models/BusinessApi";

const products = new Products();
const cart = new Cart();
const customer = new Customer();

console.log("------------------------Проверка каталога товаров---------------------------");
products.setProducts(apiProducts.items);
console.log("Массив товаров из каталога:", products.getProducts());
console.log("Поиск товара по id", products.getProductById(""));
products.setSelectedProduct(apiProducts.items[0]);
console.log("Выбранный товар ", products.getSelectedProduct());

console.log("-------------------------Проверка корзины--------------------------");
cart.addToCart(apiProducts.items[0]);
cart.addToCart(apiProducts.items[1]);
cart.addToCart(apiProducts.items[2]);
cart.addToCart(apiProducts.items[3]);
console.log("В корзину добавились товары: ", cart.getCartItems());
cart.removeFromCart(apiProducts.items[3].id);
console.log("Удаление одного товара из корзины. Товары в корзине: ", cart.getCartItems());
console.log("Общая стоимость товаров в корзине: ", cart.getTotalPrice());
console.log("Количество товаров в корзине: ", cart.getQuantityItems());
console.log(`Проверка, есть ли товар ${apiProducts.items[1].title} в корзине`, cart.isInCart(apiProducts.items[1].id));
cart.clearCart();
console.log("Состояние корзины после очистки: ", cart.getCartItems());

console.log("-----------------------Проверка данных покупателя-----------------------");
console.log("Данные покупателя: ", customer.getAllData())
customer.setPayment('card');
console.log("Данные покупателя после добавления типа оплаты ", customer.getAllData());
console.log("Проверка валидации ", customer.validateField());
customer.setAddress("Москва");
console.log("Данные покупателя после добавления адреса доставки ", customer.getAllData());
console.log("Проверка валидации ", customer.validateField());
customer.setPhone("123456");
console.log("Данные покупателя после добавления номера телефона ", customer.getAllData());
console.log("Проверка валидации ", customer.validateField());
customer.setEmail("e-mail");
console.log("Данные покупателя после добавления электронной почты ", customer.getAllData());
console.log("Проверка валидации ", customer.validateField());
customer.clearCustomerInfo();
console.log("Данные покупателя после очистки всех полей ", customer.getAllData());
console.log("Проверка валидации после очистки всех данных покупателя ", customer.validateField());

const api = new Api(API_URL);
const larekApi = new BusinessApi(api);

larekApi.getAllProducts().then((result) => {
    products.setProducts(result.items);
    console.log("Массив товаров из каталога API:", products.getProducts());
})