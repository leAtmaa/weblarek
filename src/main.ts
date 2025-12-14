import "./scss/styles.scss";
import { ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { Header } from "./components/views/header/Header";
import { Modal } from "./components/views/modal/Modal";
import { Basket } from "./components/views/basket/Basket";
import { API_URL } from "./utils/constants";
import { cloneTemplate } from "./utils/utils";
import { Gallery } from "./components/views/gallery/Gallery";
import { Buyer } from "./components/models/Buyer";
import { Cart } from "./components/models/Cart";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { DataExchanger } from "./components/base/Communication";
import { OrderForm } from "./components/views/forms/OrderForm";
import { ContactsForm } from "./components/views/forms/ContactsForm";
import { Success } from "./components/views/success/Success";
import { Api } from "./components/base/Api";
import { EVENTS } from "./types";
import { CardCatalog } from "./components/views/card/CardCatalog";
import { CardPreview } from "./components/views/card/CardPreview";
import { CardBasket } from "./components/views/card/CardBasket";
import { IProduct, IBuyer, TPayment } from "./types";
import { CDN_URL } from "./utils/constants";

const headerElement = ensureElement<HTMLElement>(".header");
const modalElement = ensureElement<HTMLElement>("#modal-container");
const basketElement = ensureElement<HTMLTemplateElement>("#basket");
const galleryElement = ensureElement<HTMLElement>("main");

const events = new EventEmitter();
const header = new Header(headerElement, events);
const modal = new Modal(modalElement, events);
const basket = new Basket(cloneTemplate(basketElement), events);
const gallery = new Gallery(galleryElement);

const api = new Api(API_URL);
const buyer: Buyer = new Buyer(events);
const cart: Cart = new Cart(events);
const catalog: ProductCatalog = new ProductCatalog(events);
const dataExchanger: DataExchanger = new DataExchanger(api);

const orderFormElement = ensureElement<HTMLTemplateElement>("#order");
const contactsFormElement = ensureElement<HTMLTemplateElement>("#contacts");
const succesElement = ensureElement<HTMLTemplateElement>("#success");

const orderForm: OrderForm = new OrderForm(cloneTemplate(orderFormElement), events);
const contactsForm: ContactsForm = new ContactsForm(cloneTemplate(contactsFormElement), events);
const success: Success = new Success(cloneTemplate(succesElement), events);

const cardPreviewElement = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");

events.on(EVENTS.catalog.changed, () => {
  const itemCards = catalog.getProducts().map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => {
        events.emit(EVENTS.card.preview, product); // В колбэке теперь только эмит
      },
    });
    return card.render(product);
  });

  gallery.items = itemCards;
});

events.on<IProduct>(EVENTS.card.preview, (product) => {
  catalog.setSelectedProduct(product);
  openPreview(product);
});

events.on(EVENTS.basket.open, () => {
  modal.content = basket.render();
  modal.setVisible(true);
});

events.on<IProduct>(EVENTS.card.remove, (product) => {
  cart.removeItem(product.id);
  events.emit(EVENTS.card.update, product);
});

events.on(EVENTS.cart.changed, () => {
  const total = cart.getTotalPrice();
  const count = cart.getCount();

  const basketCards = cart.getItems().map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onRemove: () => events.emit(EVENTS.card.remove, product),
    });
    card.setIndex(index + 1);
    return card.render(product);
  });
  basket.items = basketCards;

  basket.checkoutButtonDisabled = cart.getCount() === 0;
  basket.total = total;
  header.counter = count;

  if (count > 0) {
    basket.setFulltBasketTitle();
  } else {
    basket.setEmptytBasketTitle();
  }
});

events.on<IProduct>(EVENTS.card.toggle, (product) => {
  if (cart.hasItem(product.id)) {
    cart.removeItem(product.id);
  } else {
    cart.addItem(product);
  }
  events.emit(EVENTS.card.update, product);
});

events.on<IProduct>(EVENTS.card.update, (product) => {
  if (modal.isOpen) {
    const selectedProduct = catalog.getSelectedProduct();
    if (selectedProduct && selectedProduct.id === product.id) {
      const card = new CardPreview(cloneTemplate(cardPreviewElement), {
        onChange: () => {
          events.emit(EVENTS.card.toggle, product);
        },
      });
      
      if (product.price === null) {
        card.setButtonDisabled(true);
      }

      card.isInCart = cart.hasItem(product.id);
      modal.content = card.render(product);
    }
  }
});

events.on(EVENTS.basket.checkout, () => {
  const buyerData = buyer.getData();
  const errors = buyer.validate();
  const hasErrors = "address" in errors || "payment" in errors;

  orderForm.setErrors(errors);
  orderForm.submitButtonDisabled = hasErrors;
  
  modal.content = orderForm.render({
    payment: buyerData.payment,
    address: buyerData.address,
  });
  modal.setVisible(true);
});

events.on(EVENTS.order.submit, () => {
  const buyerData = buyer.getData();
  const errors = buyer.validate();
  const hasErrors = "email" in errors || "phone" in errors;

  contactsForm.setErrors(errors);
  contactsForm.submitButtonDisabled = hasErrors;
  
  modal.content = contactsForm.render({
    email: buyerData.email,
    phone: buyerData.phone,
  });
  modal.setVisible(true);
});

events.on<{ address: string }>(EVENTS.order.address, (data) => {
  buyer.setAddress(data.address);
});

events.on<{ payment: TPayment }>(EVENTS.order.payment, (data) => {
  buyer.setPayment(data.payment);
});

events.on<{ email: string }>(EVENTS.contacts.email, (data) => {
  buyer.setEmail(data.email);
});

events.on<{ phone: string }>(EVENTS.contacts.phone, (data) => {
  buyer.setPhone(data.phone);
});

events.on<{ payment: TPayment }>(EVENTS.buyer.paymentChanged, (data) => {
  orderForm.payment = data.payment;
  const errors = buyer.validate();
  orderForm.setErrors(errors);
  orderForm.submitButtonDisabled = "address" in errors || "payment" in errors;
});

events.on(EVENTS.buyer.addressChanged, () => {
  const errors = buyer.validate();
  orderForm.setErrors(errors);
  orderForm.submitButtonDisabled = "address" in errors || "payment" in errors;
});

events.on(EVENTS.buyer.emailChanged, () => {
  const errors = buyer.validate();
  contactsForm.setErrors(errors);
  contactsForm.submitButtonDisabled = "email" in errors || "phone" in errors;
});

events.on(EVENTS.buyer.phoneChanged, () => {
  const errors = buyer.validate();
  contactsForm.setErrors(errors);
  contactsForm.submitButtonDisabled = "email" in errors || "phone" in errors;
});

events.on(EVENTS.contacts.submit, () => {
  const orderData: IBuyer = buyer.getData();
  const items = cart.getItems().map((item) => item.id);

  dataExchanger
    .sendOrder({
      ...orderData,
      items,
      total: cart.getTotalPrice(),
    })
    .then((result) => {
      success.total = result.total;
      modal.content = success.render();
      modal.setVisible(true);
      cart.clear();
      buyer.clear();
    })
    .catch((error) => {
      console.error("Ошибка отправки заказа:", error);
    });
});

events.on(EVENTS.success.close, () => {
  modal.setVisible(false);
});

events.on(EVENTS.modal.close, () => {
  modal.setVisible(false);
});

function loadCatalog() {
  dataExchanger
    .getProducts()
    .then((catalogData) => {
      catalogData.items.map((item) => (item.image = CDN_URL + item.image));
      catalog.setProducts(catalogData.items);
    })
    .catch((error) => console.log("Ошибка при получении данных:", error));
}

function openPreview(product: IProduct): void {
  const card = new CardPreview(cloneTemplate(cardPreviewElement), {
    onChange: () => {
      events.emit(EVENTS.card.toggle, product); // В колбэке теперь только эмит
    },
  });
  
  if (product.price === null) {
    card.setButtonDisabled(true);
  }

  card.isInCart = cart.hasItem(product.id);
  modal.content = card.render(product);
  modal.setVisible(true);
}

loadCatalog();