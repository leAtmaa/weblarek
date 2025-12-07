import { IApi, IProduct, IProductListResponse, IOrder, IOrderResponse } from '../types/index';

export class WebLarekAPI { //взаимодействия с API сервера "Веб-Ларёк"
    
    constructor(private api: IApi) {}

    getProductList(): Promise<IProduct[]> {
        return this.api.get<IProductListResponse>('/product/')
            .then(response => response.items);
    } //  Вызываем this.api.get() - возвращает Promise
      //  Когда Promise разрешится, получаем response
      //  Из response достаем items (массив товаров)
      //  Возвращаем этот массив обернутый в Promise

    orderProducts(order: IOrder): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order', order);
    }
      //  Принимает: order: IOrder — объект заказа
      //  Возвращает: Promise<IOrderResponse> — промис с ответом на заказ
}