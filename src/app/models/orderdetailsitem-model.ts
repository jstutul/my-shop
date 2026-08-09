export interface OrderDetailsItem {
    productId: number;
    productName: string;
    imageUrl: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}