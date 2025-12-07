import { IProduct } from '../../types/index';

export class ProductCatalog {
    protected items: IProduct[] = [];
    protected preview: IProduct | null = null;

    setItems(items: IProduct[]): void {
        this.items = items;
    } // Хранит массив всех товаров

    getItems(): IProduct[] {
        return this.items;
    } // Получение массива всех данных из модели

    getProductById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    } // Получение одного товара по его id

    setPreview(product: IProduct): void {
        this.preview = product;
    } // Сохранение товара для подробного отображения

    getPreview(): IProduct | null {
        return this.preview;
    } // Получение товара для подробного отображения
}