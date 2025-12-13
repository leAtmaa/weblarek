# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

В приложении используются две сущности, которые описывают данные.

#### IProduct - интерфейс описывающий товар.
Поля:
  `id: string` - уникальный идендификатор;
  `description: string` - описание товара;
  `image: string` - путь изображения товара;
  `title: string` - название товара;
  `category: string` - категория товара;
  `price: number | null` - цена товара.

#### IBuyer - интерфейс описывающий данные покупателя.
Поля:
  `payment: TPaymen` - способ оплаты;
  `email: string` - электронная почта покупателя;
  `phone: string` - телефон покупателя;
  `address: string` - адрес покупателя.

#### TOrder - интерфейс описывающий данные о заказе.
Поля:
  `payment: TPaymen` - способ оплаты;
  `email: string` - электронная почта покупателя;
  `phone: string` - телефон покупателя;
  `address: string` - адрес покупателя;
  `total: number` - сумма заказа;
  `items: string[]` - массив с id товаров.


### Модели данных

#### Классы для учета данных в приложении.

#### ProductСatalog - класс основной страницы с указанием каталога товаров.

Методы класса:
`setProducts(products: IProduct[]): void` - сохранение массива товаров полученного в параметрах модели;
`getProducts(): IProduct[]` - получение массива товаров из модели;
`getProductById(id: string): IProduct | undefined` - получение одного товара по его id;
`setSelectedProduct(product: IProduct): void` - сохранение товара для подробного отображения;
`getSelectedProduct(): IProduct | null` - получение товара для подробного отображения.

#### Cart - класс корзины выбранных товаров.

Методы класса:
`getItems(): IProduct[]` - получение массива товаров, которые находятся в корзине;
`addItem(product: IProduct): void` - добавление товара, который был получен в параметре, в массив корзины;
`removeItem(productId: string): void` - удаление товара, полученного в параметре из массива корзины;
`clear(): void` - очистка корзины;
`getTotalPrice(): number` - получение стоимости всех товаров в корзине;
`getCount(): number` - получение количества товаров в корзине;
`hasItem(productId: string): boolean` - проверка наличия товара в корзине по его id, полученного в параметр метода.

#### Buyer - класс данных о покупателе.

Методы класса:
`setData(data: Partial<IBuyer>): void` - сохранение данных покупателя;
`getData(): IBuyer` - получение всех данных покупателя;
`clear(): void` - очистка данных покупателя;
`validate(): Record<string, string>` - валидация данных.

### Слой коммуникации

#### Интерфейс "Данные каталога"

Интерфейс предназначен для сохранения данных о таварах с сервера

`interface ICatalogData {`
`  length: number;`
`  items: IProduct[];`
`}`
Поля интерфейса: total:number - количество товаров items: IProduct[] - массив содержащий данные товаров

#### Интерфейс "Ответ по заказу"

Интерфейс для типизации ответа сервера после отправки данных заказа.

`export interface IOrderResponse {`
`  id: string;`
`  total: number;`
`}`
Поля интерфейса: id: string - идентификатор заказа total: number - сумма заказа

### Слой представления

#### Интерфейс для шапки сайта
interface IHeader {
  counter: number;
}
Поля интерфейса: counter: number - счетчик товаров в корзине.

#### Класс Header

Класс отвечает за отображение шапки сайта. Наследуется от класса Component<IHeader>

Конструктор: 
`constructor(container: HTMLElement, protected events: IEvents)` - в конструктор передается элемент корневого контейнера и брокер событий

Поля класса: 
`basketButton: HTMLButtonElement` - приватное поле содержащее элемент "кнопка корзины";
`counterElement: HTMLElement` - приватное поле содержащее элемент "счетчик корзины".

Методы: 
`set counter(value: number)`  - метод изменения количества выбраных товаров в шапке.

#### Интерфейс IGallery

`interface IGallery {`
`  items: HTMLElement[];`
`}`

Поля интерфейса: 
`items: HTMLElement[]` - элементы карточек товаров.

#### Класс Gallery

Класс используется для отображения галлереи карточек. Наследуется от Component.

Конструктор: 
`constructor(protected container: HTMLElement)` - в конструктор передается элемент корневого контейнера.

Методы: 
`set items(items: HTMLElement[])` - сеттер для передачи элементов карточек.

#### Класс Card

Абстрактный класс с общим функционалом классов карточек слоя представления.

Конструктор: 
`constructor(protected container: HTMLElement)` - в конструктор передается корневой контейнер класса.

Поля: 
`protected titleElement: HTMLElement | null = null` - элемент с заголовком карточки;
`protected priceElement: HTMLElement | null = null` - элемент с ценой карточки.

Методы: 
`set title(value: string)` - установить отображение заголовока;
`set price(value: number | null)` - установить отображение цены.

#### Интерфейс ICardActions

Интерфейс описывает действия пользователя при взаимодействии с карточкой.

`export interface ICardActions {`
`  onClick?: () => void;`
`}`

Поля интерфейса: 
`onClick?: () => void` - колбэк при нажатии на карточку.

#### Класс CardCatalog

Класс слоя представления отвечающий за отображение карточки в каталоге. Потомок класса CardCard.

Конструктор: 
`constructor(protected container: HTMLElement, actions?: ICardActions)` - в конструткор передается корневой элемент контейнер и необязательное поле с колбэками для обработки действий польователя.

Поля: 
`protected imageElement: HTMLImageElement` - элемент-картинка карточки protected;`categoryElement: HTMLElement` - элемент обозначающий категорию.

Методы: 
`set category(value: string)` - установка отображения категории; 
`set image(value: string)` - установка url к картинке.

#### Класс CardPreview

Класс слоя представления отвечающий за отображение карточки в виде превью. Потомок Card.

Конструктор: 
`constructor(protected container: HTMLElement, actions?: ICardActions)` - в конструткор передается корневой элемент контейнер и необязательное поле с колбэками для обработки действий пользователя.

Поля: 
`protected descriptionElement: HTMLElement` - элемент с описанием товара;
`protected buttonElement: HTMLButtonElement` - кнопка "купить";
`protected categoryElement: HTMLElement` - элемент категория товара;
`protected imageElement: HTMLImageElement` - элемент с картинкой товара.

Методы: 
`set isInCart(value: boolean)` - сеттер установливающий надпись на кнопке;
`set category(value: string)` - устанавливает отображение категории;
`set image(value: string)` - устанавливает url к картинке товара;
`setButtonDisabled(value: boolean): void` - управляет доступностью кнопки.

#### Интерфейс ICardBasketActions

Интерфейс описывает действия пользователя при взаимодействии с карточкой в корзине.

`export interface ICardBasketActions {`
`  onRemove?: () => void;`
`}`

Поля: 
`onRemove?: () => void` - колбэк при нажатии на кнопку "удалить" в карточке.

#### Класс CardBasket

Класс слоя представления отвечающий за отображение карточки в корзине.

Конструктор: 
`constructor(protected container: HTMLElement, actions?: ICardBasketActions)` - в конструткор передается корневой элемент контейнер и необязательное поле с колбэками для обработки действий польователя.

Поля: 
`protected indexElement: HTMLElement | null = null` - элемент с порядковым номером товара в заказе;
`protected deleteButton: HTMLButtonElement | null = null` - кнопка удаления товара из корзины.

Методы: 
`setIndex(index: number): void` - устанавливает номер товара в корзине.

#### Класс Form

Абстрактный класс содержащий общую для всех форм функциональность.

Конструктор: 
`constructor(protected container: HTMLFormElement, protected events: IEvents)` - в конструткор передается корневой элемент контейнер и брокер событий.

Поля:
`protected submitButton: HTMLButtonElement` - кнопка сабмит;
`protected errorsElement: HTMLElement` - элемент с ошибками валидации.

Методы: 
`set submitButtonDisabled(state: boolean)` - определяет доступность кнопки сабмита.

#### Класс OrderForm

Класс отвечающий за то, как будет выглядеть форма заказа потомок Form.

Конструктор: 
`constructor(protected container: HTMLFormElement, protected events: IEvents)` - в конструктор передается корневой контейнер и брокер событий.

Поля: 
`protected onlineButton: HTMLButtonElement` - кнопка выбора онлайн-оплаты;
`protected cashButton: HTMLButtonElement` - кнопка выбора оплаты наличными;
`protected addressInput: HTMLInputElement` - поле адреса.

Методы: 
`setPayment(payment: TPayment): void` - устанавливает оформление кнопок онлайн и наличной оплаты в зависимости от переданного параметра;
`setErrors(errors: Partial<TBuyerErrors>): void` - отображает переданные ошибки в форме.

#### Класс ContactsForm

Класс отвечающий за отображение формы контактов. Потомок Form.

Конструктор: 
`constructor(protected container: HTMLFormElement, protected events: IEvents)` - в конструткор передается корневой элемент контейнер и брокер событий.

Поля:
`protected emailInput: HTMLInputElement`
`protected phoneInput: HTMLInputElement`

Методы:
`setErrors(errors: Partial<TBuyerErrors>): void` - отображает переданные ошибки в форме.

#### Класс Modal

Класс отвечающий за отображение с модального окна

Конструктор: 
`constructor(protected container: HTMLFormElement, protected events: IEvents)` - в конструткор передается корневой элемент контейнер и брокер событий.

Поля: 
`protected closeButton: HTMLButtonElement`
`protected contentElement: HTMLElement` 
`protected container: HTMLElement`

Методы: 
`setVisible(state: boolean)` - устанавливает видимость модального окна;
`set content(content: HTMLElement)` - устанавливает содержимое модалки.

#### Интерфейс ISuccess

Интерфейс описывает данные которые необходимы для работы с компонентом Success.

`export interface ISuccess {`
`  total: number;`
`}`

Поля:
`total: number` - итоговая сумма заказа.

#### Класс Success

Класс Success это наследник класса Component.

Конструктор: 
`constructor(protected container: HTMLElement, protected events: IEvents)` - в конструткор передается корневой элемент контейнер и брокер событий.

Поля: 
`protected closeElement: HTMLButtonElement` - кнопка "закрыть";
`protected descriptionElement: HTMLElement` - итогвая сумма по заказу.

Методы: 
`set total(value: number)` - установить итоговую сумму.

###  Словарь событий

```typescript
export const EVENTS = {
  catalog: {
    changed: "catalog:changed", //событие изменнения данных модели корзины
    select: "catalog:select", //выбор товара для превью
  },

  card: {
    remove: "card:remove", //удалить карточку из корзины
  },

  basket: {
    open: "basket:open",         //открытие корзины
    checkout: "basket:checkout", //подтверждение списка товаров
  },

  cart: {
    changed: "cart:changed", //изменение в объекте корзины
  },

  order: {
    submit: "order:submit",   //подтверждение заказа
    address: "order:address", //изменение поля адреса
    payment: "order:payment", //изменение типа оплаты
    success: "order:success", //удачное завершение заказа
  },

  contacts: {
    submit: "contacts:submit", //подтверждение контактных данныъ
    email: "contacts:email",   //изменение поля эл.почты
    phone: "contacts:phone",   //изменение поля номера телефона
  },

  buyer: {
    paymentChanged: "buyer:payment-changed", //изменение типа оплаты в модели данных
    addressChanged: "buyer:address-changed", //изменение адреса в модели данных
    emailChanged: "buyer:email-changed",     //изменение эл.почты в модели данных
    phoneChanged: "buyer:phone-changed",     //изменение номера телефона в модели данных
    dataChanged: "buyer:data-changed",       //изменение данных покупателя
  },

  success: {
    close: "success:close", //событие закрытия окна успешного оформления заказа
  },

  modal: {
    close: "modal:close", //событие закрытия модалки
  },
} as const;