export interface OrderRequest {
    fullName: string;
    email: string;
    shippingAddress: string;
    paymentMethod: string;
    items: CartItemRequest[];
}
export interface CartItemRequest {
    productId: string;
    quantity: number;
}

export interface OrderResponse {
    orderId: number;
    orderDate: Date;
    totalAmount: number;
    orderStatus: string;
}