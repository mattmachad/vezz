export interface PurchasedItem {
    id: number;
    name: string;
    price: number;
    size: string;
    quantity: number;
    image: string;
}

export type PurchasedItems = PurchasedItem[];
