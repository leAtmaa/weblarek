import './scss/styles.scss';

//Создание экземпляров всех созданных классов.
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { WebLarekAPI } from './components/WebLarekAPI';
import { apiProducts } from './utils/data';


const catalog = new ProductCatalog();
const basket = new Basket();
const buyer = new Buyer();
const api = new Api(API_URL);
const webLarekAPI = new WebLarekAPI(api);
const productId = 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9';

//Тестирование всех методов моделей данных. Выполняется тестирование вызовом методов с передачей необходимых данных и проверкой результатов с помощью вывода данных в консоль. Данные, выводимые в консоль, должны быть также получены с использованием методов классов.
console.log('\n=== ТЕСТИРОВАНИЕ Basket ===');
basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);
console.log('1. addItem() - добавлены 2 товара');
console.log('2. getItems() - товары в корзине:', basket.getItems());
console.log('3. getCount() - количество товаров:', basket.getCount());
console.log('4. getTotalPrice() - общая стоимость:', basket.getTotalPrice());
console.log('5.existenceProduct() - проверка наличия товара:', basket.existenceProduct(productId));
basket.deleteItem(productId);
console.log('6. deleteItem() - после удаления товара:', basket.getItems());
basket.clear();

// === ТЕСТИРОВАНИЕ Buyer ===
console.log('\n=== ТЕСТИРОВАНИЕ Buyer ===');
console.log('1. validate() - валидация пустых данных:', buyer.validate());
buyer.setField('email', 'test@test.ru');
console.log('2. setField(email) - установлен email:', buyer.getData());
buyer.setField('phone', '+79991234567');
buyer.setField('payment', 'card');
buyer.setField('address', 'Москва, ул. Ленина, 1');
console.log('3. getData() - все данные покупателя:', buyer.getData());
console.log('4. validate() - валидация полных данных:', buyer.validate());
buyer.clear();
console.log('5. clear() - после очистки данных:', buyer.getData());

// === ТЕСТИРОВАНИЕ ProductCatalog ===
console.log('=== ТЕСТИРОВАНИЕ ProductCatalog ===');
catalog.setItems(apiProducts.items);
console.log('1. setItems() + getItems() - каталог товаров:', catalog.getItems());
console.log('2. getProductById() - товар по ID:', catalog.getProductById(productId));
catalog.setPreview(apiProducts.items[0]);
console.log('3. setPreview() + getPreview() - товар для просмотра:', catalog.getPreview());

console.log('7. clear() - после очистки корзины:', basket.getItems());
//Запрос к серверу за массивом товаров в каталоге.
console.log('\n=== WebLarekAPI - Запрос к серверу ===');

//Сохранение массива в модели данных и вывод массива в консоль.
webLarekAPI.getProductList()
  .then(products => {
    console.log('getProductList() - товары с сервера:', products);
    catalog.setItems(products);
    console.log('Каталог обновлён из API:', catalog.getItems());
  })
  .catch(error => {
    console.error('Ошибка загрузки товаров с сервера:', error);
  });