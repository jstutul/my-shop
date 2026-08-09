import { OrderDetailsItem } from "./orderdetailsitem-model";

export interface OrderDetails {
    orderId: number;
    orderNo: string;
    orderDate: string;
    status: string;
    orderBy: string;
    email: string;
    phoneNo: string | null;
    totalAmount: number;
    items: OrderDetailsItem[];

}