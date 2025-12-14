export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

//Тип оплаты товара
export type TPayment = "online" | "cash" | null;

//Интерфейс товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

//Интерфейс покупателя
export interface IBuyer {
  payment: TPayment| undefined;
  email: string;
  phone: string;
  address: string;
}

//Bнтерфейс описывающий данные о заказе
export interface TOrder { 
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

//Интерфейс галлереи
export interface IGallery {
  items: HTMLElement[];
}

// Ответ API со списком товаров
export interface IProductListResponse {
    total: number;
    items: IProduct[];
}

// Данные заказа для отправки на сервер
export interface IOrder extends IBuyer {
    total: number;
    items: string[]; // массив ID товаров
}

// Ответ сервера после оформления заказа
export interface IOrderResponse {
    id: string;
    total: number;
}

export interface ICatalogData {
  total: number;
  items: IProduct[];
}

// Интерфейс счетчика корзины
export interface IHeader {
  counter: number;
}

// Интерфейс товара в корзине
export interface IBasketData {
  items: HTMLElement[];
  total: number;
}

// Интерфейс суммы списания
export interface ISuccess {
  total: number;
}

// Интерфейс действие с карточкой в корзине
export interface ICardBasketActions {
  onRemove?: () => void;
}

// Интерфейс выбор карточки из каталога
export interface ICardActions {
  onClick?: () => void;
}

// Интерфейс предпросмотра карточки товара
export interface ICardPreviewActions {
  onChange?: () => void;
}

export const SYNAPSE_CURRENCY_NAME = "синапсов"; // Валюта

// События
export const EVENTS = {
 catalog: {
    changed: "catalog:changed",
    select: "catalog:select",  // Должно быть
  },

  card: {
    remove: "card:remove",
    toggle: "card:toggle",     // Должно быть
  },

  basket: {
    open: "basket:open",
    checkout: "basket:checkout",
  },

  cart: {
    changed: "cart:changed",
    clear: "cart:clear",
  },

  order: {
    submit: "order:submit",
    address: "order:address",
    payment: "order:payment",
  },

  contacts: {
    submit: "contacts:submit",
    email: "contacts:email",
    phone: "contacts:phone",
  },

  buyer: {
    paymentChanged: "buyer:payment-changed",
    addressChanged: "buyer:address-changed",
    emailChanged: "buyer:email-changed",
    phoneChanged: "buyer:phone-changed",
    dataChanged: "buyer:data-changed",
    clear: "buyer:clear",
  },

  success: {
    close: "success:close",
  },

  modal: {
    close: "modal:close",
  },
} as const;