import { computed, Injectable, signal } from '@angular/core';
import { OrderList } from '../models/order-list.model';

@Injectable({
  providedIn: 'root',
})
export class OrderState {
  private _orderList = signal<OrderList[]>([]);
  readonly orderList = this._orderList.asReadonly();
  readonly totalOrder = computed(()=> this.orderList().length);
  readonly totalDelivered = computed(()=> this.orderList().filter(x=>x.status=="Delivered").length)
  readonly totalPending = computed(()=> this.orderList().filter(x=>x.status=="Pending").length)
  readonly totalOrderAmount =computed(()=>this.orderList().reduce((sum,order)=>sum+order.totalAmount,0))
  setOrder(orders:OrderList[]){
    this._orderList.set(orders);
  }
}
