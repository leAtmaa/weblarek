import { IProduct } from '../../types/index';

export class Basket {
    protected items: IProduct[] = [];
    
    getItems(): IProduct[] {
        return [...this.items];
    } // Массив товаров из корзины

    addItem(product: IProduct): void {
        this.items.push(product);
    } // Добавить товар в корзину, тип void буквально "ничего"

    deleteItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
    } // Удаляем товар из корзины по ID

    clear(): void {
        this.items = [];
    } // Очистка корзины

    getTotalPrice(): number {
        return this.items.reduce((sum, item) => {
            return sum + (item.price ?? 0);
        }, 0);
    } // Сумма всех товаров в корзине

    getCount(): number {
        return this.items.length;
    } // Получаем количество товаров в корзине

    existenceProduct(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    } // Проверка наличия товара в корзине по его ID
}